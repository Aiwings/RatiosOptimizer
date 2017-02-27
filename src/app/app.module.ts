import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';

import {CarProvider} from '../providers/car-provider';
import {GearProvider} from '../providers/gear-provider';

import { CarPage } from '../pages/car/car';
import { AbacusPage } from '../pages/abacus/abacus';
import { GearboxPage } from '../pages/gearbox/gearbox';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { CarModal } from '../pages/carmodal/carmodal';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '2085da6d'
  }
};

@NgModule({
  declarations: [
    MyApp,
    CarPage,
    AbacusPage,
    HomePage,
    GearboxPage,
    TabsPage,
    CarModal
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CarPage,
    AbacusPage,
    HomePage,
    GearboxPage,
    TabsPage,
    CarModal
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},CarProvider,GearProvider],
})
export class AppModule {}
