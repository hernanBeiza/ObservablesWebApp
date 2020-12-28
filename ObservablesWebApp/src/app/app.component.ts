import { Component, OnInit, OnDestroy } from '@angular/core';

import { PokemonService, TipoService } from './../services';
import { Pokemon, Tipo } from './../models';

import {Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public pokemones:Array<Pokemon>;
  public tipos:Array<Tipo>;
  public todosDeUna:Array<Tipo>;

  public flagCargando:boolean = false;
  public flagCargandoTodosDeUna:boolean = false;

  private obtenerSubscription:Subscription;
  private obtenerTodosSubscription:Subscription;
  private obtenerDetalleSubscription:Subscription;
  
  constructor(private tipoService:TipoService, private pokemonService:PokemonService,){ }

  ngOnInit(){
    this.cargarUnoAUno();
    this.cargarTodosDeUna();
  }

  private cargarUnoAUno():void {
    this.flagCargando = true;
    this.tipos = new Array<Tipo>();
    this.obtenerSubscription = this.tipoService.obtenerUnoAUnoSimplificado().subscribe(data=>{
      this.flagCargando = false;
      console.log("Cargando uno a uno");
      //console.info(data);
      this.tipos.push(data);
      this.obtenerDetalle(data.id);
    },error=>{
      console.error(error);
    });
  }

  private cargarTodosDeUna():void {
    //Ejemplo de forkJoin. Usar dos observables, esperando la respuesta de ambos de una sola vez
    this.flagCargandoTodosDeUna = true;
    this.obtenerTodosSubscription = this.tipoService.obtenerTodosDeUnaSimplificado().subscribe(data=>{
      this.flagCargandoTodosDeUna = false;
      console.log("Cargados todos de una");
      //console.info(data);
      this.todosDeUna = data;
    },error=>{
      console.error(error);
    });
  }

  private obtenerDetalle(id:number):void {
    this.obtenerDetalleSubscription = this.tipoService.obtenerConID(id).subscribe(data=>{
      if(data){
        console.log(data.id);
        console.log(data.name,data.pokemon);
      }
    },error=>{
      console.error(error);
    })
  }

  ngOnDestroy(){

  }

}