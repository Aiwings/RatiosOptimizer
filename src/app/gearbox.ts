
import {DBProvider} from '../providers/db-provider';
export class Gearbox {
  id: number;
  brand: string;
  type: string;
  serial: number;

  constructor(public db : DBProvider,
       brand, type, serial, id ? ) {
    this.brand = brand;
    this.type = type;
    this.serial = serial;
    this.id = (id) ? id : 0;
  }

  update(brand, type, serial) {
    this.brand = brand;
    this.type = type;
    this.serial = serial;
  }
  get() {
    return {
      brand: this.brand,
      type: this.type,
      serial: this.serial,
      id: this.id
    }
  }
  save(): Promise < any > {
    return new Promise((resolve, reject) => {

      this.db.saveGear(this.get()).then((data) => {
        this.id = data.insertId;
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }
}
