import { Component,ViewChild} from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import{Chart} from 'chart.js'
import { CalculProvider} from '../../providers/calcul-provider';

@Component({
  selector: 'page-abacus',
  templateUrl: 'abacus.html'
})
export class AbacusPage  {

  constructor(public navCtrl: NavController,
              public calcul :CalculProvider,
              public alertCtrl: AlertController ){

  }
  @ViewChild('barCanvas') barCanvas;

  barChart:any;



  tire() : void {
    let prompt = this.alertCtrl.create({
      title:"Diamètre du pneu",
      message : "Veuillez saisir le diamètre de votre pneu en mm",
      inputs: [{
        name:"tire",
        placeholder:"diametre",
        type:'number'
      }],
      buttons : [{
        text:'Annuler',
        handler: data =>{
          console.log("Cancel clicked");
        }
      },
      {
        text:'OK',
        handler: data =>{
          this.calcul.setDiam(data.tire);
        }
      }]
    })
    prompt.present();
  }


  ionViewDidLoad() {

      this.tire();      

        this.barChart = new Chart(this.barCanvas.nativeElement, {
 
            type: 'line',
            data: {
                labels: ["jan", "feb", "mar", "apr", "may", "jun","july"],
                datasets: [{
                    label: 'Line example',
                    data: [12, 19, 3, 5, 2, 3,7],
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
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
 
        });
  }
 
}
