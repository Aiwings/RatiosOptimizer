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
  Circuit
} from './circuit';
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
  RatioPage
} from '../pages/ratio/ratio';
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
  circuit: Circuit;
  circSub : Subscription; 
  carSub: Subscription;
  valid: boolean = false;
  valSub: Subscription; 
  
  constructor(
    platform: Platform,
    private db: DBProvider,
    public circProv : CircuitProvider,
    public alertCtrl : AlertController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.circuit = this.circProv.getCircuit();
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
      title:"circuit...",
      component : CircuitPage,
      enabled:false,
      icon: "ios-infinite"
    }

    this.carSub = this.circuit.$getCar().subscribe((obj) => {
      let car = obj.get();
      let valid =(car.brand != "");
      this.pages[2].enabled = valid;
      this.pages[3].enabled = valid;
      this.pages[4].enabled = valid && this.valid;
    });
    this.valSub = this.circuit.valid().subscribe((valid) => {
      this.valid = (valid ==0);
      this.pages[4].enabled =  this.valid ;
      this.pagecircuit.enabled =  this.valid ;
    });

    this.circSub = this.circuit.change.subscribe(circname=>{
      if (circname !='')
      {
        this.pagecircuit.title = circname;
      }
    });

  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
   getCircuit(): void {
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
              this.circProv.setCircuit(data);
            this.nav.setRoot(CircuitPage);
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
  nouveauCircuit(){
    this.circProv.clear();
  }

}
