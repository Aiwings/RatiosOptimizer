import {
  Injectable
} from '@angular/core';

import {
  CarProvider
} from './car-provider';
import {
  RatioProvider
} from './ratio-provider';
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import {
  Subscription
} from 'rxjs/Subscription';

import {
  Car
} from '../app/car';
import {
  Ratio
} from '../app/ratio';
@Injectable()
export class CalculProvider {

  constructor(public carProv: CarProvider,
    public ratioProv: RatioProvider) {
    console.log('Hello CalculProvider Provider');

    this.carSub = this.carProv.getSelectedCar().subscribe((car) => {
      this.car = car;
      if (this.ratios) {
        this.calculate();
      }

    });

    this.ratioSub = this.ratioProv.getRatios().subscribe((ratios) => {
      this.ratios = ratios;
      this.calculate();
    });


  }
  private calcul = new BehaviorSubject < {
    max_speed: number[],
    power_drop: number[],
    ratio_diff: any[],
    gap :number[]
  } > ({
    max_speed: [],
    power_drop: [],
    ratio_diff: [],
    gap:[]
  });
  private v_max : number;
  carSub: Subscription;
  ratioSub: Subscription;
  car: Car;
  ratios: Ratio[];

  private tire_diam = 0;


  public setDiam(tire_diam: number): void {
    this.tire_diam = tire_diam;
    this.calculate();
  }
  public getDiam() {
    return this.tire_diam;
  }
  public getCalcul() {
    return this.calcul.asObservable();
  }
  public getVmax()
  {
    return this.v_max;
  }
  private calculateMaxSpeed(): number[] {

    let max_speed = [];
    for (let i = 0; i < this.car.nb_speed; i++) {
      let ratio = this.ratios[i];
      let speed = (Math.PI * this.tire_diam * 0.000001) * this.car.max_engine_speed * 60 * (this.car.bevelgear.a / this.car.bevelgear.b) * (ratio.a / ratio.b)
      max_speed.push(parseFloat((speed).toFixed(2)));
    }
    this.v_max = max_speed[max_speed.length -1];

    console.log("## Max Speed ##");
    console.log(max_speed);

    return max_speed;
  }


  private calculatePowerDrop(max_speed: number[]): number[] {

    let power_drop = [];

    for (let i = 0; i < (this.car.nb_speed - 1); i++) {
      let ratio = this.ratios[i + 1];
      let sub = Math.PI * this.tire_diam * Math.pow(10, -6) * 60 * (this.car.bevelgear.a / this.car.bevelgear.b) * (ratio.a / ratio.b);

      power_drop.push(Math.round(this.car.max_engine_speed - (max_speed[i] / (sub))));
    }
    console.log("## Power Drop ##");
    console.log(power_drop);
    return power_drop;
  }

  public calculate() {
    if (this.car.nb_speed == this.ratios.length) {

      let max_speed = this.calculateMaxSpeed();
      let power_drop = this.calculatePowerDrop(max_speed);
      let ratio_diff = this.calculateDiff(max_speed, power_drop);
      let gap = this.calculateGap(max_speed);
      this.calcul.next({
        max_speed: max_speed,
        power_drop: power_drop,
        ratio_diff: ratio_diff,
        gap:gap
      });
    }
  }
  private calculateGap(max_speed) :number[]
  { 
    let gaps = [];
    for (let i=0; i<max_speed.length -1;i++)
    {
      let gap = parseFloat((max_speed[i + 1] - max_speed[i]).toFixed(2));
      gaps.push(gap);
    }
    return gaps;
  }
  private calculateDiff(max_speed, power_drop): number[] {
    let ratio_diff = [];


    for (let i = 0; i < power_drop.length; i++) {
      ratio_diff.push({
        x: max_speed[i],
        y: this.car.max_engine_speed
      });
      ratio_diff.push({
        x: max_speed[i],
        y: Math.round(this.car.max_engine_speed - power_drop[i])
      });
    }
    ratio_diff.push({
      x: (max_speed[max_speed.length - 1]),
      y: this.car.max_engine_speed
    });
    console.log("## Ratio Diff ##");
    console.log(ratio_diff);

    return ratio_diff;
  }



}
