import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Car} from '../app/car';
import {Cars} from '../app/mock-cars';

/*
  Generated class for the CarProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/



@Injectable()
export class CarProvider {

   private cars : Car [] ;  
   private selectedCar : Car;

  constructor(public http: Http ){
    console.log('Calling CarProvider Provider');
  }

  getCars(): Promise<Car[]>  {
    if(!this.cars)
    {
      this.cars = Cars;
      return Promise.resolve(Cars);
    }
    else
    {
      return Promise.resolve(this.cars);
    }
    
  }
  addCar(car:Car) : void {

    car.date_config = new Date();
    let id = this.cars.length;
    car.id = id;
    this.cars.push(car);
    console.log("## Adding New Car ###");
    console.log(this.cars);
    this.selectedCar= car;
    console.log("### Selected car ###");
    console.log(car);
  }

  saveCar(car:Car):void {
    let index = car.id-1;
    this.cars[index] = car;
    console.log("## Saving Car ###");
    console.log(this.cars);
    console.log("### Selected car ###");
    console.log(car);
  }
  getSelectedCar():Car{
    return this.selectedCar;
  }

  setSelectedCar(car:Car):void{
    this.selectedCar = car;
  }


}
