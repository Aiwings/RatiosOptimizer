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
  NavParams,
  ToastController
} from 'ionic-angular';


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
  Subscription
} from 'rxjs/Subscription';
@Component({
  selector: 'circuit-modal',
  templateUrl: 'circuit-modal.html'
})
export class CircuitModalComponent implements OnInit, OnDestroy {

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

  constructor(
    private carProv: CarProvider,
    private gearProv: GearProvider,
    private ratioProv: RatioProvider,
    private circProv: CircuitProvider,
    private viewCtrl: ViewController,
    private params: NavParams,
    private fb: FormBuilder,
    private toastCtrl: ToastController) {
    console.log('Hello CircuitModal Component');


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
  dismiss(): void {
    this.viewCtrl.dismiss();
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

  ngOnInit() {
    this.tire_diam = this.params.get('tire_diam');
    this.v_max = this.params.get('v_max');

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
  ngOnDestroy() {
    this.ratioSub.unsubscribe();
    this.gearSub.unsubscribe();
    this.carSub.unsubscribe();
    this.afterSave.unsubscribe();
  }
  ionViewDidEnter() {
    let circuit = this.circProv.getValue();
    if (circuit.id != 0) {
      if (circuit != this.circForm.value) {
        this.circForm.patchValue({
          id: circuit.id,
          event: circuit.event,
          comments: circuit.comments,
          weather:circuit.weather
        });
      }
    }
  }

}
