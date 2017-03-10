import {
  Injectable
} from '@angular/core';
import {
  Gearbox
} from '../app/gearbox';
import {
  DBProvider
} from './db-provider'
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';

/*
  Generated class for the GearProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GearProvider {

  constructor(
    private db: DBProvider) {
    console.log('Calling, GearProvider Provider');
  }
  private gbs:Gearbox [] = [];
  private gearBox= new BehaviorSubject<Gearbox>({
    id:0,
    brand: "",
    type:"",
    serial:0
  });

  setGB(gb: Gearbox): void {
    this.gearBox.next(gb);
  }


  getGB(): Promise < any > {
    
    return new Promise((resolve, reject) => {
      if (this.gearBox) {
          resolve(this.gearBox.asObservable());
      } else {
        reject(new Error("No gearbox found"));
      }
    });
  }
  getGBs(): Promise < any > {
    return new Promise((resolve, reject) => {
      this.db.selectGears().then((gbs) => {
        this.gbs=gbs;
        resolve(this.gbs);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  saveGB(gb: Gearbox): Promise < any > {

    return new Promise((resolve, reject) => {
      this.db.saveGear(gb).then((data) => {
        resolve(this.gearBox);
      }).catch((error) => {
        reject(error);
      });
    });
  }
}
