
import {DBProvider} from '../providers/db-provider';
export class Car {
    private id: number;
    private date_config: Date;
    private brand;
    private type: string;
    private fia_category: string;
    private weight: number;
    private nb_speed: number;
    private tire_diam: number;
    private bevelgear: {
      a: number,
      b: number
    }
    private max_engine_speed: number;
   

    constructor(public db : DBProvider, car :{
      brand : string,
      type : string,
      fia_category : string,
      weight : number,
      nb_speed : number,
      bevelgear : {a :number, b:number},
      tire_diam : number,
      max_engine_speed :number,
      date_config ? : any,
      id ? :number
    })
    {
      this.id = (car.id) 
              ?  car.id
              : 0;
              
      this.date_config = (car.date_config)
                       ? car.date_config
                       : new Date();
      this.type = car.type;
      this.brand = car.brand;
      this.fia_category = car.fia_category;
      this.weight = car.weight;
      this.nb_speed = car.nb_speed;
      this.bevelgear = car.bevelgear;
      this.tire_diam = car.tire_diam
     this.max_engine_speed = car.max_engine_speed;
    }
    update(car :{
      brand : string,
      type : string,
      fia_category : string,
      weight : number,
      nb_speed : number,
      bevelgear : {a :number, b:number},
      tire_diam : number,
      max_engine_speed :number
    }) {


      this.brand =car.brand;
      this.type = car.type;
      this.fia_category = car.fia_category;
      this.weight = car.weight;
      this.nb_speed = car.nb_speed;
      this.bevelgear = car.bevelgear;
      this.tire_diam = car.tire_diam;
      this.max_engine_speed =car.max_engine_speed;
    }
    get(){
        return {
              id : this.id,
     date_config : this.date_config,
           brand : this.brand,
            type : this.type,
    fia_category : this.fia_category,
          weight : this.weight,
        nb_speed : this.nb_speed,
       bevelgear : this.bevelgear,
       tire_diam : this.tire_diam,
max_engine_speed : this.max_engine_speed
        };
    }
    
  public save(): Promise < any > {

    return new Promise((resolve, reject) => {
      if(this.id == 0)
      {
        this.db.addCar(this.get()).then((data) => {
        this.id = data.insertId;
         resolve(data);
         }).catch((error) => {
         reject(error);
      });
    }else
    {
      this.db.saveCar(this.get()).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    }

    });
  }

  }

