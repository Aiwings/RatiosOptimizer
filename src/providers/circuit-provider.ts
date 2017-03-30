import {
  Injectable,
  EventEmitter
} from '@angular/core';
import {
  Http
} from '@angular/http';
import {
  Circuit
} from '../app/circuit';
import {
  Car
} from '../app/car';
import {
  Gearbox
} from '../app/gearbox';
import {
  Ratio
} from '../app/ratio';
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/map';
import {
  DBProvider
} from './db-provider';
import {
  CarProvider
} from './car-provider';
import {
  GearProvider
} from './gear-provider';
import {
  RatioProvider
} from './ratio-provider';


@Injectable()
export class CircuitProvider {
  constructor(public http: Http,
    private db: DBProvider,
    private carProv: CarProvider,
    private gearProv: GearProvider,
    private ratioProv: RatioProvider) {
    console.log('Hello CircuitProvider Provider');
  }
  public change: EventEmitter < any > = new EventEmitter();

  private circuit = {
    id: 0,
    car_id: 0,
    gearbox_id: 0,
    name: '',
    tire_diam: 0,
    event: 'Essai',
    v_max: 0,
    ratios: [],
    weather: '',
    comments: '',
  };

  v_max = new BehaviorSubject < number > (0);
  tire_diam = new BehaviorSubject < number > (0);

  getCircuit() {
    return this.circuit;
  }
  saveCircuit(): Promise < any > {
    return new Promise((resolve, reject) => {

      if (this.circuit.id == 0) {
        this.db.addCircuit(this.circuit).then(data => {
          this.circuit.id = data.insertId;
          resolve(data);
        }).catch(error => {
          console.error(error.message, error);
          reject(error);
        });
      } else {
        this.db.saveCircuit(this.circuit).then(data => {
          resolve(data);
        }).catch(error => {
          console.error(error.message, error);
          reject(error);
        });
      }
    });
  }
  updatecircuit(circForm: any) {
    this.circuit.name = circForm.name;
    this.circuit.comments = circForm.comments;
    this.circuit.event = circForm.event;
    this.circuit.weather = circForm.weather;
    this.change.emit(this.circuit.name +' - ' + this.carProv.car.value.brand+ ' '+ this.carProv.car.value.type);
  }
  setCircuit(circuit: Circuit) {
    this.circuit = circuit;
    if (circuit.car_id != 0 && circuit.gearbox_id != 0) {
      this.db.selectCarById(circuit.car_id).then(data => {
        let car: Car = {
          id: data.id,
          date_config: data.date_config,
          brand: data.brand,
          type: data.type,
          fia_category: data.fia_category,
          weight: data.weight,
          nb_speed: data.nb_speed,
          bevelgear: JSON.parse(data.bevelgear),
          max_engine_speed: data.max_engine_speed
        };
        this.setCar(car)
        let stats = this.setRatios(circuit.ratios);
        this.change.emit(this.circuit.name +' - ' + this.carProv.car.value.brand+ ' '+ this.carProv.car.value.type);
      }).catch(error => {
        console.error(error.message, error);
      });

      this.db.selectGearById(circuit.gearbox_id).then(data => {
        this.setGear(data);
      }).catch(error => {
        console.error(error.message, error);
      });
      this.tire_diam.next(circuit.tire_diam);
      
    }
  }
  public getCar() {
    return this.carProv.car.asObservable();
  }
  public setCar(car: Car) {
    this.carProv.car.next(car);

    if (car.id != 0) {
      this.circuit.car_id = car.id;
    }
    this.carProv.valid.next(true);
  }
  public getGear() {
    return this.gearProv.gearBox.asObservable();
  }
  public setGear(gb: Gearbox) {
    this.gearProv.gearBox.next(gb);

    if (gb.id != 0) {
      this.circuit.gearbox_id = gb.id;
    }
  }
  public getRatios() {
    return this.ratioProv.ratios.asObservable();
  }

  public setRatios(ratios: Ratio[]): number {
    if (this.carProv.car.value.nb_speed == ratios.length) {
      this.ratioProv.ratios.next(ratios);
      this.circuit.ratios = ratios;
      this.ratioProv.valid.next(true);
      return 0;
    } else if (this.carProv.car.value.nb_speed < ratios.length) {
      return 1;
    } else {
      return -1;
    }

  }
  public getVmax() {
    return this.v_max.asObservable();
  }

  public carValid() {
    return this.carProv.valid.asObservable();
  }
  public ratioValid() {
    return this.ratioProv.valid.asObservable();
  }
  public setCarValid(valid: boolean): void {
    this.carProv.valid.next(valid);
  }
  public setRatioValid(valid: boolean) {
    this.ratioProv.valid.next(valid)
  }
  saveGB(gb: Gearbox): Promise < any > {
    return new Promise((resolve, reject) => {

      this.db.saveGear(gb).then((data) => {
        gb.id = data.insertId;
        this.gearProv.gearBox.next(gb);
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  public addCar(car: Car): Promise < any > {
    return new Promise((resolve, reject) => {
      car.date_config = new Date();
      this.db.addCar(car).then((data) => {
        car.id = data.insertId;
        this.carProv.car.next(car);
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
  public setDiam(diam: number) {
    this.circuit.tire_diam = diam;
  }

  public setVmax(vmax: number) {
    this.circuit.v_max = vmax;
  }
  public clear()
  {
   this.circuit = {
    id: 0,
    car_id: 0,
    gearbox_id: 0,
    name: '',
    tire_diam: 0,
    event: 'Essai',
    v_max: 0,
    ratios: [],
    weather: '',
    comments: '',
  };

  this.carProv.reset();
  this.gearProv.reset();
  this.ratioProv.reset();
  }


}
export const Services = [CircuitProvider, CarProvider, GearProvider, RatioProvider];
