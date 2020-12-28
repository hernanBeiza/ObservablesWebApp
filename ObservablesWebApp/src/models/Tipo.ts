import { Pokemon } from './Pokemon';

export class Tipo {

	public id:number;
	public name:string;
	public url:string;

	public pokemon:Array<any>;
	public pokemones:Array<Pokemon>;

	constructor(init? : Partial<Tipo>) {
		Object.assign(this, init);
	}

}