import { Component,OnInit } from '@angular/core';
import {
  NavParams,
  ViewController,
} from 'ionic-angular';
/*
  Generated class for the PopoverPage component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'popover-page',
  templateUrl: 'popover-page.html'
})
export class PopoverPageComponent implements OnInit {
  titre:string
  selectitems : any;
  save:any;
  select:any;
  constructor(private params : NavParams,
              private viewCtrl : ViewController) {
    console.log('Hello PopoverPage Component');
  }
  ngOnInit(){
      this.selectitems = this.params.get('selectitems');
      this.titre = this.params.get('titre');
      this.select = this.params.get('select');
      this.save=  this.params.get('save');
  }
  close(){
    this.viewCtrl.dismiss();
  }

}
