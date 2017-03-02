import { Injectable } from '@angular/core';
import {Gearbox} from '../app/gearbox';
import {DBProvider} from'./db-provider'


/*
  Generated class for the GearProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GearProvider {

  constructor(
    private db : DBProvider) {
    console.log('Calling, GearProvider Provider');
  }

  private gearBox : Gearbox;

  setGB( gb: Gearbox) : void {
    this.gearBox = gb;
  }

  getGB(carid : number) : Promise <any>{

      return new Promise((resolve,reject)=>{
         if(this.gearBox && this.gearBox.carid == carid) 
             {
               resolve(this.gearBox)
             }
             else
             {
               reject({});
             }
      });
    }

    saveGB(gb:Gearbox) : Promise<any>{
      this.gearBox = gb;

      return new Promise((resolve,reject)=>{
        this.db.saveGear(gb).then((data)=>{
          if(data.id)
          {
            this.gearBox.id = data.id;
          }
          resolve(this.gearBox);
        }).catch((error)=>{
            reject(error);
        });
      });
    }
}
