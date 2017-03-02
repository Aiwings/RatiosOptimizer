import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Ratio} from '../app/ratio';
import 'rxjs/add/operator/map';


@Injectable()
export class RatioProvider {

  constructor(public http: Http) {
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
  }

}
