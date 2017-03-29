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
  Services
} from '../providers/circuit-provider';
import {CalculProvider}
from '../providers/calcul-provider';
import {
  HttpProvider
} from '../providers/http-provider';

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
RatioPage
} from '../pages/ratio/ratio';
import {CircuitPage} from '../pages/circuit/circuit';

import {
  RatioAlertComponent
} from '../components/ratio-alert/ratio-alert';
import {
  PopoverPageComponent
} from '../components/popover-page/popover-page';



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
    RatioPage,
    CircuitPage,
    RatioAlertComponent,
    PopoverPageComponent
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
    RatioPage,
    CircuitPage,
    RatioAlertComponent,
    PopoverPageComponent
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: IonicErrorHandler
  }, DBProvider,Services, CalculProvider, HttpProvider, Storage],
})
export class AppModule {}
