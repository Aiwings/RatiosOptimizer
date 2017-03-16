import {
  Component,
  OnInit
} from '@angular/core';
import {
  NavParams,
  ViewController,
} from 'ionic-angular';
import {
  DBProvider
} from '../../providers/db-provider';
import {
  Car
} from '../../app/car';

@Component({
  selector: 'popover-page',
  templateUrl: 'popover-page.html'
})
export class PopoverPageComponent implements OnInit {
  titre: string;
  selectitems: any;
  save: any;
  select: any;
  circuit: any;
  tire: any;

  constructor(private params: NavParams,
    private viewCtrl: ViewController,
    private db: DBProvider) {
    console.log('Hello PopoverPage Component');
  }
  ngOnInit() {
    this.titre = this.params.get('titre');
    if (this.titre == "Abaque") {
      this.circuit = this.params.get('circuit');
      this.tire = this.params.get('tire');
    } else {
      this.select = this.params.get('select');
      this.save = this.params.get('save');

      if (this.titre == "Voitures") {
        this.db.getCars().then(data => {
          let cars: Car[] = [];
          for (let i = 0; i < data.length; i++) {
            let car: Car = {
              id: data[i].id,
              date_config: data[i].date_config,
              brand: data[i].brand,
              type: data[i].type,
              fia_category: data[i].fia_category,
              weight: data[i].weight,
              nb_speed: data[i].nb_speed,
              bevelgear: JSON.parse(data[i].bevelgear),
              max_engine_speed: data[i].max_engine_speed
            };
            cars.push(car);
          }
          this.selectitems = cars;
        }).catch(error => {
          console.error(error.message, error);
        });
      } else {
        this.db.selectGears().then(gbs => {
          this.selectitems = gbs;

        }).catch(error => {
          console.error(error.message, error);
        });

      }
    }
  }
  close() {
    this.viewCtrl.dismiss();
  }

}
