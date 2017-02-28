import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Car} from '../app/car';
//import {Cars} from '../app/mock-cars';
import{DBProvider} from './db-provider'

/*
  Generated class for the CarProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/



@Injectable()
export class CarProvider {

   private cars:Array<any> ;  
   private selectedCar : Car;

  constructor(public http: Http, public db : DBProvider ){
    console.log('Calling CarProvider Provider');
  }

  getCars() : Promise <Car[]>{
    return new Promise((resolve, reject)=>{
      if(!this.cars)
    {
      this.db.getCars().then((cars)=>{
        this.cars = cars;
        resolve(this.cars);
     }).catch((error)=>{
       console.error("Unable to find cars ",error);
       this.cars =[];
       resolve(this.cars);
     })
    }
    else{
      resolve(this.cars);
    }
    });


  }
    

  addCar(car:Car) : void {

    car.date_config = new Date();
    let id =1;
    if(this.cars.length !=0)
    {
        id = this.cars.length; 
    }

    car.id = id;
    this.cars.push(car);
    console.log("## Adding New Car ###");
    console.log(this.cars);

    this.db.addCar(car).then((data)=>{
         this.selectedCar= car;
         console.log("### Selected car ###");
         console.log(this.selectedCar);
    }).catch((error)=>{
      console.error("### Unable to add Car ### ",error);
    })

  }

  saveCar(car:Car):void {
    let index = car.id-1;
    this.cars[index] = car;

    this.db.saveCar(car).then((data)=>{
      console.log("## Saving Car ###");
      console.log(this.cars);
      console.log("### Selected car ###");
      console.log(this.selectedCar);
    }).catch((error)=>{
        console.error("### Unable to save Car ### ",error);
    })

  }
  getSelectedCar():Car{
    return this.selectedCar;
  }

  setSelectedCar(car:Car):void{
    this.selectedCar = car;
  }


}
