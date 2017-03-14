import {
  NgModule,
  ErrorHandler
} from '@angular/core';
import {
  IonicApp,
  IonicModule,
  IonicErrorHandler
} from 'ionic-angular';
import {
  CloudSettings,
  CloudModule
} from '@ionic/cloud-angular';
import {
  Storage
} from '@ionic/storage';



import {
  MyApp
} from './app.component';

import {
  DBProvider
} from '../providers/db-provider';
import {
  CarProvider
} from '../providers/car-provider';
import {
  GearProvider
} from '../providers/gear-provider';
import {
  RatioProvider
} from '../providers/ratio-provider';
import {
  CalculProvider
} from '../providers/calcul-provider';
import {
  CircuitProvider
} from '../providers/circuit-provider';

import {
  CarPage
} from '../pages/car/car';
import {
  AbacusPage
} from '../pages/abacus/abacus';
import {
  GearboxPage
} from '../pages/gearbox/gearbox';
import {
  HomePage
} from '../pages/home/home';
import {
  TabsPage
} from '../pages/tabs/tabs';


import {
  RatioModalComponent
} from '../components/ratio-modal/ratio-modal';
import {
  RatioAlertComponent
} from '../components/ratio-alert/ratio-alert';
import {
  PopoverPageComponent
} from '../components/popover-page/popover-page';
import {
  CircuitModalComponent
} from '../components/circuit-modal/circuit-modal';


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
    RatioModalComponent,
    RatioAlertComponent,
    PopoverPageComponent,
    CircuitModalComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CarPage,
    AbacusPage,
    HomePage,
    GearboxPage,
    TabsPage,
    RatioModalComponent,
    RatioAlertComponent,
    PopoverPageComponent,
    CircuitModalComponent
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: IonicErrorHandler
  }, DBProvider,CarProvider, GearProvider, RatioProvider, CalculProvider, CircuitProvider, Storage],
})
export class AppModule {}
