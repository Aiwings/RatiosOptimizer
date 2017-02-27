import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {SQLite} from 'ionic-native';

/*
  Generated class for the DBProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DBProvider {

  constructor(public http: Http, public db : SQLite
    ) {
    console.log('Hello DBProvider Provider');
  }


      private carTable : string = '('
          +'id INTEGER PRIMARY KEY AUTOINCREMENT,'
          +'date TEXT,'
          +'brand TEXT,'
          +'type TEXT,'
          +'fia_category TEXT,'
          +'weight INTEGER,'
          +'nb_speed INTEGER,'
          +'bevel_gear1 INTEGER,'
          +'bevel_gear2 INTEGER,'
          +'max_engine_speed INTEGER'
          +')';


      private gearTable : string = '('
          +'id INTEGER PRIMARY KEY AUTOINCREMENT,'
          +'carid INTEGER,'
          +'brand TEXT,'
          +'type TEXT,'
          +'serial TEXT'
          +')';

      private ratiosTable : string ='('
        +'id INTEGER PRIMARY KEY AUTOINCREMENT,'
        +'gearid INTEGER,'
        +'speedtype TEXT,'
        +'a INTEGER,'
        +'b INTEGER'
        +')';

    initDB(){
      this.db.openDatabase({
        name:'data.db',
        location:'default'
      }).then(()=>{

        /// CREATING TABLE CARS ///
        this.createTable("cars",this.carTable).then((data)=>
        {
          console.log("Table created"+ data)
        }).catch((error)=>{
          this.dBerror(error);
        });
        /// CREATING TABLE GEARBOX ///
        this.createTable("gearbox",this.gearTable).then((data)=>
        {
          console.log("Table created"+ data)
        }).catch((error)=>{
          this.dBerror(error);
        });

        /// CREATING TABLE RATIOS ///
        this.createTable("ratios",this.ratiosTable).then((data)=>
        {
          console.log("Table created"+ data)
        }).catch((error)=>{
          this.dBerror(error);
        });



      }).catch((error)=>{
        console.error("Unable to open database",error);
      })
    }


    createTable(name:string , struct: string ) : Promise <any> {
      return new Promise((resolve,reject)=>{ 
        this.db.executeSql('create table if not exists '+ name+' '+ struct+' )',{})
          .then((data) => {
            resolve(data);
          })
          .catch((error)=>{
            reject(error);
          })
      });
    }
    dBerror(error) : void {
       console.error("Unable to create table" , error ); 
    }


}