import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ViewController,
  NavParams
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

  gearSub: Subscription;
  gearbox: Gearbox;

  ratioSub: Subscription;
  ratios: Ratio[];

  tire_diam: number = 0;
  v_max : number =0;
  circuit: Circuit;
  circForm: FormGroup;

  constructor(
    private carProv: CarProvider,
    private gearProv: GearProvider,
    private ratioProv: RatioProvider,
    private circProv: CircuitProvider,
    private viewCtrl: ViewController,
    private params: NavParams,
    private fb: FormBuilder) {
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
  }
  dismiss(): void {
    this.viewCtrl.dismiss();
  }
  save(formData:{}){
    console.log(formData);
  }

  ngOnInit() {
    this.tire_diam = this.params.get('tire_diam');
    this.v_max = this.params.get('v_max');
    console.log(this.tire_diam);
    console.log(this.v_max);

    this.circForm = this.fb.group({
      id: 0,
      car_id: this.car.id,
      gearbox_id: this.gearbox.id,
      name: ['', Validators.required],
      tire_diam:[{value:'', disabled: true}],
      event: ['Essai', Validators.required],
      v_max: [{value:'', disabled: true}],
      ratios: '',
      weather: "",
      comments: ''
    });
    this.circForm.patchValue({
      tire_diam: this.tire_diam,
      v_max : Math.round(this.v_max)
    });
  }
  ngOnDestroy() {
    this.ratioSub.unsubscribe();
    this.gearSub.unsubscribe();
    this.carSub.unsubscribe();
  }

}
