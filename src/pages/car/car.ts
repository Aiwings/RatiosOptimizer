import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import {
  NavController,
  ModalController,
  ToastController,
  PopoverController
} from 'ionic-angular';
import {
  CarProvider
} from '../../providers/car-provider';
import {
  Car
} from '../../app/car';
import {
  PopoverPageComponent
} from '../../components/popover-page/popover-page';
import {
  Subscription
} from 'rxjs/Subscription';
@Component({

  selector: 'page-car',
  templateUrl: 'car.html',

})
export class CarPage implements OnInit, OnDestroy {

  constructor
    (
      public navCtrl: NavController,
      public modalCtrl: ModalController,
      private carProvider: CarProvider,
      private toastCtrl: ToastController,
      private fb: FormBuilder,
      private popCtrl: PopoverController
    ) {

       this.carsSub = this.carProvider.getCars().subscribe(
         cars => {
           this.cars = cars;
         },
         err => {
           console.log(err.message);
          this.cars = [];
           this.toasterror.setMessage("can't find cars " + err.message);
           this.toasterror.present();
         });
    }
  carForm: FormGroup;
  cars: Car[] = [];
  carsSub: Subscription;
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



  ngOnInit(): void {
    console.log("## Cars On Init ###");

    this.carForm = this.fb.group({
      id: 0,
      date_config: '',
      brand: ['', Validators.required],
      type: ['', Validators.required],
      fia_category: ['', Validators.required],
      weight: ['', Validators.required],
      nb_speed: ['', Validators.required],
      bevelgear: this.fb.group({
        a: ['', Validators.required],
        b: ['', Validators.required]
      }),
      max_engine_speed: ['', Validators.required],
    });
    this.subcribeToFormChanges();
  }
  subcribeToFormChanges() {
    // initialize stream
    const formChanges$ = this.carForm.valueChanges;

    // subscribe to the stream 
    formChanges$.subscribe((x) => {
      if (this.carForm.valid) {
        console.log(x);
        this.carProvider.setSelectedCar(x);
        this.carProvider.setValid(true);
      } else {
        this.carProvider.setValid(false);
      }
    });
  }
  ngOnDestroy() {
    this.carsSub.unsubscribe();
  }
  presentPopover(event) {
    let popover = this.popCtrl.create(PopoverPageComponent, {
      selectitems: this.cars,
      titre: 'Voitures',
      select: (element) => {

        this.carProvider.setSelectedCar(element);
        this.carForm.setValue(element, {
          onlySelf: true
        });
      },
      save: () => {
        if (this.carForm.valid) {
          if (this.carForm.value.id == 0) {
            this.create(this.carForm)
          } else {
            this.update(this.carForm);
          }
        }

      }
    });
    popover.present({
      ev: event
    });
  }

  update(form: FormGroup): void {

    this.carProvider.saveCar(form.value).then((data) => {
      this.toastsuccess.setMessage("Votre Voiture a bien été sauvegardée");
      this.toastsuccess.present();
    }).catch((error) => {
      this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde \n " + error.message);
      this.toasterror.present();
    });
  }

  create(form: FormGroup): void {

    this.carProvider.addCar(form.value).then((data) => {
      this.toastsuccess.setMessage("Votre Voiture a bien été ajoutée");
      this.toastsuccess.present();
    }).catch((error) => {
      this.toasterror.setMessage("Il y a eu une erreur lors de l'ajout \n " + error.message);
      this.toasterror.present();
    });

  }
}
