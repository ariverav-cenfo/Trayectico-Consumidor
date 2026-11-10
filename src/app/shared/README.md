# Componentes compartidos

`ui/` contiene piezas visuales reutilizables: botones, iconos, método de pago, cierre de sesión y acceso al asistente. `layout/` contiene la estructura compartida: barras, distribución de usuario y pie de datos. Los componentes específicos de cada pantalla permanecen en su área. La lógica de aplicación y el acceso a datos pertenecen a `app/services`.

## Botones

Importar `Button` desde `shared/ui/button/button` y agregarlo a `imports` del componente consumidor.

```html
<button appButton text="Guardar" size="medium" variant="primary" (click)="save()"></button>
<a appButton text="Ver rutas" routerLink="/rutas"></a>
<button appButton variant="secondary" [disabled]="busy()">
  <app-ui-icon name="check" /> Confirmar
</button>
```

- `text`: texto opcional; también acepta contenido e iconos dentro del botón.
- `size`: `small`, `medium` o `large` (predeterminado), con adaptación a móvil.
- `variant`: `primary`, `secondary` (predeterminado) o `danger`.
- `fullWidth`: `true` por defecto; usar `[fullWidth]="false"` para ancho automático.

Se usa sobre elementos nativos para conservar `type`, `disabled`, `autofocus`, eventos, accesibilidad y `routerLink`. Indicar `type="button"` para acciones dentro de formularios o `type="submit"` para enviarlos.

`UiIcon` está en `ui/ui-icon` y recibe el nombre del icono mediante `name`.
