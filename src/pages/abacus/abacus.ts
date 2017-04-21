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
  tire_diam : number;

  calculSub: Subscription;
  calcul: {
    max_speed: number[],
    power_drop: number[],
    ratio_diff: any[],
    gap:number[]
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
              color: 'rgba(255,255,255,0.5)'
            },
            scaleLabel: {
              display: true,
              labelString: 'V (km/h)',
              fontColor: 'rgba(255,255,255,0.7)'
            },
            ticks: {
              fontColor: 'rgba(255,255,255,0.5)'
            }
          }],
          yAxes: [{
            gridLines: {
              color: 'rgba(255,255,255,0.5)'
            },
            ticks: {
              min: 4000,
              stepSize: 500,
              fontColor: 'rgba(255,255,255,0.5)'
            },
            scaleLabel: {
              display: true,
              labelString: 'Δ(tr/min)',
              fontColor: 'rgba(255,255,255,0.7)'
            }
          }]
        },
        legend: {
          display: true,
          labels: {
            fontColor: 'rgba(255,255,255,0.7)',
            usePointStyle: true,
          }
        }
      }

    });
  }

   ionViewDidEnter() {
      this.drawGraph();
  }
    ngOnDestroy(){
      this.calculSub.unsubscribe();
    }

}
