# Instalación de Trayectico (RF-NA-03)

La aplicación usa el service worker oficial de Angular en producción. El manifiesto define el nombre Trayectico, íconos PNG, apertura independiente y `/trayectico` como inicio de la aplicación instalada. La navegación web sigue empezando en Kál Code.

«Instalar Trayectico» está disponible en la bienvenida del producto y en el menú de usuario. Abre un diálogo con instrucciones para Chrome/Edge, Safari en iPhone/iPad y Safari en Mac. Cuando el navegador emite `beforeinstallprompt`, el diálogo ofrece «Instalar ahora». Cancelar o no disponer de instalación no impide seguir usando la web.

Los archivos de la aplicación y sus pantallas se guardan para poder volver a abrirla sin conexión después de la primera carga y de completar la activación del service worker. No se guardan respuestas de servidores ni se promete información actualizada sin conexión. Un aviso global informa de la pérdida de conectividad y se retira al recuperarla. Los servicios actuales del proyecto utilizan datos de demostración/locales; todavía no hay consultas reales a un servidor para validar ese flujo de extremo a extremo.

## Comprobación manual

1. Ejecutar `npm run build` y servir `dist/trayectico-consumidor/browser` con un servidor que resuelva las rutas de Angular hacia `index.html`. También se puede usar `npm start -- --configuration production`.
2. Usar HTTPS en el sitio publicado. `http://localhost` permite las pruebas locales; una dirección HTTP de la red local no equivale a localhost.
3. Abrir `/trayectico`, esperar el registro/activación del service worker y abrir «Instalar Trayectico». En un navegador compatible, comprobar la opción nativa y tanto su aceptación como su cancelación. La disponibilidad depende también de las políticas del navegador y de si ya está instalada.
4. Abrir la aplicación instalada: comprobar nombre, ícono y ventana independiente cuando el sistema lo permita.
5. En iPhone/iPad, comprobar las instrucciones y agregar desde Safari. En navegadores sin instalación, cerrar el diálogo y continuar navegando.
6. Después de la activación del service worker, recargar una vez, desactivar la red y volver a abrir la aplicación. Comprobar que se carga la interfaz y aparece el aviso sin conexión. Restaurar la red y comprobar que se retira.

Referencia: [Service workers de Angular](https://angular.dev/ecosystem/service-workers/getting-started) y [solicitud de instalación del navegador](https://web.dev/learn/pwa/installation-prompt).
