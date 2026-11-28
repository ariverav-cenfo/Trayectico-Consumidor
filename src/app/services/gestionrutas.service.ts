import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RutaAdminDTO, RutaEstadoRequestDTO } from "../interfaces/api-ruta-administracion";

@Injectable({
    providedIn: 'root'
})
export class GestionRutaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = '/api/admin/rutas';

    listarRutasAdmin(): Observable<RutaAdminDTO[]> {
    return this.http.get<RutaAdminDTO[]>(this.apiUrl);
    }

    obtenerRutaAdmin(codigo: string): Observable<RutaAdminDTO> {
    return this.http.get<RutaAdminDTO>(`${this.apiUrl}/${encodeURIComponent(codigo)}`);
    }

    cambiarEstadoRuta(codigo: string, activo: boolean): Observable<RutaAdminDTO> {
        const body: RutaEstadoRequestDTO = { activo };
        return this.http.patch<RutaAdminDTO>(`${this.apiUrl}/${encodeURIComponent(codigo)}/estado`, body);
    }
}