import { Injectable } from '@angular/core';

import {environment} from "./../environments/environment";
import {HttpClient, HttpHeaderResponse, HttpHeaders, HttpErrorResponse} from "@angular/common/http";

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {Observable, of, from , forkJoin} from "rxjs";
import {tap, map, flatMap} from 'rxjs/operators';
import {mergeMap, mergeAll, concat, concatAll, concatMap} from 'rxjs/operators';
import {delay, switchAll, switchMap, combineLatest} from 'rxjs/operators';

import { PokemonService } from './pokemon.service';

import { Pokemon, Tipo } from './../models';



@Injectable({
  providedIn: 'root'
})
export class TipoService {

  private url = environment.API+"type/";
  private httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private httpClient: HttpClient, private pokemonService:PokemonService) { }

  public prueba():void {
    const getData = (param) => {
      return of(`retrieved new data with param ${param}`).pipe(delay(1000))
    }

    from([1,2,3,4]).pipe(
      map(param => getData(param))
    ).subscribe(val => val.subscribe(data => console.log(data)));

  }

  public obtener():Observable<Array<Tipo>> {
    return this.httpClient.get<Tipo>(this.url,this.httpOptions).pipe(
      tap(data => console.log(data)),
      map((data:any)=>{
      console.log("obtener(); ok");
      let tipos:Array<Tipo> = new Array<Tipo>();
      for(let item of data.results){
        let tipo = new Tipo(item);
        let urls = tipo.url.split("/");
        let id:number = Number(urls[urls.length-2]);
        tipo.id = id;
        tipos.push(tipo);
      }
      return tipos;
    }));
  }

  public obtenerUnoAUno(): Observable<any> {
  	console.log("obtener();");
		return this.httpClient.get<Tipo>(this.url,this.httpOptions).pipe(
			tap(data => console.log(data)),
			map((data:any)=>{
			console.log("obtener(); ok");
			let tipos:Array<Tipo> = new Array<Tipo>();
			for(let item of data.results){
				let tipo = new Tipo(item);
				let urls = tipo.url.split("/");
				let id:number = Number(urls[urls.length-2]);
        tipo.id = id;
				tipos.push(tipo);
			}
			return tipos;
      //from(tipos).pipe(map(param => this.obtenerConID(param.id))).subscribe(val => val.subscribe(data => console.log(data)));
      //return from(tipos).pipe(map(param => this.obtenerConID(param.id))).subscribe(data=>data.subscribe(tipo=>console.log(tipo.name)));
      //return from(tipos).pipe(map(param => this.obtenerConID(param.id)));
      //return from(tipos).pipe(map((param => this.obtenerConID(param.id))));
      //switchMap cancela los requests previos, solo deja el último, ideal para filtros keypress
      //return from(tipos).pipe(switchMap(param => this.obtenerConID(param.id))).subscribe(tipo=>console.log(tipo));
      //return from(tipos).pipe(mergeMap(param => this.obtenerConID(param.id))).subscribe(tipo=>console.log(tipo));
      //from(tipos).pipe(concatMap(param => this.obtenerConID(param.id))).subscribe(tipo=>console.log(tipo));
			/*
		}),mergeMap(tipo2 => this.httpClient.get(this.url+tipo2.name,this.httpOptions))).subscribe(data=>{
			console.log("segunda petición");
			console.log(data);
			return data;
			*/
		}),
			//tap(data2=>console.log(data2)),
			//mergeMap(tipos => tipos.map(tipo => this.obtenerConID(tipo.id))),
			//tap(data2=>console.log(data2)))
			//,
      //Opción 1: forkJoin. Manejar todas las respuestas como una única respuesta
      //Si falla uno, fallan todos... La clave está en el manejo del error dentro del observable interno
      //mergeMap(tipos => forkJoin([this.obtenerConID(1)])))      
      //mergeMap(tipos => forkJoin(tipos.map(tipo => this.obtenerConID(tipo.id)))))
      //Opción 2: Manejar cada respuesta como una respuesta diferente
      //Retorna al componente cada de unas de las respuestas del servicio, como un subscribe diferente, en el orden según la respuesta
      //concatMap(tipos => tipos.map(tipo => this.obtenerConID(tipo.id))),mergeAll())
      //Opción 3: Manejar cada respuesta como una respuesta diferente
      //Retorna al componente cada de unas de las respuestas del servicio, como un subscribe diferente, en el orden inicial
      mergeMap(tipos => tipos.map((tipo => this.obtenerConID(tipo.id)))),concatAll())
      //tap(data2=>console.log(data2)))
  }  

  public obtenerUnoAUnoSimplificado(): Observable<any> {
    console.log("obtener();");
    return this.obtener().pipe(
      tap(data=>console.log(data)),
      //Opción 3: Manejar cada respuesta como una respuesta diferente
      //Retorna al componente cada de unas de las respuestas del servicio, como un subscribe diferente, en el orden inicial
      mergeMap(tipos => tipos.map((tipo => this.obtenerConID(tipo.id)))),concatAll())
      //tap(data2=>console.log(data2)))
  }


  /*
  public obtenerTodosDeUna(): Observable<Tipo[]> {    
    let observables:Array<Observable<Tipo>> = new Array<Observable<Tipo>>();

    for (var i = 1;i<19;i++) {
      let peticionTipos = this.obtenerConID(i);
      observables.push(peticionTipos);
    }
    //return null;
    return forkJoin(observables);
  }
  */

  public obtenerTodosDeUna():Observable<any> {
    return this.httpClient.get<Tipo>(this.url,this.httpOptions).pipe(
      tap(data => console.log(data)),
      map((data:any)=>{
      let tipos:Array<Tipo> = new Array<Tipo>();
      for(let item of data.results){
        let tipo = new Tipo(item);
        let urls = tipo.url.split("/");
        let id:number = Number(urls[urls.length-2]);
        tipo.id = id;
        tipos.push(tipo);          
      }
      return tipos;
      }),
      //Opción 1: forkJoin. Manejar todas las respuestas como una única respuesta
      //Si falla uno, fallan todos... La clave está en el manejo del error dentro del observable interno
      mergeMap(tipos => forkJoin(tipos.map((tipo => this.obtenerConID(tipo.id))))))
      //tap(data2=>console.log(data2)))
  }

  public obtenerTodosDeUnaSimplificado():Observable<any> {
    return this.obtener().pipe(
      tap(data => console.log(data)),
      //Opción 1: forkJoin. Manejar todas las respuestas como una única respuesta
      //Si falla uno, fallan todos... La clave está en el manejo del error dentro del observable interno
      mergeMap(tipos => forkJoin(tipos.map((tipo => this.obtenerConID(tipo.id))))))
  }

  public obtenerConID(id:number): Observable<Tipo> {
    console.log("obtenerConID();",id);
    return this.httpClient.get<Tipo>(this.url+id,this.httpOptions).pipe(
      //tap(data => console.log(data)),
      map(data=>{
      console.log("obtenerConID(); ok",id);
      let tipo = new Tipo(data);
      let pokemones:Array<Pokemon> = new Array<Pokemon>();
      for(let item of data.pokemon){
        let pokemon = new Pokemon(item);
        //let urls = pokemon.url.split("/");
        //let id:number = Number(urls[urls.length-2]);
        //pokemon.id = id;
        pokemones.push(pokemon);
      }
      tipo.pokemones = pokemones;
      return tipo;
    })).pipe(catchError(error=>{
      console.error(error);
      //Manejar el error dentro de este Observable para que llegue la llamada completa al componente
      //TODO: Averiguar si es buena práctica o no
      return of(error);
      //return throwError(error);
    }));
  }

  public obtenerConNombre(nombre:string): Observable<Tipo> {
    console.log("obtenerConNombre();",nombre);
    return this.httpClient.get<Tipo>(this.url+nombre,this.httpOptions).pipe(map(item=>new Tipo(item)));
  }

  //Ejemplo de obtener varios Observable y retornar todo de una
  public obtenerDemo(): Observable<[Tipo[],Tipo]> {
    /*
    return this.httpClient.get<Array<Tipo>>(environment.API+"type",this.httpOptions).pipe(map(items=> 
      items.map(item => new Tipo(item))));
    */    
    let peticionTipos = this.obtenerTipos();
    let peticionTipos2 = this.obtenerConID(1);
    return forkJoin([peticionTipos,peticionTipos2]);
  }

  private obtenerTipos():Observable<Array<Tipo>>{
  	console.log("obtenerTipos();");
    return this.httpClient.get<Array<Tipo>>(this.url,this.httpOptions).pipe(map((item:any)=>{
    	console.log("obtenerTipos ok");
    	let tipos:Array<Tipo>= new Array<Tipo>();
    	for (var i = 0;i<item.results.length; i++) {
				let tipo = item.results[i];
				let urls = tipo.url.split("/");
				let id:number = Number(urls[urls.length-2]);
				let tipoModel = new Tipo(tipo);
				tipoModel.id = id;
				tipos.push(tipoModel);
				/*
				this.pokemonService.obtenerConNombreDeTipo(tipoModel.name).subscribe(data=>{
					tipoModel.pokemones = data;
				},error=>{
					console.error(error);
				});
				console.log(tipoModel);
				*/
  		}
  		return tipos;
  		//return null;
    }));
  }
 
}