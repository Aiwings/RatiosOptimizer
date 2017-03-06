import {
  Component,
  ViewChild
} from '@angular/core';
import {
  NavController,
  AlertController
} from 'ionic-angular';
import {
  Chart
} from 'chart.js'
import {
  CalculProvider
} from '../../providers/calcul-provider';

@Component({
  selector: 'page-abacus',
  templateUrl: 'abacus.html'
})
export class AbacusPage {

  constructor(public navCtrl: NavController,
    public calcul: CalculProvider,
    public alertCtrl: AlertController) {

  }
  @ViewChild('lineCanvas') lineCanvas;

  lineChart: any;



  tire(): Promise < number > {

    return new Promise((resolve, reject) => {
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
              resolve(data.tire);
            }
          }
        ]
      })
      prompt.present();
    });

  }
  drawGraph(): void {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        datasets: [{
          label: 'Calcul des rapports',
          data: this.calcul.getRatioDiff(),
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

    if (!this.calcul.getDiam()) {
      this.tire().then((diam) => {
        this.calcul.setDiam(diam);
        this.calcul.calculate().then(() => {
          console.log(this.calcul.toRpm(this.calcul.getMaxSpeed()));
          this.drawGraph();
        });
      });
    } else {
      this.calcul.calculate().then(() => {
        console.log(this.calcul.toRpm(this.calcul.getMaxSpeed()));
        this.drawGraph();
      });
    }

  }

}
