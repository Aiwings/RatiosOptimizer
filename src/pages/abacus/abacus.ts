import {
  Component,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {
  NavController,
  AlertController,
  PopoverController,
  ModalController
} from 'ionic-angular';
import {
  Chart
} from 'chart.js'
import {
  CalculProvider
} from '../../providers/calcul-provider';
import {
  Subscription
} from 'rxjs/Subscription';
import {PopoverPageComponent} from '../../components/popover-page/popover-page';
import {CircuitModalComponent} from '../../components/circuit-modal/circuit-modal';
@Component({
  selector: 'page-abacus',
  templateUrl: 'abacus.html'
})
export class AbacusPage implements OnDestroy{

  constructor(public navCtrl: NavController,
    public calculProv: CalculProvider,
    public alertCtrl: AlertController,
    public popCtrl : PopoverController,
    public modalCtrl : ModalController) {

    this.calculSub = this.calculProv.getCalcul().subscribe(calcul => this.calcul = calcul);

  }
  @ViewChild('lineCanvas') lineCanvas;

  lineChart: any;

  calculSub: Subscription;
  calcul: {
    max_speed: number[],
    power_drop: number[],
    ratio_diff: any[]
  }

  tire(){

      let prompt = this.alertCtrl.create({
        title: "Diamètre du pneu",
        message: "Veuillez saisir le diamètre de votre pneu en mm",
        inputs: [{
          name: "tire",
          placeholder: "diametre",
          type: 'number'
        }],
        buttons: [{
            text: 'Annuler',
            handler: data => {
              console.log("Cancel clicked");
            }
          },
          {
            text: 'OK',
            handler: data => {
              this.calculProv.setDiam(data.tire);
              this.drawGraph();
            }
          }
        ]
      })
      prompt.present();
  }
    presentPopover(event) {
    let popover = this.popCtrl.create(PopoverPageComponent, {

      titre: 'Abaque',
      tire:()=>{
        this.tire();
      },
      circuit: () => {
        this.circuit();
      }
    });
    popover.present({
      ev: event
    });
  }
  circuit()
  {
      let modal = this.modalCtrl.create(CircuitModalComponent,{
        tire_diam : this.calculProv.getDiam()
    });
     modal.present();
  }

  drawGraph(): void {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        datasets: [{
          label: 'Calcul des rapports',
          data: this.calcul.ratio_diff,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          lineTension: 0
        }, ]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom'
          }]
        }
      }

    });
  }

   ionViewDidEnter() {
    if (!this.calculProv.getDiam()) {
      this.tire();
    }
      this.drawGraph();
  }
    ngOnDestroy(){
      this.calculSub.unsubscribe();
    }

}
