import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ViajeRequestDTO, ViajeResponseDTO } from "../interfaces/api-calculo-viaje";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CalculoViajeService{
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiUrl;
    private readonly viajeUrl = `${this.baseUrl}/api/rutas/buscar`;

    buscarViaje(solicitud: ViajeRequestDTO): Observable<ViajeResponseDTO>{
        return this.http.post<ViajeResponseDTO>(this.viajeUrl, solicitud);
    }
}

