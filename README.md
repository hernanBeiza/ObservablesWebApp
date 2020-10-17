# ObservablesWebApp
 Ejemplos de observables en Angular



## Obtener todos de una sola vez: Forkjoin

- Permite recibir en el componente la respuesta de todos los observables de una sola vez

#### Service

```typescript
public obtenerTodosDeUna(): Observable<Tipo[]> {    
    let observables:Array<Observable<Tipo>> = new Array<Observable<Tipo>>();

    for (var i = 1;i<19;i++) {
      let peticionTipos = this.obtenerConID(i);
      observables.push(peticionTipos);
    }
    //return null;
    return forkJoin(observables);
}
```



## Obtener uno a uno

- Retorna uno a uno, como una respuesta diferente al componete

#### Service

```typescript
public obtenerUnoAUnoSimplificado(): Observable<any> {
    console.log("obtener();");
    return this.obtener().pipe(
      tap(data=>console.log(data)),
      //Opción 3: Manejar cada respuesta como una respuesta diferente
      //Retorna al componente cada de unas de las respuestas del servicio, como un subscribe diferente, en el orden inicial
      mergeMap(tipos => tipos.map((tipo => this.obtenerConID(tipo.id)))),concatAll())
      //tap(data2=>console.log(data2)))
}
```

