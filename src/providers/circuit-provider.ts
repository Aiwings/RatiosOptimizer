import {
  Injectable
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
import {
  CalculProvider
} from './calcul-provider';


@Injectable()
export class CircuitProvider {
  constructor(public http: Http,
    private db: DBProvider,
    private carProv: CarProvider,
    private gearProv: GearProvider,
    private ratioProv: RatioProvider,
    private calculProv : CalculProvider) {
    console.log('Hello CircuitProvider Provider');
  }
  circuit = new BehaviorSubject < Circuit > ({
    id: 0,
    car_id: 0,
    gearbox_id: 0,
    name: '',
    tire_diam: 0,
    event: '',
    v_max: 0,
    ratios: [],
    weather: '',
    comments: '',
  });
  getCircuit() {
    return this.circuit.asObservable();
  }
  saveCircuit(circuit) {
    if (circuit.id == 0) {
      this.db.addCircuit(circuit).then(data => {
        console.log(data);
        circuit.id = data.insertId;
        this.circuit.next(circuit);
      }).catch(error => {
        console.error(error.message, error);
      });
    }
  }
  setCircuit(circuit: Circuit) {
    console.log(circuit);
    this.circuit.next(circuit);

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
      this.carProv.setSelectedCar(car);
    }).catch(error => {
      console.error(error.message, error);
    });

    this.db.selectGearById(circuit.gearbox_id).then(data => {
      this.gearProv.setGB(data);
    }).catch(error => {
      console.error(error.message, error);
    });
    this.ratioProv.setFromCircuit(circuit.ratios);
    this.calculProv.setDiam(circuit.tire_diam);
  }
  getValue(){
    return this.circuit.value;
  }
}
