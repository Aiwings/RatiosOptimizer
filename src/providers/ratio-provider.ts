import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import {
  Ratio
} from '../app/ratio';


@Injectable()
export class RatioProvider {

  constructor(
  ) {
    console.log('Calling RatioProvider Provider');
  }

  ratios = new BehaviorSubject < Ratio[] > ([]);
  valid = new BehaviorSubject < boolean > (false);

}
