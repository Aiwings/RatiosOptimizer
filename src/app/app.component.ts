import {
  Component,
  ViewChild
} from '@angular/core';
import {
  Nav,
  Platform,
  AlertController
} from 'ionic-angular';
import {
  StatusBar,
  Splashscreen
} from 'ionic-native';
import {
  Subscription
} from 'rxjs/Subscription';

import {
  HomePage
} from '../pages/home/home';
import {
  CarPage
} from '../pages/car/car';
import {
  GearboxPage
} from '../pages/gearbox/gearbox';
import {
  AbacusPage
} from '../pages/abacus/abacus';
import {
  DBProvider
} from '../providers/db-provider';
import {CircuitProvider} from '../providers/circuit-provider';

import {
  CarProvider
} from '../providers/car-provider';
import {
  RatioPage
} from '../pages/ratio/ratio';
import {
  RatioProvider
} from '../providers/ratio-provider';
import {CircuitPage} from '../pages/circuit/circuit';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage = HomePage;
  pages: Array < {
    title: string,
    component: any,
    enabled: boolean,
    icon: string
  } > ;
  pagecircuit  : {
    title: string,
    component: any,
    enabled: boolean,
    icon: string
  } = {title:'',component:{},enabled:false,icon:''}  ;

  carSub: Subscription;
  carValid: boolean = false;

  ratioSub: Subscription;
  ratiosValid: boolean;
  
  circSub : Subscription;

  constructor(
    platform: Platform,
    private db: DBProvider,
    private carProv: CarProvider,
    public ratioProv: RatioProvider,
    public circProv : CircuitProvider,
    public alertCtrl : AlertController
  ) {
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
      }).catch(error => {
        console.error(error.message, error);

      });
    }
    this.pages = [{
        title: 'Accueil',
        component: HomePage,
        enabled: true,
        icon: "home"
      },
      {
        title: 'Voiture',
        component: CarPage,
        enabled: true,
        icon: "md-car"
      },
      {
        title: 'Boite Vitesse',
        component: GearboxPage,
        enabled: false,
        icon: "md-options"
      },
      {
        title: 'Rapports',
        component: RatioPage,
        enabled: false,
        icon: "md-cog"
      },
      {
        title: 'Abaque',
        component: AbacusPage,
        enabled: false,
        icon: "md-analytics"
      }
    ];
    this.pagecircuit ={
      title:"Nouveau",
      component : CircuitPage,
      enabled:false,
      icon: "ios-infinite"
    }

    this.carSub = this.carProv.isValid().subscribe((valid) => {
      console.log("carvalid " + valid);
      this.pages[2].enabled = valid;
      this.pages[3].enabled = valid;
      this.pages[4].enabled = valid && this.ratiosValid;

      this.carValid = valid;
    });
    this.ratioSub = this.ratioProv.isValid().subscribe((valid) => {
      this.ratiosValid = valid;
      this.pages[4].enabled = valid && this.carValid;
      this.pagecircuit.enabled = valid && this.carValid;
      console.log("ratiovalid " + valid);
    });

    this.circSub = this.circProv.getCircuit().subscribe(circ=>{
      if (circ.name !='')
      {
        this.pagecircuit.title = circ.name;
      }
    });

  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
   circuit(): void {
    this.db.getCircuits().then(data => {
      let options = {
        title: 'Circuit',
        message: 'Selectionner un circuit',
        buttons: [{
            text: 'Annuler',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: data => {
              console.log(data);
              this.circProv.setCircuit(data);
            }
          }
        ],
        inputs: []
      };

      for (let i = 0; i < data.length; i++) {
        options.inputs.push({
          name: data[i].name,
          value: data[i],
          label: data[i].name,
          type: 'radio'
        });
      }
      // Create the alert with the options
      let alert = this.alertCtrl.create(options);
      alert.present();

    });


  }

}
