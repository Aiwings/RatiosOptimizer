import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { CarPage } from '../car/car';
import { GearboxPage } from '../gearbox/gearbox';
import { AbacusPage } from '../abacus/abacus';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = CarPage;
  tab3Root: any = GearboxPage;
  tab4Root: any = AbacusPage
  constructor(

  ) {
    
  }
}
