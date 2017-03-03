import { Component,ViewChild } from '@angular/core';
import{Tabs, AlertController} from 'ionic-angular';
import { HomePage } from '../home/home';
import { CarPage } from '../car/car';
import { GearboxPage } from '../gearbox/gearbox';
import { AbacusPage } from '../abacus/abacus';
import{CarProvider} from '../../providers/car-provider';
import{RatioProvider} from '../../providers/ratio-provider';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  @ViewChild('tabs') tabRef : Tabs;
  tab1Root: any = HomePage;
  tab2Root: any = CarPage;
  tab3Root: any = GearboxPage;
  tab4Root: any = AbacusPage
  constructor(
    public carProv : CarProvider,
    public alertCtrl : AlertController,
    public ratioProv : RatioProvider
  ) {
    
  }
  checkCar():void {
    if(this.carProv.getSelectedCar())
    {
      let alert = this.alertCtrl.create({
        title: 'Attention!',
        subTitle: 'Veuillez Selectionner une voiture!',
        buttons: ['OK']
      });
      alert.present();
    }
  }
}
