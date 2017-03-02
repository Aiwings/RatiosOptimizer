import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import {Storage} from '@ionic/storage';



import { MyApp } from './app.component';

import {DBProvider} from '../providers/db-provider';
import {CarProvider} from '../providers/car-provider';
import {GearProvider} from '../providers/gear-provider';
import {RatioProvider} from '../providers/ratio-provider';
import {CalculProvider} from '../providers/calcul-provider';

import { CarPage } from '../pages/car/car';
import { AbacusPage } from '../pages/abacus/abacus';
import { GearboxPage } from '../pages/gearbox/gearbox';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { CarModalComponent } from '../components/car-modal/car-modal';
import {RatioModalComponent } from '../components/ratio-modal/ratio-modal';
import {RatioAlertComponent } from '../components/ratio-alert/ratio-alert';
import {GearModalComponent} from '../components/gear-modal/gear-modal';


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
    CarModalComponent,
    RatioModalComponent,
    RatioAlertComponent,
    GearModalComponent
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
    CarModalComponent,
    RatioModalComponent,
    RatioAlertComponent,
    GearModalComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},CarProvider,GearProvider,DBProvider,RatioProvider,CalculProvider, Storage],
})
export class AppModule {}
