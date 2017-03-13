import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
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
  GearProvider
} from '../../providers/gear-provider';
import {
  RatioModalComponent
} from '../../components/ratio-modal/ratio-modal';
import {
  PopoverPageComponent
} from '../../components/popover-page/popover-page';
import {
  Gearbox
} from '../../app/gearbox';
import {
  Car
} from '../../app/car';
import {
  Subscription
} from 'rxjs/Subscription';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
@Component({
  selector: 'page-gearbox',
  templateUrl: 'gearbox.html'
})
export class GearboxPage implements OnInit, OnDestroy {

  gearForm: FormGroup;
  car: Car;
  carSub: Subscription;

  types = ["DG", "DGB", "FG400", "FGA", "FT1", "FT200", "LD", "LG400", "LG500", "MK5", "MK6", "MK8"];
  gearBoxes: Gearbox[] = [];

  constructor(
    public navCtrl: NavController,
    private carProv: CarProvider,
    public modalCtrl: ModalController,
    public gearProv: GearProvider,
    private toastCtrl: ToastController,
    private popCtrl: PopoverController,
    private fb: FormBuilder) {

    this.carSub = this.carProv.getSelectedCar().subscribe((car) => {
      this.car = car;
    });
  }
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

    this.gearForm = this.fb.group({
      id: 0,
      brand: ['', Validators.required],
      type: ['', Validators.required],
      serial: ['', Validators.required]
    });
    this.gearProv.getGBs().then((gbs) => {
      if (gbs) {
        this.gearBoxes = gbs;
      }
    }).catch((error) => {
      console.error(error.message, error);
    });

    this.subscribeToFormChanges();
  }

  ngOnDestroy() {
    this.carSub.unsubscribe();
  }

  subscribeToFormChanges() {
    const formChanges$ = this.gearForm.valueChanges;

    formChanges$.subscribe((x) => {
      if (this.gearForm.valid) {
        this.gearProv.setGB(x);
      }
    });
  }
  presentPopover(event) {
    let popover = this.popCtrl.create(PopoverPageComponent, {
      selectitems: this.gearBoxes,
      titre: "Boîtes",
      select: (element) => {
        this.gearProv.setGB(element);
        this.gearForm.setValue(element, {
          onlySelf: true
        });
      },
      save: () => {
        if (this.gearForm.valid) {
          this.save();
        }
      }
    });
    popover.present({
      ev: event
    });
  }


  save(): void {
    let gb: Gearbox = this.gearForm.value;
    if (gb.id == 0) {
      let length = this.gearBoxes.length;
      let id = length + 1;
      gb.id = id;
      this.gearBoxes.push(gb);
    } else {
      let index = gb.id - 1;
      this.gearBoxes[index] = gb;
    }
    this.gearProv.saveGB(gb).then((data) => {
      this.toastsuccess.setMessage("Succès de la sauvegarde");
      this.toastsuccess.present();

    }).catch((error) => {
      this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde \n " + error.message);
      this.toasterror.present();
    });
  }

  ratios(): void {
    let modal = this.modalCtrl.create(RatioModalComponent, {});
    modal.present();
    modal.onDidDismiss((data) => {});
  }
}
