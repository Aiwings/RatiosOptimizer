export class Gearbox {
	id: number;
    carid:number;
    car: string;
    brand: string;
    type:string;
    serial:number;
    ratio : {
        speedtype:string,
        a:number,
        b:number
    }[];
}
