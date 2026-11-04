import { RutaService } from '../../../../services/ruta.service';
import type { ValorControlesRuta } from '../../../../interfaces/valor-controles-ruta';
import { Button } from '../../../../shared/ui/button/button';
import { Component, inject, signal, computed } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { EncabezadoRuta } from '../../components/detalle-ruta/encabezado-ruta/encabezado-ruta';
import { AvisoRuta } from '../../components/detalle-ruta/aviso-ruta/aviso-ruta';
import { ControlesRuta } from '../../components/detalle-ruta/controles-ruta/controles-ruta';
import { ParadasRuta } from '../../components/detalle-ruta/paradas-ruta/paradas-ruta';
import { TarifasRuta } from '../../components/detalle-ruta/tarifas-ruta/tarifas-ruta';
import { MapaResultado } from '../../components/resultado-planificador/mapa-resultado/mapa-resultado';
import { DataFooter } from '../../../../shared/layout/data-footer/data-footer';
@Component({
  selector: 'app-detalle-ruta',
  imports: [
    Button,
    AiMessage,
    RouterLink,
    EncabezadoRuta,
    AvisoRuta,
    ControlesRuta,
    ParadasRuta,
    TarifasRuta,
    MapaResultado,
    DataFooter,
  ],
  templateUrl: './detalle-ruta.html',
  styleUrl: './detalle-ruta.css',
})
export class DetalleRuta {
  private readonly transport = inject(RutaService);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  protected readonly controls = signal<ValorControlesRuta>({ branch: '', direction: 'Ida' });
  protected readonly current = computed(() => this.transport.obtenerRuta(this.params().get('id')));
  protected readonly activeAlert = computed(() =>
    this.transport.obtenerAvisoActivo(this.params().get('id')),
  );
  protected readonly stops = computed(() => this.transport.obtenerParadas(this.controls()));
  protected readonly points = computed(() => this.transport.obtenerPuntosMapa(this.controls()));
}
