import { Injectable } from '@angular/core';

import{CarProvider} from './car-provider';
import{RatioProvider} from './ratio-provider';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import {
  Subscription
} from 'rxjs/Subscription';

import {Car} from '../app/car';
import {Ratio} from '../app/ratio';
@Injectable()
export class CalculProvider {

  constructor( public carProv : CarProvider,
              public ratioProv : RatioProvider) {
    console.log('Hello CalculProvider Provider');

    this.carSub = this.carProv.getSelectedCar().subscribe((car)=>{
      this.car=car;
      if(this.ratios)
      {
        this.calculate();
      }

    });

    this.ratioSub = this.ratioProv.getRatios().subscribe((ratios)=>{
      this.ratios = ratios;
      this.calculate();
    });
  

  }
  private calcul = new BehaviorSubject<{
    max_speed:number[],
    power_drop:number[],
    ratio_diff:any[]
  }>({
    max_speed:[],
    power_drop:[],
    ratio_diff :[]
  });

  carSub : Subscription;
  ratioSub : Subscription;
  car:Car;
  ratios : Ratio[];

  private tire_diam =0;


  public setDiam(tire_diam : number) : void {
    this.tire_diam=tire_diam;
    this.calculate(); 
  }
    public getDiam() {
      return this.tire_diam;
  }
  public getCalcul() {
    return this.calcul.asObservable();
  }

   private calculateMaxSpeed():number[]{

     let max_speed = []; 
     for(let i = 0; i<this.car.nb_speed; i++)
     {
        let ratio = this.ratios[i];       
        max_speed.push((Math.PI * this.tire_diam * 0.000001) * this.car.max_engine_speed *60 * (this.car.bevelgear.a /this.car.bevelgear.b)*(ratio.a /ratio.b));
     }
         console.log("## Max Speed ##");
         console.log(max_speed);

     return max_speed;
  }


  private calculatePowerDrop(max_speed:number []):number[]{

    let power_drop = [];

    for(let i=0; i<(this.car.nb_speed -1); i++)
    {
       let ratio = this.ratios[i+1];
       let sub =  Math.PI * this.tire_diam * Math.pow(10,-6)* 60* (this.car.bevelgear.a / this.car.bevelgear.b)*(ratio.a / ratio.b);

      power_drop.push(this.car.max_engine_speed - (max_speed[i] /(sub)));
    }
    console.log("## Power Drop ##");
    console.log(power_drop);
    return power_drop; 
  }

  public calculate() {

      let max_speed = this.calculateMaxSpeed();
      let power_drop =this.calculatePowerDrop(max_speed);
      let ratio_diff =this.calculateDiff(max_speed,power_drop);

      this.calcul.next({
        max_speed: max_speed,
        power_drop: power_drop,
        ratio_diff: ratio_diff
      });

  
  }
  private calculateDiff(max_speed,power_drop):number[]{
    let ratio_diff = [];

   
    for (let i = 0 ; i < power_drop.length; i++)
    {
      ratio_diff.push({
          x : max_speed[i],
          y : this.car.max_engine_speed});
      ratio_diff.push({
          x : max_speed[i],
          y:Math.round(this.car.max_engine_speed - power_drop[i])});
    }
    ratio_diff.push({
       x: (max_speed[max_speed.length-1]),
       y: this.car.max_engine_speed});
      console.log("## Ratio Diff ##");
      console.log(ratio_diff);

      return ratio_diff;
  }



}
