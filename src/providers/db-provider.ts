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
import {
  Circuit
} from '../app/circuit';
import {
  Ratio
} from '../app/ratio';
@Injectable()

export class DBProvider {

  private db: SQLite;
  public isOpen: boolean;
  constructor() {
    console.log('#### Calling DBProvider Provider ####');
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

  private circuitTable: string = '(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'car_id INTEGER,' +
    'gearbox_id INTEGER,' +
    'name TEXT,' +
    'tire_diam INTEGER,' +
    'event TEXT,' +
    'v_max INTEGER,' +
    'ratios TEXT,' +
    'weather TEXT,' +
    'comments TEXT' +
    ')';


  public initDB(): Promise < any > {

    return new Promise((resolve, reject) => {
      this.db = new SQLite();

      this.db.openDatabase({
        name: 'data.db',
        location: 'default'
      }).then(() => {

        /// CREATING TABLE CAR ///
        this.createTable("car", this.carTable).then((data) => {
          console.log("Table created car " + JSON.stringify(data));
        }).catch((error) => {
          this.onCreateError(error);
        });
        /// CREATING TABLE GEARBOX ///
        this.createTable("gear_box", this.gearTable).then((data) => {
          console.log("Table created gb " + JSON.stringify(data));
        }).catch((error) => {
          this.onCreateError(error);
        });
        this.createTable("circuit", this.circuitTable).then((data) => {
          console.log("Table created circ " + JSON.stringify(data));
        }).catch((error) => {
          this.onCreateError(error);
        });
        resolve(true);
      }).catch((error) => {
        console.error("Unable to open database" + error.message, error);
        reject((error));
      })
    });
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
  // private dropTables() {
  //   return new Promise((resolve, reject) => {
  //     this.db.executeSql('DROP TABLE IF EXISTS cars', []).then((data) => {
  //       this.db.executeSql('DROP TABLE IF EXISTS gear_box', []).then((data) => {
  //         resolve(data);
  //       }).catch((error) => {
  //         alert(error.message);
  //         reject(error);
  //       });
  //     }).catch((error) => {
  //       reject(error);
  //     });
  //   });
  // }
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

  public getCars(): Promise < any > {
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
            resolve(cars);
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
  public selectCarById(id: number): Promise < any > {
    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql("SELECT * FROM car WHERE id = ?;", [id]).then((data) => {
          if (data.rows.length > 0) {
            resolve(data.rows.item(0));
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

  public selectGearById(id: number): Promise < any > {
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM gear_box WHERE id = ?;", [id]).then((data) => {
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

  public selectGears(): Promise < any > {
    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql("SELECT * FROM gear_box ORDER BY id;", []).then((data) => {
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

  public saveGear(gear: Gearbox): Promise < any > {
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

  private updateGear(gear: Gearbox): Promise < any > {

    return new Promise((resolve, reject) => {
      try {
        this.db.executeSql("UPDATE gear_box " +
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

  private addGear(gear: Gearbox): Promise < any > {

    return new Promise((resolve, reject) => {
      this.db.executeSql("INSERT INTO gear_box(brand,type,serial) " +
        "VALUES(?,?,?);", [gear.brand, gear.type, gear.serial]
      ).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });

  }
  public getCircuits(): Promise < Circuit[] > {
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * from circuit", []).then((data) => {
        if (data.rows.length > 0) {
          let circuits: Circuit[] = []
          for (let i = 0; i < data.rows.length; i++) {
            let el = data.rows.item(i);
            console.log(el)
            try {
              el.ratios = < Ratio > JSON.parse(el.ratios);
            } catch (error) {
              console.error(error.message, error);
            }
            circuits.push(el);
          }
          resolve(circuits);
        } else {
          reject(new Error("404"));
        }
      }).catch((error) => {
        reject(error);
      });
    });

  }
  public addCircuit(circuit: Circuit): Promise < any > {
    return new Promise((resolve, reject) => {
      this.db.executeSql("INSERT INTO circuit" +
        "(name,car_id,gearbox_id,tire_diam,ratios,v_max,event,weather,comments) " +
        "VALUES(?,?,?,?,?,?,?,?,?);", [circuit.name,
          circuit.car_id,
          circuit.gearbox_id,
          circuit.tire_diam,
          JSON.stringify(circuit.ratios),
          circuit.v_max,
          circuit.event,
          circuit.weather,
          circuit.comments
        ]).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  public saveCircuit(circuit: Circuit): Promise < any > {
    return new Promise((resolve, reject) => {
      this.db.executeSql('UPDATE circuit ' +
        'SET name = ? , car_id = ?, gearbox_id = ?, tire_diam = ?, ratios = ?, v_max = ?, event = ?, weather = ? ,comments = ? ', [circuit.name,
          circuit.car_id,
          circuit.gearbox_id,
          circuit.tire_diam,
          JSON.stringify(circuit.ratios),
          circuit.v_max,
          circuit.event,
          circuit.weather,
          circuit.comments
        ]).then((data)=>{
          resolve(data);
        }).catch(error=>{
          reject(error);
        })
    });
  }


}
