import {
  EventEmitter
} from '@angular/core'
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
import {
  DBProvider
} from '../providers/db-provider';

export class Circuit {

  private car: Car;
  private gearbox: Gearbox;
  private ratios: Ratio[];
  public change: EventEmitter < any > = new EventEmitter();
  private name: string;
  private event: string;
  private v_max: number;
  private weather: string;
  private comments: string;
  private id: number;
  private isValid: BehaviorSubject < number > ;
  private $car: BehaviorSubject < Car > ;
  private $gear: BehaviorSubject < Gearbox > ;
  private $ratios: BehaviorSubject < Ratio[] > ;
  constructor(public db: DBProvider, id ? , name ? , ratios ? , event ? , v_max ? , weather ? , comments ? , car ? , gearbox ? ) {

    this.id = (id) ? id : 0;
    this.car = (car) ? car : new Car(this.db, {
      id: 0,
      brand: "",
      type: "",
      fia_category: "",
      weight: 0,
      nb_speed: 0,
      max_engine_speed: 0,
      tire_diam: 0,
      bevelgear: {
        a: 0,
        b: 0
      }
    });
    this.gearbox = (gearbox) ? gearbox : new Gearbox(this.db, "", "", "");
    this.ratios = (ratios) ? ratios : [];
    this.name = (name) ? name : "";
    this.comments = (comments) ? comments : "";
    this.weather = (weather) ? weather : "";

    this.isValid = new BehaviorSubject < number > ((car && gearbox && ratios) ? 0 : -1);
    this.$car = (car) ?
      new BehaviorSubject < Car > (car) :
      new BehaviorSubject < Car > (this.car);

    this.$ratios = (ratios) ?
      new BehaviorSubject < Ratio[] > (ratios) :
      new BehaviorSubject < Ratio[] > ([]);

    this.$gear = (gearbox) ?
      new BehaviorSubject < Gearbox > (ratios) :
      new BehaviorSubject < Gearbox > (this.gearbox);

    if (this.name) this.change.emit(this.name);
  }
  public setCar(obj: {
    id ? : number,
    date_config ? : any,
    brand: string,
    type: string,
    fia_category: string,
    weight: number,
    nb_speed: number,
    tire_diam: number,
    bevelgear: {
      a: number,
      b: number
    },
    max_engine_speed: number
  }) {

    if (obj.id && obj.date_config) {
      this.car = new Car(this.db, obj);
    } else if (this.car.get().brand != "") {
      this.car.update(obj);
    } else {
      this.car = new Car(this.db, obj);
    }
    this.$car.next(this.car);

    this.isValid.next(this.ratios.length - obj.nb_speed);
  }
  public setGear(gear: {
    brand: string,
    type: string,
    serial: number,
    id ? : number
  }) {
    if (gear.id) {
      this.gearbox = new Gearbox(this.db, gear.brand, gear.type, gear.serial, gear.id)
    } else if (this.gearbox) {
      this.gearbox.update(gear.brand, gear.type, gear.serial)
    } else {
      this.gearbox = new Gearbox(this.db, gear.brand, gear.type, gear.serial)
    }
    this.$gear.next(this.gearbox)
  }

  public getGear() {
    return this.gearbox;
  }



  public $getCar() {
    return this.$car.asObservable();
  }
  public $getGear() {
    return this.$gear.asObservable();
  }
  public getCar() {
    return this.car;
  }

  public setRatios(ratios: Ratio[]) {
    let valid = ratios.length - this.car.get().nb_speed;
    this.isValid.next(valid);
    if (valid == 0) {
      this.ratios = ratios;
      this.$ratios.next(this.ratios);
    }
  }

  public $getRatios() {
    return this.$ratios.asObservable();
  }

  public getRatios(ratios) {
    return this.ratios;
  }
  updateInfos(circ: {
    name,
    comment,
    weather,
    event
  }) {
    this.name = circ.name;
    this.comments = circ.comment;
    this.weather = circ.weather;
    this.event = circ.event;
    this.change.emit(this.name);
  }

  save(): Promise < any > {
    return new Promise((resolve, reject) => {
      this.car.save().then(data => {
        this.gearbox.save().then(data => {
          this.saveToDb().then(data => {
            resolve(data);
          }).catch(error => {
            reject(error);
          });
        }).catch(error => {
          reject(error);
        });

      }).catch(error => {
        reject(error);
      });
    });
  }
  private saveToDb(): Promise < any > {
    return new Promise((resolve, reject) => {
      if (this.id == 0) {
        this.db.addCircuit(this.get()).then(data => {
          this.id = data.insertId;
          resolve(data);
        }).catch(error => {
          console.error(error.message, error);
          reject(error);
        });
      } else {
        this.db.saveCircuit(this.get()).then(data => {
          resolve(data);
        }).catch(error => {
          console.error(error.message, error);
          reject(error);
        });
      }
    });
  }
  valid() {
    return this.isValid.asObservable();
  }
  setVmax(vmax: number) {
    this.v_max = vmax;
  }


  get() {
    return {
      id: this.id,
      name: this.name,
      comments: this.comments,
      event: this.event,
      weather: this.weather,
      v_max: this.v_max,
      ratios: this.ratios,
      car_id: this.car.get().id,
      gearbox_id: this.gearbox.get().id
    }
  }





}
