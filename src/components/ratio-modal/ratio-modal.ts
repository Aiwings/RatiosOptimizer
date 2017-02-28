import { Component } from '@angular/core';
import{ModalController} from 'ionic-angular';
import {RatioAlertComponent} from '../ratio-alert/ratio-alert'
import {Ratio} from '../../app/ratio';

/*
  Generated class for the RatioModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'ratio-modal',
  templateUrl: 'ratio-modal.html'
})
export class RatioModalComponent {



  ratios : Ratio [];
  
  type : string;
  constructor(public modalCtrl : ModalController) {
    console.log('Calling  RatioModal Component');

  }

  onCreate():void {
    let modal = this.modalCtrl.create(RatioAlertComponent);
    modal.present();
    modal.onDidDismiss((data)=>{
      if(data.ratio)
      {
        let id =1;
        if(!this.ratios)
        {
          this.ratios =[];
        }
        else
        {
          id = this.ratios.length;
        }
        data.ratio.id = id;
        this.ratios.push(data.ratio)
      }

    });
    
  }

}
