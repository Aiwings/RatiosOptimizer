import { Injectable } from '@angular/core';

import{CarProvider} from './car-provider';
import{RatioProvider} from './ratio-provider';

/*
  Generated class for the CalculProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CalculProvider {

  constructor( public carProv : CarProvider,
              public ratioProv : RatioProvider) {
    console.log('Hello CalculProvider Provider');

  }
  private max_speed :number[];
  private power_drop: number[];
  private ratio_diff :any[];

  private tire_diam : number;


  public setDiam(tire_diam : number) : void {
    this.tire_diam = tire_diam; 
  }
    public getDiam() :number {
      return this.tire_diam;
  }


  public getMaxSpeed():number[]{
    if(!this.max_speed)
    {
      this.max_speed =[];
    }
    return this.max_speed;
  }
  public getPowerDrop():number[]{
    if(!this.power_drop)
    {
      this.power_drop = [];
    }
    return this.power_drop;
  }

  public getRatioDiff():number[]{
    return this.ratio_diff;
  }


   private calculateMaxSpeed():void{

     this.max_speed = []; 
     let car = this.carProv.getSelectedCar();
 
    
     for(let i = 0; i<car.nb_speed; i++)
     {
        let ratio = this.ratioProv.getRatios()[i];       
        this.max_speed.push((Math.PI * this.tire_diam * 0.000001) * car.max_engine_speed *60 * (car.bevel_gear1 /car.bevel_gear2)*(ratio.a /ratio.b));
     }

    
  }
  public toRpm(kmh : number[]): number[]{
    let rpm : number[] =[];
    for(let i=0; i<kmh.length;i++){
      rpm[i] = Math.round(kmh[i] /(60* Math.PI*this.tire_diam *Math.pow(10,-6)));
    }
    console.log(rpm);
    return rpm;
  }

  private calculatePowerDrop():void{
    let car = this.carProv.getSelectedCar();
    this.power_drop = [];

    for(let i=0; i<(car.nb_speed -1); i++)
    {
       let ratio = this.ratioProv.getRatios()[i+1];
       let sub =  Math.PI * this.tire_diam * Math.pow(10,-6)* 60* (car.bevel_gear1 / car.bevel_gear2)*(ratio.a / ratio.b);

      this.power_drop.push(car.max_engine_speed - (this.max_speed[i] /(sub)));
    }
    console.log("## Power Drop ##");
    console.log(this.power_drop);
  }

  public calculate() : Promise<any> {

    return new Promise((resolve,reject)=>{
      if(this.carProv.getSelectedCar() && this.tire_diam && (this.ratioProv.getRatios().length!=0 ))
    {

      this.calculateMaxSpeed();
      this.calculatePowerDrop();
      this.calculateDiff();
      resolve();
    }
    else
    {
      reject();
    }
    })

  }
  private calculateDiff():void{
    this.ratio_diff = [];
    let max_engine_speed = this.carProv.getSelectedCar().max_engine_speed;

   
    for (let i = 0 ; i < this.power_drop.length; i++)
    {
      this.ratio_diff.push({
          x : this.max_speed[i],
          y : max_engine_speed});
      this.ratio_diff.push({
          x : this.max_speed[i],
          y:Math.round(max_engine_speed - this.power_drop[i])});
    }
    this.ratio_diff.push({
       x: (this.max_speed[this.max_speed.length-1]),
       y: max_engine_speed});
      console.log(this.ratio_diff);
  }



}
