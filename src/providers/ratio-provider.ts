import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import {
  Subscription
} from 'rxjs/Subscription';
import {
  Ratio
} from '../app/ratio';
import {
  Car
} from '../app/car';
import {
  CarProvider
} from './car-provider'

@Injectable()
export class RatioProvider {

  constructor(
    public carProv: CarProvider
  ) {
    console.log('Calling RatioProvider Provider');
    this.carSub = this.carProv.getSelectedCar().subscribe((car) => {
      if (this.car) {
        if (this.ratios.value.length != car.nb_speed) {
          this.ratioValid.next(false);
        }
        else
        {
          this.ratioValid.next(true);
        }
      }
      this.car = car;
    })
  }
  carSub: Subscription;
  car: Car;
  private ratios = new BehaviorSubject < Ratio[] > ([]);

  private ratioValid = new BehaviorSubject < boolean > (false);

  public isValid() {
    return this.ratioValid.asObservable();
  }

  public getRatios() {
    return this.ratios.asObservable();
  }

  public setRatios(ratios: Ratio[]): boolean {
    console.log(this.car.nb_speed);
    console.log(ratios);
    if (this.car.nb_speed == ratios.length) {
      this.ratios.next(ratios);
      this.ratioValid.next(true);
      return true;
    }
    return false;
  }
}
