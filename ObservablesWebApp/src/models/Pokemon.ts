import { Tipo } from './Tipo';

export class Pokemon {

	public id:number;
	public name:string;
	public height:number;

	public tipo:Tipo;

	constructor(init? : Partial<Pokemon>) {
		Object.assign(this, init);
	}

}
