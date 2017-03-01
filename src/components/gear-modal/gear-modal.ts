import { Component } from '@angular/core';
import {  ViewController, NavParams } from 'ionic-angular';


@Component({
  selector: 'gear-modal',
  templateUrl: 'gear-modal.html'
})
export class GearModalComponent {
  
  gbs = this.params.get('gbs');
  constructor(
    public viewCtrl: ViewController,
    private params : NavParams
  ) {
    
  }
   dismiss() {
   let data = { };
   this.viewCtrl.dismiss(data);
 }

 onSelect(selectedgb):void {
   let data = {
     gb: selectedgb
   };
  this.viewCtrl.dismiss(data);
 }

 onCreate():void{
   let data = { };
   this.viewCtrl.dismiss(data);
 }
 

}
