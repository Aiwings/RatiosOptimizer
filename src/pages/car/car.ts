import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators} from '@angular/forms';
import { CarModalComponent} from '../../components/car-modal/car-modal';
import { NavController, ModalController,ToastController } from 'ionic-angular';
import {CarProvider} from '../../providers/car-provider';
import {Car} from '../../app/car';

@Component({
 
  selector: 'car',
  templateUrl: 'car.html',

})
export class CarPage implements OnInit{

  constructor
  (
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private carProvider: CarProvider,
    private toastCtrl : ToastController
  ) {
    
  }
    car: Car;
    toastsuccess = this.toastCtrl.create({
        message :'',
        position:'bottom',
        duration:3000
      });

      toasterror = this.toastCtrl.create({
        message :'',
        position:'bottom',
       showCloseButton:true,
       closeButtonText:'ok'
      });

    public carForm = new FormGroup(
      {
       id: new FormControl(0,Validators.required),
       date_config: new FormControl(),
       brand:new FormControl("", Validators.required),
       type:new FormControl("", Validators.required),
       fia_category:new FormControl("", Validators.required),
       weight:new FormControl(0, Validators.required),
       nb_speed:new FormControl(3, Validators.required),
       bevel_gear1:new FormControl("",Validators.required),
       bevel_gear2:new FormControl("", Validators.required),
       max_engine_speed:new FormControl("", Validators.required)
    }
);

    carModalOpen():void{
         
      this.carProvider.getCars().then((cars)=>{    
          let modal = this.modalCtrl.create(CarModalComponent,{cars:cars});
          modal.present();
          modal.onDidDismiss(data => {
          if(data.car)
          {
            this.car = data.car;
            this.carForm.setValue(this.car,{onlySelf:true});
            this.carProvider.setSelectedCar(this.car);
            console.log("### Selected Car ###");
            console.log(this.carProvider.getSelectedCar());
          }
          else
            {
              this.car = {
                id: 0,
                date_config:new Date(),
                brand:"",
                type:"",
                fia_category:"",
                weight:0,
                nb_speed:3,
                bevel_gear1: 0,
                bevel_gear2: 0,
                max_engine_speed:0,
              };
           //   this.carForm.setValue(this.car,{onlySelf:true});
            }
        });  
      });
    }    
  
  ngOnInit():void{
    console.log("## Cars On Init ###");
    this.carModalOpen();
  }


  onSave( form :FormGroup):void{
   
    this.carProvider.saveCar(form.value).then((data)=>{
      this.toastsuccess.setMessage("Votre Voiture a bien été sauvegardée");
      this.toastsuccess.present();
    }).catch((error)=>{
      this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde \n "+error.message);
      this.toasterror.present();
    });
  }

  onCreate( form :FormGroup):void{

    this.carProvider.addCar(form.value).then((data)=>{
      this.toastsuccess.setMessage("Votre Voiture a bien été ajoutée");
      this.toastsuccess.present();
    }).catch((error)=>{
      this.toasterror.setMessage("Il y a eu une erreur lors de l'ajout \n "+error.message);
      this.toasterror.present();
    });

  }


}
