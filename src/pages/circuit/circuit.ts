import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ViewController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';

import {
  Subscription
} from 'rxjs/Subscription';

import {
  Circuit
} from '../../app/circuit';
import {
  Car
} from '../../app/car';
import {
  Gearbox
} from '../../app/gearbox';
import {
  Ratio
} from '../../app/ratio';

import {
  CircuitProvider
} from '../../providers/circuit-provider';



@Component({
  selector: 'page-circuit',
  templateUrl: 'circuit.html'
})
export class CircuitPage implements OnInit, OnDestroy {

  carSub: Subscription;
  car: Car;

  @Output()
  onSave: EventEmitter < any > = new EventEmitter();
  afterSave: Subscription;
  gearSub: Subscription;
  gearbox: Gearbox;

  ratios: Ratio[];


  circForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private circProv: CircuitProvider,
    private viewCtrl: ViewController,
    private fb: FormBuilder,
    private toastCtrl: ToastController) {

    this.carSub = this.circProv.getCar().subscribe(car => {
      this.car = car;
    });
    this.gearSub = this.circProv.getGear().subscribe(gb => {
      this.gearbox = gb;
    });

    this.afterSave = this.onSave.subscribe(() => {

      let circuit: Circuit = this.circForm.value;
      if (circuit.car_id != 0 && circuit.gearbox_id != 0) {

        console.log('pass !')
        this.circProv.saveCircuit().then(data => {
          this.toastsuccess.setMessage("Votre circuit a bien été enregistré");
          this.toastsuccess.present();
        }).catch(error => {
          this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde \n " + error.message);
          this.toasterror.present();
        });
      }
    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CircuitPage');
  }

  save(formData) {

    this.onSave.emit();

    if (formData.car_id == 0) {
      this.circProv.addCar(this.car).then((data) => {
        this.circForm.patchValue({
          car_id: this.car.id
        });
        this.onSave.emit();
      }).catch((error) => {
        this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde de la voiture \n " + error.message);
        this.toasterror.present();
      });
    }
    if (formData.gearbox_id == 0) {
      this.circProv.saveGB(this.gearbox).then((data) => {

        this.circForm.patchValue({
          gearbox_id: this.gearbox.id
        });
        this.onSave.emit();
      }).catch((error) => {
        this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde de la BV \n " + error.message);
        this.toasterror.present();
      });
    }

  }
  toastsuccess = this.toastCtrl.create({
    message: '',
    position: 'bottom',
    duration: 3000
  });

  toasterror = this.toastCtrl.create({
    message: '',
    position: 'bottom',
    showCloseButton: true,
    closeButtonText: 'ok'
  });

  ngOnDestroy() {

    this.gearSub.unsubscribe();
    this.carSub.unsubscribe();
    this.afterSave.unsubscribe();
  }
  ngOnInit() {
    let circuit = this.circProv.getCircuit();
    this.circForm = this.fb.group({
      id: circuit.id,
      car_id: circuit.car_id,
      gearbox_id: circuit.gearbox_id,
      name: [circuit.name, Validators.required],
      tire_diam: [{
        value: circuit.tire_diam,
        disabled: true
      }],
      event: [circuit.event, Validators.required],
      v_max: [{
        value: circuit.v_max,
        disabled: true
      }],
      weather: circuit.weather,
      comments: circuit.comments
    });
    this.subscribeToFormChange();
    
  }
  subscribeToFormChange() {
    const circChanges$ = this.circForm.valueChanges;

    circChanges$.subscribe(circuit => {
      if (this.circForm.valid) {
        this.circProv.updatecircuit(circuit);
      }
    });
  }
}
