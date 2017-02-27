import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators} from '@angular/forms';
import { NavController, AlertController} from 'ionic-angular';
import {CarProvider} from '../../providers/car-provider';
import {Car} from '../../app/car';
import {Gearbox} from '../../app/gearbox';
@Component({
  selector: 'page-gearbox',
  templateUrl: 'gearbox.html'
})
export class GearboxPage implements OnInit {

 
  private types = ["DG","DGB","FG400","FGA","FT1","FT200","LD","LG400","LG500","MK5","MK6","MK8"];
  
  constructor(
    public navCtrl: NavController,
    private carProv : CarProvider,
    public alertCtrl : AlertController) {

  }
  private gearForm = new FormGroup({
    id: new FormControl(0),
    car: new FormControl({value: '', disabled: true},Validators.required),
    carid : new FormControl(0),
    brand : new FormControl("",Validators.required),
    serial: new FormControl(0,Validators.required),
    type:new FormControl("DGB")
  });

   private  selectedCar :Car ;
  
  ngOnInit():void {
  
    this.selectedCar = this.carProv.getSelectedCar();
      if(!this.selectedCar)
      {
        let alert = this.alertCtrl.create({
          title: 'Attention!',
          subTitle: 'Veuillez Selectionner une voiture!',
          buttons: ['OK']
        });
        alert.present();
      }
      else
      {
        this.gearForm.patchValue({car:this.selectedCar.brand + ' | '+this.selectedCar.type ,carid:this.selectedCar.id });
      }
  }

    save(gear: Gearbox) :void{

    } 

    addRatio() :void {

    }

    deleteRatio():void {}
}
