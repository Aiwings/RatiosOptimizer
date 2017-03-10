import {
  Injectable
} from '@angular/core';


import {
  SQLite
} from 'ionic-native';

import {
  Car
} from '../app/car';
import {
  Gearbox
} from '../app/gearbox';


/*
  Generated class for the DBProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()

export class DBProvider {

  private db: SQLite;
  public isOpen: boolean;
  constructor() {
    console.log('#### Calling DBProvider Provider ####');

    if (!this.isOpen) {
      this.db = new SQLite();
      this.initDB();
    }
  }


  private carTable: string = '(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'date_config TEXT,' +
    'brand TEXT,' +
    'type TEXT,' +
    'fia_category TEXT,' +
    'weight INTEGER,' +
    'nb_speed INTEGER,' +
    'bevelgear TEXT,' +
    'max_engine_speed INTEGER' +
    ')';


  private gearTable: string = '(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'brand TEXT,' +
    'type TEXT,' +
    'serial TEXT' +
    ')';


  public initDB() {
    try {
      this.db.openDatabase({
        name: 'data.db',
        location: 'default'
      }).then(() => {
    
          /// CREATING TABLE CAR ///
          this.createTable("car", this.carTable).then((data) => {
            console.log("Table created" + JSON.stringify(data));
          }).catch((error) => {
            this.onCreateError(error);
          });
          /// CREATING TABLE GEARBOX ///
          this.createTable("gearbox", this.gearTable).then((data) => {
            console.log("Table created" + JSON.stringify(data));
          }).catch((error) => {
            this.onCreateError(error);
          });
          this.isOpen = true;
      }).catch((error) => {
        console.error("Unable to open database" + error.message, error);
      })
    } catch (error) {
      console.error(error.message, error)
    }
  }
  private createTable(name: string, struct: string): Promise < any > {
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
  private dropTables() {
    return new Promise((resolve, reject) => {
      this.db.executeSql('DROP TABLE IF EXISTS cars', []).then((data) => {
        this.db.executeSql('DROP TABLE IF EXISTS gearbox', []).then((data) => {
          resolve(data);
        }).catch((error) => {
          alert(error.message);
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });

    });
  }
  private onCreateError(error): void {
    console.error("Unable to create table " + error.message, error);
  }


  public addCar(car: Car): Promise < any > {
    return new Promise((resolve, reject) => {

      try {
        this.db.executeSql(
          "INSERT INTO car(date_config,brand,type,fia_category,weight,nb_speed, bevelgear,max_engine_speed) VALUES (?,?,?,?,?,?,?,?);", [
            car.date_config.toString(),
            car.brand,
            car.type,
            car.fia_category,
            car.weight,
            car.nb_speed,
            JSON.stringify(car.bevelgear),
            car.max_engine_speed
          ]
        ).then((data) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        })
      } catch (error) {
        reject(error);
      }
    });

  }

  public saveCar(car: Car): Promise < any > {
    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql(
          "UPDATE car SET brand=?,type=?,fia_category=?,weight=?,nb_speed=?, bevelgear=?,max_engine_speed=?" +
          "WHERE id = ?;", [
            car.brand,
            car.type,
            car.fia_category,
            car.weight,
            car.nb_speed,
            JSON.stringify(car.bevelgear),
            car.max_engine_speed,
            car.id
          ]
        ).then((data) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getCars(): Promise < any > {
    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql(
          "SELECT * FROM car;", []
        ).then((data) => {
          let cars = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              cars.push( < Car > data.rows.item(i));
            }
          }
          resolve(cars);
        }).catch((error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  selectCarById(id: number): Promise < any > {
    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql("SELECT * FROM car WHERE id = ?;", [id]).then((data) => {
          if (data.rows.length > 0) {
            resolve(data.rows.item(0));
          } else {
            reject(new Error("No Elements found"));
          }
        }).catch((error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }




  selectGearById(id: number): Promise < any > {
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM gearbox WHERE id = ?;", [id]).then((data) => {
        if (data.rows.length > 0) {
          resolve(data.rows.item(0));
        } else {
          reject(new Error("404"));
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }

  selectGears(): Promise < any > {
    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql("SELECT * FROM gearbox ORDER BY id;", []).then((data) => {
          let gbs = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              gbs.push( < Gearbox > data.rows.item(i));
            }
            resolve(gbs);
          } else {
            reject(new Error("404"));
          }

        }).catch((error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  saveGear(gear: Gearbox): Promise < any > {
    return new Promise((resolve, reject) => {

      this.selectGearById(gear.id).then((data) => {
        this.updateGear(gear).then((data) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        if (error.message == "404") {
          this.addGear(gear).then((data) => {
            resolve(data);
          }).catch((error) => {
            reject(error);
          });
        } else {
          reject(error);
        }
      });
    });
  }



  updateGear(gear: Gearbox): Promise < any > {

    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql("UPDATE gearbox " +
          "SET brand = ? ,type = ?, serial= ? " +
          "WHERE id = ? ;", [gear.brand, gear.type, gear.serial, gear.id]
        ).then((data) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });

  }

  addGear(gear: Gearbox): Promise < any > {

    return new Promise((resolve, reject) => {
      this.db.executeSql("INSERT INTO gearbox(brand,type,serial) " +
        "VALUES(?,?,?);", [gear.brand, gear.type, gear.serial]
      ).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });

  }



}
