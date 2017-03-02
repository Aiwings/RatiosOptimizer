import { Injectable } from '@angular/core';

import {Ratio} from '../app/ratio';
//import { CalculProvider } from './calcul-provider';

@Injectable()
export class RatioProvider {

  constructor(
   // public calc : CalculProvider
    ) {
    console.log('Calling RatioProvider Provider');
  }

  private ratios: Ratio[];

 public getRatios() : Ratio[]{

    if(!this.ratios)
    {
      this.ratios = [];
    }
    return this.ratios;
  }

  public setRatios(ratios:Ratio []){
    this.ratios = ratios;
  //  this.calc.calculate();
  }

}
