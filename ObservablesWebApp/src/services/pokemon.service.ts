import { Injectable } from '@angular/core';

import {environment} from "./../environments/environment";
import {HttpClient, HttpHeaderResponse, HttpHeaders} from "@angular/common/http";

import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

import { Pokemon, Tipo } from './../models';


@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private url = environment.API+"pokemon/";
  private httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private httpClient: HttpClient) { }

	public obtenerConTipo(idTipo: number): Observable<Array<Pokemon>>{
  	console.log("obtenerConTipo",idTipo);
  	/*
		let requestTipo = this.obtenerTipos();
    let requestPokemonPorTipo = this.obtenerConId(1);
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([requestTipo, requestPokemonPorTipo]);
    */
		return this.httpClient.get<Array<Pokemon>>(environment.API+"type/"+idTipo,this.httpOptions).pipe(map((data:any)=>{
			let pokemones = new Array<Pokemon>();
			for(let item of data.pokemon){
				pokemones.push(new Pokemon(item.pokemon));
			}
			return pokemones;
		}));
  }

  private obtenerTipos(): Observable<Array<Tipo>>{   
		return this.httpClient.get<Array<Tipo>>(environment.API+"type",this.httpOptions).pipe(map(items=> 
			items.map(item => new Tipo(item))));
  }

  private obtenerTipo(idTipo:number): Observable<Tipo>{   
		return this.httpClient.get<Tipo>(environment.API+"type"+idTipo,this.httpOptions).pipe(map(item=>new Tipo(item)));
  }

  public obtenerConNombreDeTipo(tipo:string): Observable<Array<Pokemon>>{   
		//return this.httpClient.get<Pokemon>(environment.API+"type/"+tipo,this.httpOptions).pipe(map(item=>new Pokemon(item)));
		return this.httpClient.get<Array<Pokemon>>(environment.API+"type/"+tipo,this.httpOptions).pipe(map((data:any)=>{
			let pokemones = new Array<Pokemon>();
			for(let item of data.pokemon){
				pokemones.push(new Pokemon(item.pokemon));
			}
			return pokemones;
		}));
  }

  public obtenerConId(id:number): Observable<Pokemon> {
    return this.httpClient.get<Pokemon>(this.url+id,this.httpOptions).pipe(map(item=>new Pokemon(item)));
  }

  public obtenerConNombre(nombre:string): Observable<Pokemon> {
    return this.httpClient.get<Pokemon>(this.url+nombre,this.httpOptions).pipe(map(item=>new Pokemon(item)));
  }

}