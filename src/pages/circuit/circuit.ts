import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ViewController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';

import {
  Subscription
} from 'rxjs/Subscription';

import {
  Circuit
} from '../../app/circuit';


import {
  CircuitProvider
} from '../../providers/circuit-provider';

@Component({
  selector: 'page-circuit',
  templateUrl: 'circuit.html'
})
export class CircuitPage implements OnInit, OnDestroy {


  @Output()
  onSave: EventEmitter < any > = new EventEmitter();
  afterSave: Subscription;
  circuit : Circuit;
  circForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private circProv: CircuitProvider,
    private viewCtrl: ViewController,
    private fb: FormBuilder,
    private toastCtrl: ToastController) {
      this.circuit = this.circProv.getCircuit();

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CircuitPage');
  }

  save() {

      this.circuit.save().then(data => {
          this.toastsuccess.setMessage("Votre circuit a bien été enregistré");
          this.toastsuccess.present();
        }).catch(error => {
          this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde \n " + error.message);
          this.toasterror.present();
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

  ngOnDestroy() {

  }
  ngOnInit() {
    let circuit = this.circuit.get();
    this.circForm = this.fb.group({
      id: circuit.id,
      car_id: circuit.car_id,
      gearbox_id: circuit.gearbox_id,
      name: [circuit.name, Validators.required],
      events: [circuit.event, Validators.required],
      v_max: [{
        value: circuit.v_max,
        disabled: true
      }],
      weather: circuit.weather,
      comments: circuit.comments
    });
    this.subscribeToFormChange();
    
  }
  subscribeToFormChange() {
    const circChanges$ = this.circForm.valueChanges;

    circChanges$.subscribe(circuit => {
      if (this.circForm.valid) {
        this.circuit.updateInfos(circuit);
      }
    });
  }
}
