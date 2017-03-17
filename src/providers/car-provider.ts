import {
  Injectable
} from '@angular/core';

import {
  Car
} from '../app/car';
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import {
  DBProvider
} from './db-provider';


@Injectable()
export class CarProvider {


  private selectedCar = new BehaviorSubject < Car > ({
    id: 0,
    date_config: new Date(),
    brand: "",
    type: "",
    fia_category: "",
    weight: 0,
    nb_speed: 3,
    bevelgear: {
      a: 0,
      b: 0
    },
    max_engine_speed: 0
  });

  private valid = new BehaviorSubject < boolean > (false);

  public setValid(valid: boolean): void {
    this.valid.next(valid);
  }
  public isValid() {
    return this.valid.asObservable();
  }

  constructor(public db: DBProvider,

  ) {
    console.log('Calling CarProvider Provider');
  }

  public addCar(car: Car): Promise < any > {

    return new Promise((resolve, reject) => {
      car.date_config = new Date();
      this.db.addCar(car).then((data) => {
        car.id = data.insertId;
        this.selectedCar.next(car);
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  public saveCar(car: Car): Promise < any > {

    return new Promise((resolve, reject) => {
      this.db.saveCar(car).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      })
    });
  }
  public getSelectedCar() {
    return this.selectedCar.asObservable();
  }


  public setSelectedCar(car: Car): void {
    this.selectedCar.next(car);
    this.valid.next(true);
  }


}
