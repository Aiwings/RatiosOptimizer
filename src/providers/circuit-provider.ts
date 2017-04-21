import {
  Injectable,
} from '@angular/core';
import {
  Circuit
} from '../app/circuit';
import {
  DBProvider
} from './db-provider';

import 'rxjs/add/operator/map';


@Injectable()
export class CircuitProvider {
  constructor(private db: DBProvider) {
    console.log('Hello CircuitProvider Provider');

    this.circuit = new Circuit(db);

  }
  

   private circuit: Circuit;

  getCircuit() {
    return this.circuit;
  }
  setCircuit(circuit) {

    this.circuit = new Circuit(this.db, circuit.id, circuit.name, circuit.ratios, circuit.event, circuit.v_max, circuit.weather, circuit.comments);
    this.db.selectCarById(circuit.car_id).then(data => {

      this.circuit.setCar({
       brand: data.brand,
       type: data.type,
       fia_category: data.fia_category,
       weight: data.weight,
       nb_speed: data.nb_speed,
       bevelgear: JSON.parse(data.bevelgear),
       max_engine_speed: data.max_engine_speed,
       date_config: data.date_config,
       id: data.id,
       tire_diam: data.tire_diam,
      })
    }).catch(error => {
      console.error(error.message, error);
    });

    this.db.selectGearById(circuit.gearbox_id).then(data => {
      this.circuit.setGear(data)
    }).catch(error => {
      console.error(error.message, error);
    });

  }

  public clear() {
    this.circuit = new Circuit(this.db);
  }

}
