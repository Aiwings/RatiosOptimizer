import {
  Component,
  OnInit,
  OnDestroy
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
  CircuitProvider
} from '../../providers/circuit-provider';
import {
  Ratio
} from '../../app/ratio';
import {
  RatioAlertComponent
} from '../../components/ratio-alert/ratio-alert';
import {
  AbacusPage
} from '../abacus/abacus';

@Component({
  selector: 'page-ratio',
  templateUrl: 'ratio.html'
})
export class RatioPage implements OnInit, OnDestroy {

  ratioSub: Subscription;
  enabled: boolean = true;
  ratios: Ratio[];
  type: string;
  valid: boolean;
  valid$: Subscription;
  state: number = -1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public circProv: CircuitProvider, public modalCtrl: ModalController) {
    this.ratioSub = this.circProv.circuit.$getRatios().subscribe((ratios)=>{
      if (ratios.length != 0) {
        this.valid = true;
      }
      this.ratios = ratios;
    });

    this.valid$ = this.circProv.circuit.valid().subscribe(valid => {
      this.valid == valid;
    });
  }

  ngOnDestroy(): void {
    this.ratioSub.unsubscribe();
  }
  ngOnInit(): void {
    this.state = this.circProv.circuit.setRatios(this.ratios);
    if (this.state != 0) {
      this.valid = false;
    }
  }
  getColor(index) {
    if (index % 2 != 0) {
      return "#303030";
    } else {
      return "#424242";
    }
  }


  deleteRatio(ratio: Ratio) {
    let index = this.ratios.indexOf(ratio);
    this.ratios.splice(index, 1);
    this.state = this.circProv.circuit.setRatios(this.ratios);
    if (this.state != 0) {
      this.valid = false;
    }
  }


  onCreate(): void {
    this.enabled = false;
    let modal = this.modalCtrl.create(RatioAlertComponent, {
      index: this.ratios.length + 1
    });
    modal.present();
    modal.onDidDismiss((data) => {
      this.enabled = true;
      if (data.ratio) {
        this.ratios.push(data.ratio);
        this.state = this.circProv.circuit.setRatios(this.ratios);
      }
    });
  }
  onValid() {
    this.navCtrl.setRoot(AbacusPage);
  }

  modify(ratio: Ratio) {
    this.enabled = false;
    let index = this.ratios.indexOf(ratio);
    let modal = this.modalCtrl.create(RatioAlertComponent, {
      ratio: ratio,
      index : index+1
    });
    modal.present();
    modal.onDidDismiss((data) => {
      this.enabled = true;
      if (data.ratio) {
        this.ratios[index] = data.ratio;
        this.state = this.circProv.circuit.setRatios(this.ratios);
      }
    });
  }

}
