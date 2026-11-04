import { TransportService } from '../../../../services/transport.service';
import type { ValorControlesRuta } from '../../../../interfaces/valor-controles-ruta';
import { Button } from '../../../../shared/ui/button/button';
import { Component, inject, signal, computed } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouteHeading } from '../../components/route-detail/route-heading/route-heading';
import { RouteAlert } from '../../components/route-detail/route-alert/route-alert';
import { RouteControls } from '../../components/route-detail/route-controls/route-controls';
import { RouteStops } from '../../components/route-detail/route-stops/route-stops';
import { RouteFares } from '../../components/route-detail/route-fares/route-fares';
import { ResultMap } from '../../components/planner-result/result-map/result-map';
import { DataFooter } from '../../../../shared/layout/data-footer/data-footer';
@Component({
  selector: 'app-route-detail',
  imports: [
    Button,
    AiMessage,
    RouterLink,
    RouteHeading,
    RouteAlert,
    RouteControls,
    RouteStops,
    RouteFares,
    ResultMap,
    DataFooter,
  ],
  templateUrl: './route-detail.html',
  styleUrl: './route-detail.css',
})
export class RouteDetail {
  private readonly transport = inject(TransportService);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  protected readonly controls = signal<ValorControlesRuta>({ branch: '', direction: 'Ida' });
  protected readonly current = computed(() => this.transport.getRoute(this.params().get('id')));
  protected readonly activeAlert = computed(() =>
    this.transport.getActiveAlert(this.params().get('id')),
  );
  protected readonly stops = computed(() => this.transport.getStops(this.controls()));
  protected readonly points = computed(() => this.transport.getMapPoints(this.controls()));
}
