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

  private cars = new BehaviorSubject < Car[] > ([]);
  private selectedCar = new BehaviorSubject < Car > ({
    id: 0,
    date_config: new Date(),
    brand: "",
    type: "",
    fia_category: "",
    weight: 0,
    nb_speed: 0,
    bevelgear: {
      a: 0,
      b: 0
    },
    max_engine_speed: 0
  });

  private isValid = new BehaviorSubject < boolean > (false);

  public setValid(valid: boolean): void {
    this.isValid.next(valid);
  }
  public getValid() {
    return this.isValid.asObservable();
  }

  constructor(public db: DBProvider,

  ) {
    console.log('Calling CarProvider Provider');
  }

  public setCars(cars)
  {
    this.cars.next(cars);
  }

  public getCars() {
    return this.cars.asObservable();
  }

  public addCar(car: Car): Promise < any > {

    return new Promise((resolve, reject) => {

      car.date_config = new Date();

      let id = this.cars.value.length + 1;
      car.id = id;
      let cars = this.cars.value;
      cars.push(car);
      this.cars.next(cars);
      this.selectedCar.next(car);
      this.db.addCar(car).then((data) => {

        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  public saveCar(car: Car): Promise < any > {

    return new Promise((resolve, reject) => {
      let index = car.id - 1;
      let cars = this.cars.value;
      cars[index] = car;
      this.cars.next(cars);
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
  }


}
