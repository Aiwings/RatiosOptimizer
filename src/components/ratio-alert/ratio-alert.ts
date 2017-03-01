import { Component } from '@angular/core';
import { FormGroup, FormControl,Validators} from '@angular/forms';
import {ViewController} from 'ionic-angular'
/*
  Generated class for the RatioAlert component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'ratio-alert',
  templateUrl: 'ratio-alert.html'
})
export class RatioAlertComponent {

  constructor(private viewCtrl : ViewController) {
    console.log('Calling RatioAlert Component');
  
  }

  public ratioForm = new FormGroup({
    type: new FormControl("1re",Validators.required),
    a: new FormControl("",Validators.required),
    b: new FormControl("",Validators.required)
  });

  onSave(form: any):void{
    let data = {
      ratio : form
    };
    this.viewCtrl.dismiss(data);
  }

  dismiss():void{
    this.viewCtrl.dismiss({});
  } 
}
