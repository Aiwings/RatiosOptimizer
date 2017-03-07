import {
  Injectable
} from '@angular/core';
import {
  Gearbox
} from '../app/gearbox';
import {
  DBProvider
} from './db-provider'


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

  private gearBox: Gearbox;

  setGB(gb: Gearbox): void {
    this.gearBox = gb;
  }


  getGB(id ? : number): Promise < any > {
    
    return new Promise((resolve, reject) => {
      if (this.gearBox) {
        if (id && this.db.isOpen) {
          this.db.selectGearById(id).then((gb) => {
            resolve(gb);
          }).catch((error) => {
            reject(error);
          });
        }
        resolve(this.gearBox);
      } else {
        reject(new Error("No gearbox found"));
      }
    });
  }
  getGBs(carid: number): Promise < any > {
    return new Promise((resolve, reject) => {
      this.db.selectGearsByCarid(carid).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  saveGB(gb: Gearbox): Promise < any > {
    this.gearBox = gb;

    return new Promise((resolve, reject) => {
      this.db.saveGear(gb).then((data) => {
        if (data.id) {
          this.gearBox.id = data.id;
        }
        resolve(this.gearBox);
      }).catch((error) => {
        reject(error);
      });
    });
  }
}
