import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';

import { Car } from '../app/car';
import { Gearbox } from '../app/gearbox';


/*
  Generated class for the DBProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()

export class DBProvider {

  private db: SQLite;
  public isOpen: boolean;
  constructor(public http: Http) {
    console.log('#### Calling DBProvider Provider ####');

    if (!this.isOpen) {
      this.db = new SQLite();
      this.initDB();

    }

  }


  private carTable: string = '('
  + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
  + 'date_config TEXT,'
  + 'brand TEXT,'
  + 'type TEXT,'
  + 'fia_category TEXT,'
  + 'weight INTEGER,'
  + 'nb_speed INTEGER,'
  + 'bevel_gear1 INTEGER,'
  + 'bevel_gear2 INTEGER,'
  + 'max_engine_speed INTEGER'
  + ')';


  private gearTable: string = '('
  + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
  + 'carid INTEGER,'
  + 'brand TEXT,'
  + 'type TEXT,'
  + 'serial TEXT,'
  + ')';


  private initDB() {
    this.db.openDatabase({
      name: 'data.db',
      location: 'default'
    }).then(() => {

      /// CREATING TABLE CARS ///
      this.createTable("cars", this.carTable).then((data) => {
        console.log("Table created" + data)
      }).catch((error) => {
        this.onCreateError(error);
      });
      /// CREATING TABLE GEARBOX ///
      this.createTable("gearbox", this.gearTable).then((data) => {
        console.log("Table created" + data)
      }).catch((error) => {
        this.onCreateError(error);
      });

      this.isOpen = true;



    }).catch((error) => {
      console.error("Unable to open database" + error.message, error);
    })
  }


  private createTable(name: string, struct: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.executeSql('create table if not exists ' + name + ' ' + struct, {})
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        })
    });
  }

  private onCreateError(error): void {
    console.error("Unable to create table " + error.message, error);
  }


  public addCar(car: Car): Promise<any> {
    return new Promise((resolve, reject) => {

      this.db.executeSql(
        "INSERT INTO cars(date_config,brand,type,fia_category,weight,nb_speed, bevel_gear1, bevel_gear2, max_engine_speed) VALUES (?,?,?,?,?,?,?,?,?);",
        [
          car.date_config.toString(),
          car.brand,
          car.type,
          car.fia_category,
          car.weight,
          car.nb_speed,
          car.bevel_gear1,
          car.bevel_gear2,
          car.max_engine_speed
        ]
      ).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      })

    });
  }

  public saveCar(car: Car): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.executeSql(
        "UPDATE cars SET brand=?,type=?,fia_category=?,weight=?,nb_speed=?, bevel_gear1=?,bevel_gear2=?,max_engine_speed=?"
        + "WHERE id = ?;"
        ,
        [
          car.brand,
          car.type,
          car.fia_category,
          car.weight,
          car.nb_speed,
          car.bevel_gear1,
          car.bevel_gear2,
          car.max_engine_speed,
          car.id
        ]
      ).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      })
    });
  }

  getCars(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.executeSql(
        "SELECT * FROM cars;",
        []
      ).then((data) => {
        let cars = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            cars.push(<Car>data.rows.item(i));
          }
        }
        resolve(cars);
      }).catch((error) => {
        reject(error);
      })
    });
  }



  selectGearById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM gearbox WHERE id = ?;", [id]).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  selectGearsByCarid(carid: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM gearbox WHERE carid = ? ORDER BY id;", [carid]).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  saveGear(gear: Gearbox): Promise<any> {
    return new Promise((resolve, reject) => {
      this.selectGearById(gear.id).then((data) => {
        console.log(JSON.stringify(data));

        if (data.rows.length != 0) {
          this.updateGear(gear).then((data) => {
            resolve(data);
          }).catch((error) => {
            reject(error);
          });
        } else {
          this.addGear(gear).then((data) => {
            resolve(data);
          }).catch((error) => {
            reject(error);
          });
        }

      }).catch((error) => {
        reject(error);
      });
    });
  }



  updateGear(gear: Gearbox): Promise<any> {

    return new Promise((resolve, reject) => {
      this.db.executeSql("UPDATE gearbox " +
        "SET brand = ? ,type = ?, serial= ? " +
        "WHERE id = ? ;",
        [gear.brand, gear.type, gear.serial, gear.id]
      ).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  addGear(gear: Gearbox): Promise<any> {

    return new Promise((resolve, reject) => {
      this.db.executeSql("INSERT INTO gearbox(carid,brand,type,serial) "
        + "VALUES(?,?,?,?,?);",
        [gear.carid, gear.brand, gear.type, gear.serial]
      ).then((data) => {
        this.selectGearsByCarid(gear.carid).then((data) => {
          resolve({
            id: data.rows.length - 1
          });
        }).catch((error) => { reject(error); });
      }).catch((error) => {
        reject(error);
      });
    });

  }



}