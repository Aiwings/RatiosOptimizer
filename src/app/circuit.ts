import {
  Car
} from './car';
import {
  Gearbox
} from './gearbox';
import {
  Ratio
} from './ratio';
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import {DBProvider} from '../providers/db-provider';

export class Circuit {

  private car: Car;
  private gearbox: Gearbox;
  private ratios: Ratio[];

  private name: string;
  private event: string;
  private v_max: number;
  private weather: string;
  private comments: string;
  private id: number;
  private  isValid: BehaviorSubject<boolean>;
  private $car: BehaviorSubject < Car > ;
  private $ratios: BehaviorSubject < Ratio[] > ;
  constructor(public db : DBProvider, id ? , name ? , ratios ?, event ?,v_max? , weather ? , comments ?,  car ? , gearbox ? ) {

    this.id = (id) ? id : 0;
    this.car = (car) ? car : null;
    this.gearbox = (gearbox) ? gearbox : null;
    this.ratios = (ratios) ? ratios : null;
    this.name = (name) ? name : "";
    this.comments = (comments) ? comments : "";
    this.weather = (weather) ? weather : "";
    this.isValid.next((car && gearbox && ratios) ? true : false);
    this.$car = (car) ? new BehaviorSubject < Car > (car) :
      new BehaviorSubject < Car > (null);

    this.$ratios = (ratios) ? new BehaviorSubject < Ratio[] > (ratios) :
      new BehaviorSubject < Ratio[] > (null);
  }
  public setCar(obj :{
      id ?: number,
    date_config ?:any,
    brand :string,
    type: string,
    fia_category : string,
    weight: number,
    nb_speed : number,
    tire_diam: number,
    bevelgear : {
        a:number,
        b: number
    },
    max_engine_speed : number
    }
  ) {

    if (obj.id && obj.date_config) {
      this.car = new Car(this.db,obj.brand, obj.type, obj.fia_category, obj.weight, obj.nb_speed, obj.tire_diam, obj.bevelgear,obj.max_engine_speed, obj.date_config, obj.id);
    }
    else if (this.car) {
      this.car.update(obj.brand, obj.type, obj.fia_category, obj.weight, obj.nb_speed, obj.tire_diam, obj.bevelgear,obj.max_engine_speed);
    } else {
      this.car = new Car(this.db,obj.brand, obj.type, obj.fia_category, obj.weight, obj.nb_speed, obj.tire_diam, obj.bevelgear,obj.max_engine_speed);
    }
    this.$car.next(this.car);
  }
    public setGear(brand,type,serial,id?) {
    if (id) {
      this.gearbox = new Gearbox(this.db,brand,type,serial,id)
    }
    else if (this.car) {
      this.gearbox.update(brand,type,serial)
    } else {
      this.gearbox = new Gearbox(this.db,brand,type,serial)
    }
  }

  public $getCar() {
    return this.$car.asObservable();
  }
  public getCar(){
    return this.car;
  }

  public setRatios(ratios: Ratio[]): number {
    if (this.car.get().nb_speed == ratios.length) {
      this.$ratios.next(ratios);
      this.ratios = ratios;
      this.isValid.next(true);
      return 0;
    } else if (this.car.get().nb_speed < ratios.length) {
      return 1;
    } else {
      return -1;
    }

  }

  public $getRatios() {
    return this.$ratios.asObservable();
  }

  public getRatios(ratios) {
    return this.ratios;
  }
  updateInfos(name,comment,weather)
  {
    this.name = name;
    this.comments = comment;
    this.weather = weather;
  }

  save(): Promise < any > {
    return new Promise((resolve, reject) => {

      if (this.id == 0) {
        this.db.addCircuit(this).then(data => {
          this.id = data.insertId;
          resolve(data);
        }).catch(error => {
          console.error(error.message, error);
          reject(error);
        });
      } else {
        this.db.saveCircuit(this).then(data => {
          resolve(data);
        }).catch(error => {
          console.error(error.message, error);
          reject(error);
        });
      }
    });
  }

  valid(){
      return this.isValid.asObservable();
  }

  get()
  {
    return {
          id : this.id, 
        name : this.name,
    comments : this.comments,
      events : this.event,
     weather : this.weather,
       v_max : this.v_max,
      ratios : this.ratios, 
      car_id : this.car.get().id,
  gearbox_id : this.gearbox.get().id
    }
  }

  

}
