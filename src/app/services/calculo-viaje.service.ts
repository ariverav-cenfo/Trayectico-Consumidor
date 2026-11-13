import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ViajeRequestDTO, ViajeResponseDTO } from "../interfaces/api-calculo-viaje";

@Injectable({
    providedIn: 'root',
})
export class CalculoViajeService{
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8080/api/rutas/buscar';

    buscarViaje(solicitud: ViajeRequestDTO): Observable<ViajeResponseDTO>{
        return this.http.post<ViajeResponseDTO>(this.apiUrl, solicitud);
    }
}

