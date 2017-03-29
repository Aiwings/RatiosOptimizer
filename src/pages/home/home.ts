import {
  Component
} from '@angular/core';
import {
  NavController,
  AlertController
} from 'ionic-angular';
import {
  DBProvider
} from '../../providers/db-provider';
import {
  CircuitProvider
} from '../../providers/circuit-provider';
import {CarPage} from '../car/car';
import {CircuitPage}  from '../circuit/circuit'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // tabs:Tabs;

  constructor(

    public navCtrl: NavController,
    public db: DBProvider,
    public circProv: CircuitProvider,
    public alertCtrl: AlertController
  ) {
    //  this.tabs = navCtrl.parent;
  }

  toCar(): void {
    this.navCtrl.setRoot(CarPage);
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
              this.navCtrl.setRoot(CircuitPage);
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
