import { Component } from '@angular/core';
import {  ViewController, NavParams } from 'ionic-angular';


@Component({
  selector: 'car-modal',
  templateUrl: 'carmodal.html'
})
export class CarModal {
  
  cars = this.params.get('cars');
  constructor(
    public viewCtrl: ViewController,
    private params : NavParams
  ) {
    
  }
   dismiss() {
   let data = { };
   this.viewCtrl.dismiss(data);
 }

 onSelect(selectedcar):void {
   let data = {
     car: selectedcar
   };
  this.viewCtrl.dismiss(data);
 }

 onCreate():void{
   let data = { };
   this.viewCtrl.dismiss(data);
 }
 

}
