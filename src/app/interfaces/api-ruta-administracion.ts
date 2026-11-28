export interface RecorridoAdminDTO{
    id: number;
    ramal_id: number;
    codigo_ctp: string;
    id_ctp: number;
    direccion: string;
    longitud_m: number;
    estado_ctp: string;
    activo: boolean;
}

export interface RutaAdminDTO{
    id: number;
    codigo_ctp: string;
    id_ctp: number;
    nombre: string | null;
    activo: boolean;
    recorridos: RecorridoAdminDTO[];
}

export interface RutaEstadoRequestDTO{
    activo: boolean;
}