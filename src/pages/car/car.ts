import {
  Component,
  OnInit,

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
  CircuitProvider
} from '../../providers/circuit-provider';
import {
  Circuit
} from '../../app/circuit';
import {
  GearboxPage
} from '../gearbox/gearbox';


import {
  PopoverPageComponent
} from '../../components/popover-page/popover-page';


@Component({

  selector: 'page-car',
  templateUrl: 'car.html',

})
export class CarPage implements OnInit {



  constructor
    (
      public navCtrl: NavController,
      public modalCtrl: ModalController,
      private circProv: CircuitProvider,
      private toastCtrl: ToastController,
      private fb: FormBuilder,
      private popCtrl: PopoverController
    ) {
      this.circuit = this.circProv.getCircuit();

    }

  private circuit: Circuit;
  carForm: FormGroup;



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


    this.carForm = this.fb.group({
      id: 0,
      date_config: '',
      brand: ['', Validators.required],
      type: ['', Validators.required],
      fia_category: ['', Validators.required],
      weight: ['', Validators.required],
      nb_speed: [3, Validators.required],
      bevelgear: this.fb.group({
        a: ['', Validators.required],
        b: ['', Validators.required]
      }),
      max_engine_speed: ['', Validators.required],
      tire_diam: ['', Validators.required]
    });
    this.subcribeToFormChanges();
    let car = this.circuit.getCar().get();
    console.log(car);
    if(car.brand != "")
    {
      this.carForm.setValue(car, {
      onlySelf: true
    });
    }
    
  }
  subcribeToFormChanges() {
    // initialize stream
    const formChanges$ = this.carForm.valueChanges;

    // subscribe to the stream 
    formChanges$.subscribe((x) => {
      if (this.carForm.valid) {
        this.circuit.setCar(x);
      } else {

      }
    });
  }

  presentPopover(event) {
    let popover = this.popCtrl.create(PopoverPageComponent, {
      titre: 'Voitures',
      select: (x) => {
        this.circuit.setCar(x);
        this.carForm.setValue(x, {
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

    this.circuit.getCar().save().then((data) => {
      this.toastsuccess.setMessage("Votre Voiture a bien été sauvegardée");
      this.toastsuccess.present();
    }).catch((error) => {
      this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde \n " + error.message);
      this.toasterror.present();
    });
  }

  create(form: FormGroup): void {

    this.circuit.getCar().save().then((data) => {
      this.toastsuccess.setMessage("Votre Voiture a bien été ajoutée");
      this.toastsuccess.present();
    }).catch((error) => {
      this.toasterror.setMessage("Il y a eu une erreur lors de l'ajout \n " + error.message);
      this.toasterror.present();
    });
  }
  togb() {
    this.navCtrl.setRoot(GearboxPage);
  }

}
