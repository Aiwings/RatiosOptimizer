import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import {
  Subscription
} from 'rxjs/Subscription';

import {
  Ratio
} from '../app/ratio';
import {
  CircuitProvider
} from './circuit-provider';

import {
Circuit
} from '../app/circuit';

@Injectable()
export class CalculProvider {

  private circuit : Circuit;

  constructor(
    private circProv: CircuitProvider) {

    this.circuit = this.circProv.getCircuit(); 
    console.log('Hello CalculProvider Provider');

    this.carSub = this.circuit.$getCar().subscribe(data => {
      let car = data.get();
      this.bevelgear = car.bevelgear;
      this.max_engine_speed = car.max_engine_speed;
      this.nb_speed = car.nb_speed;
      this.tire_diam = car.tire_diam;
      this.calculate();
    });

    this.ratioSub = this.circuit.$getRatios().subscribe(ratios => {
      this.ratios = ratios;
      this.calculate();
    });
    this.calculate();
  }


  private tire_diam: number = 0;
  private max_engine_speed: number = 0;
  private nb_speed: number = 0;
  private ratios: Ratio[] = [];
  private bevelgear: {
    a: number,
    b: number
  };



  private carSub: Subscription;
  private ratioSub: Subscription;
  private ratioVSub: Subscription;


  calcul = new BehaviorSubject < {
    max_speed: number[],
    power_drop: number[],
    ratio_diff: any[],
    gap: number[]
  } > ({
    max_speed: [],
    power_drop: [],
    ratio_diff: [],
    gap: []
  });


  private calculateMaxSpeed(k): number[] {

    let max_speed = [];
    for (let i = 0; i < this.nb_speed; i++) {
      let ratio = this.ratios[i];
      let speed = k * this.max_engine_speed * (ratio.a / ratio.b)
      max_speed.push(parseFloat((speed).toFixed(2)));
    }
    this.circuit.setVmax(max_speed[max_speed.length - 1]);
    console.log("## Max Speed ##");
    console.log(max_speed);
    return max_speed;
  }


  private calculatePowerDrop(k, max_speed: number[]): number[] {

    let power_drop = [];

    for (let i = 0; i < (this.nb_speed - 1); i++) {
      let ratio = this.ratios[i + 1];
      let sub = k * (ratio.a / ratio.b);

      power_drop.push(Math.round(this.max_engine_speed - (max_speed[i] / (sub))));
    }
    console.log("## Power Drop ##");
    console.log(power_drop);
    return power_drop;
  }


  public calculate() {

    if ( (this.ratios.length == this.nb_speed) && (this.ratios.length !=0) ) {

      let k = (Math.PI * this.tire_diam * 0.000001) * 60 * (this.bevelgear.a / this.bevelgear.b);
      let max_speed = this.calculateMaxSpeed(k);
      let power_drop = this.calculatePowerDrop(k, max_speed);
      let ratio_diff = this.calculateDiff(max_speed, power_drop);
      let gap = this.calculateGap(max_speed);
      this.calcul.next({
        max_speed: max_speed,
        power_drop: power_drop,
        ratio_diff: ratio_diff,
        gap: gap
      });
    }
  }
  private calculateGap(max_speed): number[] {
    let gaps = [];
    for (let i = 0; i < max_speed.length - 1; i++) {
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
        y: this.max_engine_speed
      });
      ratio_diff.push({
        x: max_speed[i],
        y: Math.round(this.max_engine_speed - power_drop[i])
      })
    }
    ratio_diff.push({
      x: (max_speed[max_speed.length - 1]),
      y: this.max_engine_speed
    });
    console.log("## Ratio Diff ##");
    console.log(ratio_diff);

    return ratio_diff;
  }
  getCalcul() {
    return this.calcul.asObservable();
  }



}
