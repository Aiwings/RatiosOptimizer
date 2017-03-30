import {
  Injectable
} from '@angular/core';
import {
  Gearbox
} from '../app/gearbox';
import {
  DBProvider
} from './db-provider'
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';


@Injectable()
export class GearProvider {

  constructor(
    private db: DBProvider) {
    console.log('Calling, GearProvider Provider');

  }

   gearBox = new BehaviorSubject < Gearbox > ({
    id: 0,
    brand: "",
    type: "",
    serial: 0
  });
  reset(){
    this.gearBox.next({
    id: 0,
    brand: "",
    type: "",
    serial: 0
  });
  }
}
