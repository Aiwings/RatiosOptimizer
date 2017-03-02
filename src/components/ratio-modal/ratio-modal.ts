import { Component, OnInit } from '@angular/core';
import{ModalController,NavParams,ViewController} from 'ionic-angular';
import {RatioAlertComponent} from '../ratio-alert/ratio-alert'
import {Ratio} from '../../app/ratio';
import {RatioProvider} from '../../providers/ratio-provider'

/*
  Generated class for the RatioModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'ratio-modal',
  templateUrl: 'ratio-modal.html'
})
export class RatioModalComponent implements OnInit{


  enabled= true;
  ratios : Ratio [];
  
  type : string;
  constructor(public modalCtrl : ModalController,
              public params : NavParams,
              public viewCtrl:ViewController,
              public ratioProvider: RatioProvider) {
    console.log('Calling  RatioModal Component');

  }
  ngOnInit():void{
    this.ratios = this.ratioProvider.getRatios()
  }
  deleteRatio(ratio:Ratio)
  {
    let index =this.ratios.indexOf(ratio);
    this.ratios.splice(index,1);
  }


  onCreate():void {
    this.enabled = false;
    let modal = this.modalCtrl.create(RatioAlertComponent);
    modal.present();
    modal.onDidDismiss((data)=>{
      this.enabled = true;
      if(data.ratio)
      {
        this.ratios.push(data.ratio);
      }

    });
    
  }
  dismiss():void{
    this.ratioProvider.setRatios(this.ratios);
    this.viewCtrl.dismiss();
  }


}
