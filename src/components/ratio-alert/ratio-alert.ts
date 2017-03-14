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
  ViewController,
  NavParams
} from 'ionic-angular';

@Component({
  selector: 'ratio-alert',
  templateUrl: 'ratio-alert.html'
})

export class RatioAlertComponent implements OnInit {

  constructor(private viewCtrl: ViewController, public params: NavParams) {
    console.log('Calling RatioAlert Component');

  }
  ratio;
  public ratioForm = new FormGroup({
    type: new FormControl("1re", Validators.required),
    a: new FormControl("", Validators.required),
    b: new FormControl("", Validators.required)
  });

  onSave(form: any): void {
    let data = {
      ratio: form
    };
    this.viewCtrl.dismiss(data);
  }

  dismiss(): void {
    let data = {};
    if (this.ratio) {
      data = {
        ratio: this.ratio
      };
    }
    this.viewCtrl.dismiss(data);
  }

  ngOnInit() {
    this.ratio = this.params.get('ratio');
    if (this.ratio) {
      this.ratioForm.setValue(this.ratio, {
        onlySelf: true
      });
    }
  }
}
