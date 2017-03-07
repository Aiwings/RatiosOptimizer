import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import {
  NavController,
  ModalController,
  ToastController
} from 'ionic-angular';
import {
  CarProvider
} from '../../providers/car-provider';
import {
  Car
} from '../../app/car';

@Component({

  selector: 'page-car',
  templateUrl: 'car.html',

})
export class CarPage implements OnInit {

  constructor
    (
      public navCtrl: NavController,
      public modalCtrl: ModalController,
      private carProvider: CarProvider,
      private toastCtrl: ToastController
    ) {

    }

  cars: Car[] = [];
  selectedCar : Car;
  toastsuccess = this.toastCtrl.create({
    message: '',
    position: 'bottom',
    duration: 3000
  });

  toasterror = this.toastCtrl.create({
    message: '',
    position: 'bottom',
    showCloseButton: true,
    closeButtonText: 'ok'
  });

  public carForm = new FormGroup({
    id: new FormControl(0, Validators.required),
    date_config: new FormControl(),
    brand: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    fia_category: new FormControl("", Validators.required),
    weight: new FormControl(0, Validators.required),
    nb_speed: new FormControl(""),
    bevel_gear1: new FormControl("", Validators.required),
    bevel_gear2: new FormControl("", Validators.required),
    max_engine_speed: new FormControl("", Validators.required)
  });

  ngOnInit(): void {
    console.log("## Cars On Init ###");

    let car : Car = {
    id: 0,
    date_config: new Date(),
    brand: "",
    type: "",
    fia_category: "",
    weight: 0,
    nb_speed: 3,
    bevel_gear1: 0,
    bevel_gear2: 0,
    max_engine_speed: 0,
  };
    this.carForm.setValue(car, {
      onlySelf: true
    });


    this.carProvider.getCars().then((cars) => {
      this.cars = cars;
    });

  }
  onSelect(): void {

    if (this.selectedCar) {
      this.carProvider.setSelectedCar(this.selectedCar);
      this.carForm.setValue(this.selectedCar, {
        onlySelf: true
      });
    }

  }


  onSave(form: FormGroup): void {

    this.carProvider.saveCar(form.value).then((data) => {
      this.toastsuccess.setMessage("Votre Voiture a bien été sauvegardée");
      this.toastsuccess.present();
    }).catch((error) => {
      this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde \n " + error.message);
      this.toasterror.present();
    });
  }

  onCreate(form: FormGroup): void {

    this.carProvider.addCar(form.value).then((data) => {
      this.toastsuccess.setMessage("Votre Voiture a bien été ajoutée");
      this.toastsuccess.present();
    }).catch((error) => {
      this.toasterror.setMessage("Il y a eu une erreur lors de l'ajout \n " + error.message);
      this.toasterror.present();
    });

  }


}
