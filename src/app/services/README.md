# Servicios de la aplicación

- `TransportService`: consulta de rutas y tarifas, filtros de avisos, paradas, recorridos y opciones de viaje.
- `TripHistoryService`: estado del historial mediante signals y persistencia local.
- `RecentSearchesService`: búsquedas recientes, deduplicación, límite y persistencia local.
- `AssistantService`: respuestas de demostración basadas en las consultas de transporte.

Los datos de ejemplo están en `app/data`. Solo los servicios los importan; las pantallas consumen los servicios mediante `inject()`. Cada servicio tiene una responsabilidad concreta y se registra con `providedIn: 'root'`. El estado compartido se expone mediante signals de solo lectura y los datos de transporte se devuelven como copias para proteger los ejemplos originales.

Los componentes conservan la presentación, los formularios, la selección visual y la navegación. Las conversaciones permanecen en la pantalla para iniciar una sesión nueva al entrar. Los servicios actuales son síncronos porque utilizan datos locales; cuando exista una API, el acceso remoto se implementará en esta capa.

Referencias: [inyección de dependencias](https://angular.dev/essentials/dependency-injection) y [guía de estilo](https://angular.dev/style-guide). Angular recomienda organizar por funcionalidad; este proyecto conserva las carpetas `services` e `interfaces` solicitadas y separa los archivos por responsabilidad.
