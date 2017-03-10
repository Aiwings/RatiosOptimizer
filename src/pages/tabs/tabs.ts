import {
  Component,
  ViewChild
} from '@angular/core';
import {
  Tabs,
  AlertController
} from 'ionic-angular';
import {
  HomePage
} from '../home/home';
import {
  CarPage
} from '../car/car';
import {
  GearboxPage
} from '../gearbox/gearbox';
import {
  AbacusPage
} from '../abacus/abacus';
import {
  CarProvider
} from '../../providers/car-provider';
import {
  RatioProvider
} from '../../providers/ratio-provider';

import {
  Subscription
} from 'rxjs/Subscription';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  carValid: boolean;
  carSub: Subscription;

  ratiosValid: boolean;
  ratioSub: Subscription;
  @ViewChild('tabs') tabRef: Tabs;
  tab1Root: any = HomePage;
  tab2Root: any = CarPage;
  tab3Root: any = GearboxPage;
  tab4Root: any = AbacusPage
  constructor(
    public carProv: CarProvider,
    public alertCtrl: AlertController,
    public ratioProv: RatioProvider,

  ) {
    this.carSub = this.carProv.getValid().subscribe((valid) => {
      this.carValid = valid;
    });
    this.ratioSub = this.ratioProv.isValid().subscribe((valid) => {
      this.ratiosValid = valid;
    });
  }


}
