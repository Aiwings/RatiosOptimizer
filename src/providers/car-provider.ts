import { Injectable } from '@angular/core';

import { Car } from '../app/car';
import { DBProvider } from './db-provider';
//import { CalculProvider } from './calcul-provider';


/*
  Generated class for the CarProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class CarProvider {

  private cars: Array<any>;
  private selectedCar: Car;

  constructor( public db: DBProvider, 
//  private calcul : CalculProvider
  ) {
    console.log('Calling CarProvider Provider');
  }

  getCars(): Promise<Car[]> {
    return new Promise((resolve, reject) => {
      if (!this.cars) {
        this.db.getCars().then((cars) => {
          this.cars = cars;
          resolve(this.cars);
        }).catch((error) => {
          console.error("Unable to find cars ", error);
          this.cars = [];
          resolve(this.cars);
        })
      }
      else {
        resolve(this.cars);
      }
    });
  }

  addCar(car: Car): Promise<any> {

     return new Promise((resolve,reject)=>{
      car.date_config = new Date();
      let id = 1;
      if (this.cars.length != 0) {
        id = this.cars.length;
      }
      car.id = id;
      this.cars.push(car);
      this.selectedCar = car;
      
      this.db.addCar(car).then((data) => {
      
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
     });
  }

  saveCar(car: Car): Promise<any> {

    return new Promise((resolve,reject)=>{
      let index = car.id - 1;
      this.cars[index] = car;
      this.db.saveCar(car).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      })
    });
  }
  getSelectedCar(): Car {
    return this.selectedCar;
  }

  setSelectedCar(car: Car): void {
    this.selectedCar = car;
    //this.calcul.calculate();
  }


}
