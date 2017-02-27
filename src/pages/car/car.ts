import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators} from '@angular/forms';
import { CarModal} from '../carmodal/carmodal';
import { NavController, ModalController } from 'ionic-angular';
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
    private carProvider: CarProvider
  ) {
    
  }
    car: Car;


    public carForm = new FormGroup(
      {
       id: new FormControl(0,Validators.required),
       date_config: new FormControl(),
       brand:new FormControl("", Validators.required),
       type:new FormControl("", Validators.required),
       fia_category:new FormControl("", Validators.required),
       weight:new FormControl(0, Validators.required),
       nb_speed:new FormControl(3, Validators.required),
       bevel_gear1:new FormControl(0,Validators.required),
       bevel_gear2:new FormControl(0, Validators.required),
       max_engine_speed:new FormControl(0, Validators.required)
    }
);



    
    ;
    carModalOpen():void{

        this.carProvider.getCars().then((cars) => {       
      
    
        console.log(cars);

        let modal = this.modalCtrl.create(CarModal,{cars:cars});
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
            this.carForm.setValue(this.car,{onlySelf:true});
           
          }

       });
      }    
    );
  }
  ngOnInit():void{
    console.log("## Cars On Init ###");
    this.carModalOpen();
  }


  onSave( form :FormGroup):void{
   
    this.carProvider.saveCar(form.value);
  }

  onCreate( form :FormGroup):void{

    this.carProvider.addCar(form.value);

  }


}