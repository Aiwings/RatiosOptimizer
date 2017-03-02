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
  private ratio_diff :number[];

  private tire_diam : number;
  

  public setDiam(tire_diam : number) :void {
    this.tire_diam = tire_diam;
    this.calculate();
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

     let car = this.carProv.getSelectedCar();
       console.log(JSON.stringify(car));

     for(let i = 0; i<car.nb_speed; i++)
     {
        let ratio = this.ratioProv.getRatios()[i];       
        this.max_speed[i] = (Math.PI * this.tire_diam * 0.000001) * car.max_engine_speed *60 * (car.bevel_gear1 /car.bevel_gear2)*(ratio.a /ratio.b);
     }
    
  }

  private calculatePowerDrop():void{
    let car = this.carProv.getSelectedCar();

    for(let i=0; i<(car.nb_speed -1); i++)
    {
       let ratio = this.ratioProv.getRatios()[i+1];
       let sub =  Math.PI * this.tire_diam * Math.pow(10,-6) *(car.bevel_gear1 / car.bevel_gear2)*(ratio.a / ratio.b)*60;
       console.log(this.max_speed[i]);
       console.log(sub);
      this.power_drop[i] = car.max_engine_speed - (this.max_speed[i] /(sub));
    }
  }

  public calculate() :void {

    if(this.carProv.getSelectedCar() && this.tire_diam && (this.ratioProv.getRatios().length!=0 ))
    {
      if(!this.max_speed){ this.max_speed = [];}
      if(!this.power_drop){this.power_drop =[];}


      this.calculateMaxSpeed();
      this.calculatePowerDrop();
    }
    
  }



}
