import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { GestionRutaService } from "../../../../services/gestionrutas.service";
import { RouterLink } from "@angular/router";
import { RutaAdminDTO } from "../../../../interfaces/api-ruta-administracion";

@Component({
    selector: 'app-gestion-rutas',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './gestionrutas.html',
    styleUrl: './gestionrutas.css',
})
export class GestionRutasComponent implements OnInit{
    private readonly rutasService = inject(GestionRutaService);

  rutas = signal<RutaAdminDTO[]>([]);
  filtro = signal<string>('');
  estadoFiltro = signal<'todas' | 'activas' | 'inactivas'>('todas');
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);
  actualizandoCodigo = signal<string | null>(null);
  rutaExpandida = signal<string | null>(null);

  rutasFiltradas = computed(() => {
    const texto = this.filtro().toLowerCase().trim();
    const estado = this.estadoFiltro();

    return this.rutas().filter(ruta => {
      const coincideTexto =
        !texto ||
        ruta.codigo_ctp.toLowerCase().includes(texto) ||
        (ruta.nombre && ruta.nombre.toLowerCase().includes(texto)) ||
        String(ruta.id_ctp).includes(texto);

      const coincideEstado =
        estado === 'todas' ||
        (estado === 'activas' && ruta.activo) ||
        (estado === 'inactivas' && !ruta.activo);

      return coincideTexto && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.cargarRutas();
  }

  cargarRutas(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.rutasService.listarRutasAdmin().subscribe({
      next: (data) => {
        this.rutas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar rutas:', err);
        this.error.set('No se pudieron cargar las rutas. Verifique su conexión o permisos.');
        this.cargando.set(false);
      }
    });
  }

  toggleEstadoRuta(ruta: RutaAdminDTO): void {
    if (this.actualizandoCodigo()) return;

    const nuevoEstado = !ruta.activo;
    this.actualizandoCodigo.set(ruta.codigo_ctp);

    this.rutasService.cambiarEstadoRuta(ruta.codigo_ctp, nuevoEstado).subscribe({
      next: (rutaActualizada) => {
        this.rutas.update(lista =>
          lista.map(r => (r.codigo_ctp === rutaActualizada.codigo_ctp ? rutaActualizada : r))
        );
        this.actualizandoCodigo.set(null);
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        this.error.set(`Error al actualizar el estado de la ruta ${ruta.codigo_ctp}.`);
        this.actualizandoCodigo.set(null);
      }
    });
  }

  toggleDetalles(codigoCtp: string): void {
    this.rutaExpandida.update(actual => (actual === codigoCtp ? null : codigoCtp));
  }

  onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtro.set(input.value);
  }

}