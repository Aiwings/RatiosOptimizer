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
  CarProvider
} from '../../providers/car-provider';
import {
  GearProvider
} from '../../providers/gear-provider';
import {
  RatioProvider
} from '../../providers/ratio-provider';
import {
  CircuitProvider
} from '../../providers/circuit-provider';
import {
  CalculProvider
} from '../../providers/calcul-provider';




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

  ratioSub: Subscription;
  ratios: Ratio[];

  tire_diam: number = 0;
  v_max: number = 0;
  circForm: FormGroup;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private carProv: CarProvider,
    private gearProv: GearProvider,
    private ratioProv: RatioProvider,
    private circProv: CircuitProvider,
    private viewCtrl: ViewController,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private calculProv: CalculProvider) {

    this.carSub = this.carProv.getSelectedCar().subscribe(car => {
      this.car = car;
    });
    this.gearSub = this.gearProv.getGB().subscribe(gb => {
      this.gearbox = gb;
    });

    this.ratioSub = this.ratioProv.getRatios().subscribe(ratios => {
      this.ratios = ratios;
    });

    this.afterSave = this.onSave.subscribe(data => {
      if (data.car_id != 0 && data.gearbox_id != 0) {
        this.circProv.saveCircuit(data);
      }
    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CircuitPage');
  }


  save(formData: Circuit) {
    formData.ratios = this.ratios;
    formData.tire_diam = this.tire_diam;
    formData.v_max = Math.round(this.v_max);
    this.onSave.emit(formData);

    if (formData.car_id == 0) {
      this.carProv.addCar(this.car).then((data) => {
        formData.car_id = this.car.id;
        this.toastsuccess.setMessage("Votre Voiture a bien été sauvegardée");
        this.toastsuccess.present();

        this.onSave.emit(formData);

      }).catch((error) => {
        this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde de la voiture \n " + error.message);
        this.toasterror.present();
      });
    }
    if (formData.gearbox_id == 0) {
      this.gearProv.saveGB(this.gearbox).then((data) => {
        formData.gearbox_id = this.gearbox.id;
        this.toastsuccess.setMessage("Votre BV a bien été sauvegardée");
        this.toastsuccess.present();
        this.onSave.emit(formData);
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
    this.ratioSub.unsubscribe();
    this.gearSub.unsubscribe();
    this.carSub.unsubscribe();
    this.afterSave.unsubscribe();
  }
  ngOnInit() {

    this.circForm = this.fb.group({
      id: 0,
      car_id: this.car.id,
      gearbox_id: this.gearbox.id,
      name: ['', Validators.required],
      tire_diam: [{
        value: '',
        disabled: true
      }],
      event: ['Essai', Validators.required],
      v_max: [{
        value: '',
        disabled: true
      }],
      ratios: '',
      weather: "",
      comments: ''
    });
    this.circForm.patchValue({
      tire_diam: this.tire_diam,
      v_max: Math.round(this.v_max)
    });
  }


  ionViewDidEnter() {
    this.tire_diam = this.calculProv.getDiam();
    this.v_max = this.calculProv.getVmax();
    let circuit = this.circProv.getValue();
    if (circuit.id != 0) {
      if (circuit != this.circForm.value) {
        this.circForm.patchValue({
          id: circuit.id,
          name: circuit.name,
          event: circuit.event,
          comments: circuit.comments,
          weather: circuit.weather
        });
      }
    }
  }

}
