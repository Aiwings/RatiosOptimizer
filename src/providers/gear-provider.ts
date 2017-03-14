import {
  Injectable
} from '@angular/core';
import {
  Gearbox
} from '../app/gearbox';
import {
  DBProvider
} from './db-provider'
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';


@Injectable()
export class GearProvider {

  constructor(
    private db: DBProvider) {
    console.log('Calling, GearProvider Provider');

  }
  private gearBoxes = new BehaviorSubject < Gearbox[] > ([]);
  private gearBox = new BehaviorSubject < Gearbox > ({
    id: 0,
    brand: "",
    type: "",
    serial: 0
  });

  setGB(gb: Gearbox): void {
    this.gearBox.next(gb);
  }

  setGBs(gbs : Gearbox[]) : void {
    this.gearBoxes.next(gbs);
  }

  getGB() {
    return this.gearBox.asObservable();
  }
  getGBs() {
    return this.gearBoxes.asObservable();
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
