import { Component } from '@angular/core';
import {  ModalController, NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

 // tabs:Tabs;

  constructor(

    public modalCtrl: ModalController,
    public navCtrl :NavController
    ) {
  //  this.tabs = navCtrl.parent;

  }

  toCar():void{
    this.navCtrl.parent.select(1);
  }
    circuitModalOpen():void{
    
  }

}
