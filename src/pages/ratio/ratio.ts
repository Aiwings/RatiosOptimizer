import {
  Component, 
} from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController
} from 'ionic-angular';
import {
  Subscription
} from 'rxjs/Subscription';
import {
  RatioProvider
} from '../../providers/ratio-provider';
import {
  Ratio
} from '../../app/ratio';
import {
  RatioAlertComponent
} from '../../components/ratio-alert/ratio-alert';
import {AbacusPage}  from '../abacus/abacus';

@Component({
  selector: 'page-ratio',
  templateUrl: 'ratio.html'
})
export class RatioPage {

  ratioSub: Subscription;
  enabled: boolean = true;
  ratios: Ratio[];
  type: string;
  valid : boolean ;
  valid$ :Subscription;
  constructor(public navCtrl: NavController, public navParams: NavParams, public ratioProvider: RatioProvider, public modalCtrl: ModalController) {
    this.ratioSub = this.ratioProvider.getRatios().subscribe(ratios=>{
      this.ratios = ratios;
    });

    this.valid$ = this.ratioProvider.isValid().subscribe(valid=>{
      this.valid == valid;
    });
  }

  ngOnDestroy(): void {
    this.ratioSub.unsubscribe();
  }
 


  deleteRatio(ratio: Ratio) {
    let index = this.ratios.indexOf(ratio);
    this.ratios.splice(index, 1);
    this.valid = this.ratioProvider.setRatios(this.ratios);
  }


  onCreate(): void {
    this.enabled = false;
    let modal = this.modalCtrl.create(RatioAlertComponent);
    modal.present();
    modal.onDidDismiss((data) => {
      this.enabled = true;
      if (data.ratio) {
        this.ratios.push(data.ratio);
        this.valid = this.ratioProvider.setRatios(this.ratios);
      }
    });
  }
  onValid()
  {
    this.navCtrl.setRoot(AbacusPage);
  }

  modify(ratio: Ratio) {
    this.enabled = false;
    let index = this.ratios.indexOf(ratio);
    let modal = this.modalCtrl.create(RatioAlertComponent, {
      ratio: ratio
    });
    modal.present();
    modal.onDidDismiss((data) => {
      this.enabled = true;
      if (data.ratio) {
        this.ratios[index] = data.ratio;
        this.valid = this.ratioProvider.setRatios(this.ratios);
      }
    });
  }

}
