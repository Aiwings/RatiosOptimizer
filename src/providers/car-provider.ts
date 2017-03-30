import {
  Injectable
} from '@angular/core';

import {
  Car
} from '../app/car';
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import {
  DBProvider
} from './db-provider';


@Injectable()
export class CarProvider {


  car = new BehaviorSubject < Car > ({
    id: 0,
    date_config: new Date(),
    brand: "",
    type: "",
    fia_category: "",
    weight: 0,
    nb_speed: 3,
    bevelgear: {
      a: 0,
      b: 0
    },
    max_engine_speed: 0
  });

  valid = new BehaviorSubject < boolean > (false);

  constructor(public db: DBProvider,

  ) {
    console.log('Calling CarProvider Provider');
  }
  reset()
  {
    this.valid.next(false);
    this.car.next({
    id: 0,
    date_config: new Date(),
    brand: "",
    type: "",
    fia_category: "",
    weight: 0,
    nb_speed: 3,
    bevelgear: {
      a: 0,
      b: 0
    },
    max_engine_speed:0});

  }

}
