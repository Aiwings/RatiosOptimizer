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

import{CircuitPage} from  '../circuit/circuit';
@Component({
  selector: 'page-abacus',
  templateUrl: 'abacus.html'
})
export class AbacusPage implements OnDestroy{

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public popCtrl : PopoverController,
    public modalCtrl : ModalController,
    public calculProv : CalculProvider) {
      this.calculSub = this.calculProv.getCalcul().subscribe(calcul=>{
        this.calcul = calcul;
      });
  }
  @ViewChild('lineCanvas') lineCanvas;

  lineChart: any;
  tire_diam : number =0;

  calculSub: Subscription;
  calcul: {
    max_speed: number[],
    power_drop: number[],
    ratio_diff: any[],
    gap:number[]
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
    this.navCtrl.setRoot(CircuitPage);
  }

  drawGraph(): void {
       this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        datasets: [{
          label: 'Différence de rapports',
          fill: false,
          data: this.calcul.ratio_diff,
          borderColor: 'rgba(178, 83, 102,1)',
          borderWidth: 1,
          lineTension: 0
        }, ]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom',
            gridLines: {
              color: 'rgba(100,100,100,1)'
            },
            scaleLabel: {
              display: true,
              labelString: 'V (km/h)'
            }
          }],
          yAxes: [{
            gridLines: {
              color: 'rgba(100,100,100,1)'
            },
            ticks: {
              min: 4000,
              stepSize: 500
            },
            scaleLabel: {
              display: true,
              labelString: 'Δ(tr/min)'
            }
          }]
        },
        legend: {
          display: true,
          labels: {
            fontColor: 'rgb(152, 151, 151)',
            usePointStyle: true,
          }
        }
      }

    });
  }

   ionViewDidEnter() {
    if (this.tire_diam==0) {
      this.tire();
    }
    else{
      this.drawGraph();
    }
  }
    ngOnDestroy(){
      this.calculSub.unsubscribe();

    }

}
