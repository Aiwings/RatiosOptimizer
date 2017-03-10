import { Injectable } from '@angular/core';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import {
  Subscription
} from 'rxjs/Subscription';
import {Ratio} from '../app/ratio';
import {CarProvider} from './car-provider'

@Injectable()
export class RatioProvider {

  constructor(
      public carProv :CarProvider
    ) {
    console.log('Calling RatioProvider Provider');
    this.carSub = this.carProv.getSelectedCar().subscribe((car)=>{
      this.car = car;
    })
  }
  carSub:Subscription;
  car;
  private ratios= new BehaviorSubject<Ratio[]>([]);

  private ratioValid =new BehaviorSubject<boolean>(false) ;

  public isValid() {
    return this.ratioValid.asObservable();
  }


 public getRatios() {
    return this.ratios.asObservable();
  }

  public setRatios(ratios:Ratio []):boolean{
    if(this.car.nb_speed == ratios.length)
    {
       this.ratios.next(ratios);
       this.ratioValid.next(true);
       return true; 
    }
    return false;
  }}
