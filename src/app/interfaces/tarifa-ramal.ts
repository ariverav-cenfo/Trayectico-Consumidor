/** Tarifa de un ramal según ARESEP, como la devuelve GET /rutas/{codigo}. */
export interface TarifaRamal {
  /** Tarifa regular en colones costarricenses. */
  monto_colones: number;
  /**
   * `true` si el ramal tiene un solo fraccionamiento. Si es `false`, el monto es la tarifa del
   * viaje completo (la más alta) y lo que se paga depende de dónde se suba y se baje.
   */
  exacta: boolean;
}
