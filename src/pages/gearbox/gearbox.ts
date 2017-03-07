import { Component, OnInit } from '@angular/core';
import { NavController, ModalController,ToastController } from 'ionic-angular';
import { CarProvider } from '../../providers/car-provider';
import { GearProvider } from '../../providers/gear-provider';
import { RatioModalComponent } from '../../components/ratio-modal/ratio-modal';
import { Gearbox } from '../../app/gearbox';
@Component({
  selector: 'page-gearbox',
  templateUrl: 'gearbox.html'
})
export class GearboxPage implements OnInit {


  types = ["DG", "DGB", "FG400", "FGA", "FT1", "FT200", "LD", "LG400", "LG500", "MK5", "MK6", "MK8"];
  gearBoxes : Gearbox [] = [];
  selectedGear: Gearbox;
  constructor(
    public navCtrl: NavController,
    private carProv: CarProvider,
    public modalCtrl: ModalController,
    public gearProv: GearProvider,
    private toastCtrl: ToastController) {

  }

  public gb: Gearbox;

    toastsuccess = this.toastCtrl.create({
        message :'',
        position:'bottom',
        duration:3000
      });

      toasterror = this.toastCtrl.create({
        message :'',
        position:'bottom',
       showCloseButton:true,
       closeButtonText:'ok'
      });

  ngOnInit(): void {

      this.gb = {
        id: 0,
        carid: this.carProv.getSelectedCar().id,
        type: "",
        brand: "",
        serial:0,
      };
      this.gearBoxes.push(this.gb);
      this.gearProv.setGB(this.gb);
       this.gearProv.getGBs(this.carProv.getSelectedCar().id).then((gbs)=>{
           if(gbs)
           {
            this.gearBoxes = gbs;
            console.log("GBS " +JSON.stringify(gbs));
           }
         
      }).catch((error)=>{
        console.error(error.message,error);
          this.toasterror.setMessage("Impossible de récupérer les boites \n "+error.message);
          this.toasterror.present();
      });
  }
  onSelect():void {
    if(this.selectedGear)
    {
      this.gb = this.selectedGear;
    }
  }

  save(): void {
    this.gearProv.saveGB(this.gb).then((data)=>
    {
        this.gearProv.getGB(this.carProv.getSelectedCar().id).then((gb)=>{
          this.gb =gb;
          this.gearBoxes.push(this.gb);
        }).catch((error)=>{
           this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde \n "+error.message);
           this.toasterror.present();
        });
      this.toastsuccess.setMessage("Succès de la sauvegarde");
      this.toastsuccess.present();
      
    }).catch((error)=>{
           this.toasterror.setMessage("Il y a eu une erreur lors de la sauvegarde \n "+error.message);
           this.toasterror.present();
    })
  }

  ratios(): void {
    
    let modal = this.modalCtrl.create(RatioModalComponent,{});
    modal.present();
    modal.onDidDismiss((data)=>{
    });
  }
}
