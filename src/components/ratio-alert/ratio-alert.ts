import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
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

  constructor(private viewCtrl: ViewController, public params: NavParams, public fb : FormBuilder) {
    console.log('Calling RatioAlert Component');

  }
  ratio;
  index:number=0;
  readOnly:boolean = false;
  button:string="Ajouter"
  public ratioForm = new FormGroup({
    type: new FormControl("1re", Validators.required),
    a: new FormControl("", Validators.required),
    b: new FormControl("", Validators.required)
  });

  onSave(form: any): void {
     if(!form.type)
      {
        form.type='Std';
      }
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
    this.index = this.params.get('index');
    if (this.index > 2) {
      this.readOnly = true;
    }

    this.ratioForm = this.fb.group({
      type: [{
        value: "Std",
        disabled: this.readOnly
      }, Validators.required],
      a: ["", Validators.required],
      b: ["", Validators.required]
    });


    if (this.ratio) {
      this.button = "Modifier";
      this.ratioForm.setValue(this.ratio, {
        onlySelf: true
      });
    }
    if (this.index == 1) {
      this.ratioForm.patchValue({
        type: "1re"
      });
    } else if (this.index == 2) {
      this.ratioForm.patchValue({
        type: "2e"
      });
    } else {
      this.ratioForm.patchValue({
        type: "Std"
      });
    }
  }
}
