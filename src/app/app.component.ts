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
import {
  Car
} from './car';

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

        this.db.getCars().then(data => {
          let cars: Car[] = [];
          for (let i = 0; i < data.length; i++) {
            let car: Car = {
              id: data[i].id,
              date_config: data[i].date_config,
              brand: data[i].brand,
              type: data[i].type,
              fia_category: data[i].fia_category,
              weight: data[i].weight,
              nb_speed: data[i].nb_speed,
              bevelgear: JSON.parse(data[i].bevelgear),
              max_engine_speed: data[i].max_engine_speed
            };
            cars.push(car);
          }
          this.carProv.setCars(cars);
        }).catch(error => {
          console.error(error.message, error);
        });
       
        this.db.selectGears().then(gbs => {
          this.gearProv.setGBs(gbs);
      
        }).catch(error => {
          console.error(error.message, error);
        });


      }).catch(error=>{
          console.error(error.message, error);

      });
    }
  }
}
