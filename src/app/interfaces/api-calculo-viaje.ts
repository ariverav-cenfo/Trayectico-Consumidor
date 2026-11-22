export interface LocalizacionRequestDTO{
    lat:number;
    lon:number;
}

export interface ViajeRequestDTO{
    origen:LocalizacionRequestDTO;
    destino:LocalizacionRequestDTO;
}

export interface GeoJsonLineStringDTO{
    type: string,
    coordinates:[number, number][];
}
//TYPO en el backend y en el frontend, es parada pero asi se va por ahora
export interface ParaResponseDTO{
    codigo_parada:string,
    nombre_parada:string,
    lon:number,
    lat:number
}

export interface TramoResponseDTO{
        tipo: 'caminata' | 'bus';
        distancia_metros: number;
        geometria: GeoJsonLineStringDTO | null;
        //Campos especifcos de bus
        codigo_ruta?: string;
        nombre_ruta?: string;
        codigo_ramal?: string;
        nombre_ramal?: string;
        codigo_recorrido?: string;
        parada_abordaje?: ParaResponseDTO;
        parada_descenso?: ParaResponseDTO;
        tarifa?: number | null;
        acepta_pago_electronico?: boolean | null;
}

export interface OpcionesViajeResponseDTO{
        id:string;
        transbordos: number;
        distancia_caminando_metros: number;
        costo_total: number | null;
        tramos: TramoResponseDTO[];
}

export interface ViajeResponseDTO{
            opciones: Omit<OpcionesViajeResponseDTO, 'id'>[];
}