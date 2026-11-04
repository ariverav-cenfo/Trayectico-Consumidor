import { TransportService } from '../../../../services/transport.service';
import type { TripOption } from '../../../../interfaces/trip-option';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Results } from '../../components/planner-result/results/results';

import { ResultMap } from '../../components/planner-result/result-map/result-map';
import { StepByStep } from '../../components/planner-result/step-by-step/step-by-step';
import { Fare } from '../../components/planner-result/fare/fare';
import { RouteDetailLink } from '../../components/planner-result/route-detail-link/route-detail-link';
import { TripHistoryService } from '../../../../services/trip-history.service';

import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';

@Component({
  imports: [RouterLink, Results, ResultMap, StepByStep, Fare, RouteDetailLink, AiMessage],
  selector: 'app-planner-result',
  styleUrl: './planner-result.css',
  templateUrl: './planner-result.html',
})
export class PlannerResult {
  private readonly route = inject(ActivatedRoute);
  private readonly history = inject(TripHistoryService);
  protected readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  protected readonly options = inject(TransportService).getTripOptions();
  protected readonly selected = signal(
    this.options.find((option) => option.id === this.route.snapshot.queryParamMap.get('option')) ??
      this.options[0],
  );
  protected choose(option: TripOption) {
    this.selected.set(option);
    const id = this.params().get('tripId');
    if (id) this.history.updateOption(id, option.id);
  }
}
