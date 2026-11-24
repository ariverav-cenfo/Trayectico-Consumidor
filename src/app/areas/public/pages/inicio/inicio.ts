import type { HomeFeature } from '../../../../interfaces/home-feature';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopBar } from '../../../../shared/layout/top-bar/top-bar';
import { AvisoSesion } from '../../../../shared/ui/aviso-sesion/aviso-sesion';

@Component({
  imports: [TopBar, RouterLink, AvisoSesion],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  protected readonly features: HomeFeature[] = [
    {
      title: 'Planificar un viaje',
      description: 'Escriba su origen y destino y vea el recorrido paso a paso en el mapa.',
      icon: 'map',
    },
    {
      title: 'Consultar rutas y tarifas',
      description:
        'Vea ramales, paradas y la tarifa oficial de la ARESEP, y si la ruta acepta pago electrónico o solo efectivo.',
      icon: 'bus',
    },
    {
      title: 'Enterarse de los avisos',
      description: 'Averías, bloqueos y cierres de vía que afectan las rutas.',
      icon: 'bell',
    },
    {
      title: 'Pedir ayuda al asistente',
      description: 'Pídale con sus propias palabras que planifique un viaje o consulte una tarifa.',
      icon: 'chat',
    },
  ];
}
