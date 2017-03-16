import {
  Component
} from '@angular/core';
import {
  Platform
} from 'ionic-angular';
import {
  StatusBar,
  Splashscreen
} from 'ionic-native';

import {
  TabsPage
} from '../pages/tabs/tabs';
import {
  DBProvider
} from '../providers/db-provider';
import {
  GearProvider
} from '../providers/gear-provider';
import {
  CarProvider
} from '../providers/car-provider';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, private db: DBProvider,
    private carProv: CarProvider, private gearProv: GearProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.init();
    });
  }
  init(): void {
    if (!this.db.isOpen) {
    
      this.db.initDB().then(open => {
        this.db.isOpen = true;
      }).catch(error=>{
          console.error(error.message, error);

      });
    }
  }
}
