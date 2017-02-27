import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Gearbox} from '../app/gearbox';
import {Ratio} from '../app/ratio';
import 'rxjs/add/operator/map';

/*
  Generated class for the GearProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GearProvider {

  constructor(public http: Http) {
    console.log('Hello GearProvider Provider');
  }

  private gearBox : Gearbox;


  saveGB( gb: Gearbox) : void {

  }

  getGB() : Promise <Gearbox>{
    return Promise.resolve(this.gearBox);
  }
  addRatio(ratio: Ratio){

  }
  deleteRatio(ratio:Ratio){
    
  }




}
