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
  RatioPage
} from '../ratio/ratio';
import {
  Circuit
} from '../../app/circuit';
import {
  PopoverPageComponent
} from '../../components/popover-page/popover-page';
import {
  Subscription
} from 'rxjs/Subscription';
import {CircuitProvider} from '../../providers/circuit-provider';
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
  gearSub : Subscription;
  carSub: Subscription;
  car;
  circuit : Circuit ;
  types = ["DG", "DGB", "FG400", "FGA", "FT1", "FT200", "LD", "LG400", "LG500", "MK5", "MK6", "MK8"];


  constructor(
    public navCtrl: NavController,
    private circProv: CircuitProvider,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private popCtrl: PopoverController,
    private fb: FormBuilder) {

    this.circuit = this.circProv.getCircuit();



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

    this.subscribeToFormChanges();
    this.carSub = this.circuit.$getCar().subscribe(obj=>{
      this.car = obj.get();
    });

    this.gearSub = this.circuit.$getGear().subscribe(gb => {
      if (gb.id != 0 && this.gearForm) {
        if (gb.id != this.gearForm.value.id) {
          this.gearForm.setValue(gb, {
            onlySelf: true
          });
        }
      }

    });
  }

  ngOnDestroy() {
    this.gearSub.unsubscribe();
    this.carSub.unsubscribe();
  }

  subscribeToFormChanges() {
    const formChanges$ = this.gearForm.valueChanges;

    formChanges$.subscribe((x) => {
      if (this.gearForm.valid) {
        this.circuit.setGear(x);
      }
    });
  }
  presentPopover(event) {
    let popover = this.popCtrl.create(PopoverPageComponent, {
      titre: "Boîtes",
      select: (element) => {
        this.circuit.setGear(element);
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
    this.circuit.getGear().save().then((data) => {
      this.toastsuccess.setMessage("Succès de la sauvegarde");
      this.toastsuccess.present();

    }).catch((error) => {
      this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde \n " + error.message);
      this.toasterror.present();
    });
  }

  ratios(): void {
    this.navCtrl.setRoot(RatioPage);
  }
}
