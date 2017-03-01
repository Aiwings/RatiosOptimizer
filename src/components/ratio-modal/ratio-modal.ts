import { Component, OnInit } from '@angular/core';
import{ModalController,NavParams,ViewController} from 'ionic-angular';
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
export class RatioModalComponent implements OnInit{



  ratios : Ratio [];
  
  type : string;
  constructor(public modalCtrl : ModalController,
              public params : NavParams,
              public viewCtrl:ViewController) {
    console.log('Calling  RatioModal Component');

  }
  ngOnInit():void{
    this.ratios = this.params.get('ratios');
  }
  deleteRatio(ratio:Ratio)
  {
    let index =this.ratios.indexOf(ratio);
    this.ratios.splice(index,1);
  }


  onCreate():void {
    let modal = this.modalCtrl.create(RatioAlertComponent);
    modal.present();
    modal.onDidDismiss((data)=>{
      if(data.ratio)
      {
        this.ratios.push(data.ratio);
      }

    });
    
  }
  dismiss():void{
  let data = {
     ratios: this.ratios
   };
  this.viewCtrl.dismiss(data);
  }


}
