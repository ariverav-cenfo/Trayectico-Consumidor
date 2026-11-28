# TrayecticoConsumidor

## Áreas de la aplicación

Las rutas principales cargan tres áreas de forma diferida mediante `loadChildren`:

- `src/app/areas/public`: Inicio (`/`), Acceso denegado y Página no encontrada.
- `src/app/areas/user`: Planificador (`/planificar`) como entrada de usuario, resultados, rutas, detalle, avisos, historial, asistente y perfil.
- `src/app/areas/admin`: panel y gestión de rutas, paradas, avisos, tarifas y usuarios bajo `/admin`.

Cada área contiene sus pantallas en `pages/` y su propio archivo de rutas.
Los componentes exclusivos de un área se ubican en su carpeta `components/`.
Los elementos visuales reutilizables van en `src/app/shared/ui/`, y la estructura
compartida de las pantallas en `src/app/shared/layout/` (como la barra de navegación).
Las direcciones desconocidas muestran la página pública de error.
Se retiraron las pantallas iniciales de login, registro y recuperación de contraseña;
la integración con Google y los controles de acceso todavía están pendientes.
La carga diferida por sí sola no restringe el acceso a las pantallas.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## INSTRUCCIONES PARA LEVANTAR EL PROYECTO POR PRIMERA VEZ

## 1. Prerrequisitos

Instalar las siguientes herramientas antes de iniciar:

- **Visual Studio Code**
- **Git**
- **Angular 22.2.0**
- **NodeJS 24.15.0**
- **npm 11.12.1**

## 2. Clonar el repositorio

```bash
git clone https://github.com/ariverav-cenfo/Trayectico-Consumidor.git

cd Trayectico-Consumidor
```

## 3. Instalar dependencias

```bash
npm install
```

## 4. Levantar el proyecto

```bash
npm start
```

*Para detener npm start deben presionar Ctrl + C dentro de la terminal.*

## 5. Compilar proyecto

```bash
npm run build
```

## 6. Exponer la aplicación mediante ngrok

Esta configuración permite acceder a Trayectico desde dispositivos externos mediante una URL pública HTTPS. ngrok expone el servidor de desarrollo de Angular y el proxy configurado en Angular redirige las solicitudes al backend Spring Boot.

### 6.1. Prerrequisitos

Antes de iniciar ngrok, deben estar ejecutándose los siguientes servicios:

- **PostgreSQL:** base de datos utilizada por el servidor.
- **Spring Boot:** backend ejecutándose en `http://localhost:8080`.
- **Angular:** consumidor ejecutándose en `http://localhost:4200`.

### 6.2. Configuración del proxy

El archivo `proxy.conf.json`, ubicado en la raíz del proyecto, contiene la configuración para redirigir las solicitudes de `/api` y `/health` al servidor Spring Boot.

El archivo `angular.json` configura el proxy y permite el dominio público de ngrok mediante `allowedHosts`.

Estas configuraciones permiten que el navegador utilice el mismo dominio HTTPS para acceder al consumidor y a los endpoints del servidor, sin necesidad de configurar una URL pública del backend en los environments de Angular.

### 6.3. Configurar e iniciar ngrok

1. Descargar e instalar ngrok siguiendo las instrucciones oficiales: [https://ngrok.com/](https://ngrok.com/).
2. Solicitar `NGROK_AUTHTOKEN` al responsable del proyecto (Christian) mediante un medio privado y seguro.
3. Registrar el authtoken localmente mediante el siguiente comando:

```powershell
ngrok config add-authtoken SU_AUTHTOKEN
```

Cada desarrollador debe realizar esta configuración una sola vez en su máquina.

**Importante:** el authtoken es una credencial privada compartida por el equipo. Nunca debe publicarse, incluirse directamente en el código ni subirse a GitHub. El archivo `.env` tampoco debe subirse al repositorio.

Con Angular ejecutándose, abrir una terminal adicional y ejecutar:

```powershell
cd C:\ngrok
.\ngrok.exe http --url=babbling-oven-concerned.ngrok-free.dev 4200
```

ngrok expondrá el servidor de Angular mediante la siguiente dirección pública:

`https://babbling-oven-concerned.ngrok-free.dev`

### 6.4. Acceder a la aplicación

Abrir la URL pública desde el navegador del dispositivo que utilizará la aplicación.

En el plan gratuito de ngrok puede aparecer una página de advertencia antes de acceder al sitio. Seleccionar **Visit Site** para continuar.

**Importante:**
- PostgreSQL, Spring Boot, Angular y ngrok deben permanecer ejecutándose mientras se utiliza la aplicación.
- El túnel deja de estar disponible cuando se detiene ngrok o se apaga el equipo que lo ejecuta.
- El dominio fijo pertenece a la cuenta de ngrok compartida por el equipo. Solo debe existir una sesión de túnel activa utilizando ese dominio a la vez.
