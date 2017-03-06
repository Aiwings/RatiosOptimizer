import { Injectable } from '@angular/core';

import {Ratio} from '../app/ratio';
import {CarProvider} from './car-provider'

@Injectable()
export class RatioProvider {

  constructor(
      public carProv :CarProvider
    ) {
    console.log('Calling RatioProvider Provider');
  }

  private ratios: Ratio[];

  private ratioValid : boolean =false ;

  public isRatioValid() :boolean {
    return this.ratioValid;
  }


 public getRatios() : Ratio[]{

    if(!this.ratios)
    {
      this.ratios = [];
    }
    return this.ratios;
  }

  public setRatios(ratios:Ratio []):boolean{
    let car = this.carProv.getSelectedCar();
    if(car.nb_speed == ratios.length)
    {
       this.ratios = ratios;
       this.ratioValid = true;
       return true; 
    }
    return false;
  }}
