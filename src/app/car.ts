
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
   

    constructor(public db : DBProvider,
           brand, type, fia, weight, nbspeed, bg, tirediam,maxspeed, date_config?,id? ) {

      this.id = id;
      this.date_config = new Date();
      this.type = type;
      this.fia_category = fia;
      this.weight = weight;
      this.nb_speed = nbspeed;
      this.bevelgear = bg;
      this.tire_diam = tirediam
     this.max_engine_speed = maxspeed;
    }
    update(brand,type, fia, weight, nbspeed, bg, tirediam, maxspeed) {
      this.brand =brand;
      this.type = type;
      this.fia_category = fia;
      this.weight = weight;
      this.nb_speed = nbspeed;
      this.bevelgear = bg;
      this.tire_diam = tirediam;
      this.max_engine_speed =maxspeed;
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
    
     public add(): Promise < any > {
    return new Promise((resolve, reject) => {
      this.date_config = new Date();
      this.db.addCar(this.get()).then((data) => {
        this.id = data.insertId;
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  public save(): Promise < any > {

    return new Promise((resolve, reject) => {
      this.db.saveCar(this.get()).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      })
    });
  }

  }

