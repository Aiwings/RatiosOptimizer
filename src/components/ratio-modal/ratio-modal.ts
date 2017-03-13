import {
  Component,
  OnDestroy
} from '@angular/core';
import {
  ModalController,
  NavParams,
  ViewController,
  AlertController
} from 'ionic-angular';
import {
  RatioAlertComponent
} from '../ratio-alert/ratio-alert'
import {
  Ratio
} from '../../app/ratio';
import {
  RatioProvider
} from '../../providers/ratio-provider';
import {
  Subscription
} from 'rxjs/Subscription';

@Component({
  selector: 'ratio-modal',
  templateUrl: 'ratio-modal.html'
})
export class RatioModalComponent implements OnDestroy {

  ratioSub:Subscription;
  enabled = true;
  ratios: Ratio[];

  type: string;
  constructor(public modalCtrl: ModalController,
    public params: NavParams,
    public viewCtrl: ViewController,
    public ratioProvider: RatioProvider,
    public alertCtrl: AlertController) {
    console.log('Calling  RatioModal Component');

    this.ratioSub = this.ratioProvider.getRatios().subscribe((ratios) => {
      this.ratios = ratios;
    });
  }
  ngOnDestroy(): void {
    this.ratioSub.unsubscribe();
  }
  deleteRatio(ratio: Ratio) {
    let index = this.ratios.indexOf(ratio);
    this.ratios.splice(index, 1);
  }


  onCreate(): void {
    this.enabled = false;
    let modal = this.modalCtrl.create(RatioAlertComponent);
    modal.present();
    modal.onDidDismiss((data) => {
      this.enabled = true;
      if (data.ratio) {
        this.ratios.push(data.ratio);
      }

    });

  }
  modify(ratio: Ratio)
  {
  this.enabled = false;
  let index = this.ratios.indexOf(ratio);
    let modal = this.modalCtrl.create(RatioAlertComponent,{
      ratio : ratio
    });
    modal.present();
    modal.onDidDismiss((data) => {
      this.enabled = true;
      if (data.ratio) {
        this.ratios[index] = data.ratio;
      }
    });
  }
  dismiss(): void {
    if (this.ratioProvider.setRatios(this.ratios)) {
      this.viewCtrl.dismiss();
    } else {
      let alert = this.alertCtrl.create({
        title: "Attention!",
        message: 'Vous avez saisi un nombre incorrect de rapports',
        buttons: [{
            text: 'Quitter',
            handler: () => {
              this.viewCtrl.dismiss();
            }
          },
          {
            text: 'Modifier',
            handler: () => {}
          }
        ]
      })
      alert.present();
    }

  }


}
