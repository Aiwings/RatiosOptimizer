import { Injectable } from '@angular/core';

import { Car } from '../app/car';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { DBProvider } from './db-provider';



/*
  Generated class for the CarProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class CarProvider {

  private cars:Car[] = [];
  private selectedCar= new BehaviorSubject<Car>({
    id: 0,
    date_config: new Date(),
    brand: "",
    type:"",
    fia_category:"",
    weight:0,
    nb_speed:0,
    bevelgear:{
        a:0,
        b:0
    },
    max_engine_speed : 0
  });

  private isValid = new BehaviorSubject<boolean>(false);

  public setValid(valid :boolean) :void {
    this.isValid.next(valid);
  }
  public getValid(){
    return this.isValid.asObservable();
  } 

  constructor( public db: DBProvider, 

  ) {
    console.log('Calling CarProvider Provider');
  }

 public getCars(): Promise<Car[]> {
    return new Promise((resolve, reject) => {
      if(this.cars.length ==0)
      {
        this.db.getCars().then((cars:any []) => {

          for(let i =0; i <cars.length;i++)
          { 
            let bevelgear = JSON.parse(cars[i].bevelgear)
            cars[i].bevelgear = bevelgear;
          }
          this.cars=cars;
          resolve(this.cars);
        }).catch((error) => {
          console.error("Unable to find cars ", error);
          resolve(this.cars);
        });
      }else{
        resolve(this.cars);
      }

    });
      
  }

  public addCar(car: Car): Promise<any> {

     return new Promise((resolve,reject)=>{
    
      car.date_config = new Date();

      let id = this.cars.length+1;
      car.id = id;
      this.cars.push(car);
      this.selectedCar.next(car);
      this.db.addCar(car).then((data) => {
      
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
     });
  }

  public saveCar(car: Car): Promise<any> {

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
 public  getSelectedCar() {
    return this.selectedCar.asObservable();
  }

  public setSelectedCar(car: Car): void {
    this.selectedCar.next(car);
  }


}
