import { Ratio} from './ratio';
export class Circuit{
    id :number;
    car_id :number;
    gearbox_id:number;
    name: string;
    tire_diam:number;
    event :string;
    v_max : number;
    ratios :Ratio;
    weather: string;
    comments:string;
} 