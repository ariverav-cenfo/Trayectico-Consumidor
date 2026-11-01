import type { NavigationLink } from '../../../../interfaces/navigation-link.interface';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoutButton } from '../../../../shared/ui/logout-button/logout-button';

@Component({
  selector: 'app-hamburger-menu',
  imports: [RouterLink, LogoutButton],
  templateUrl: './hamburger-menu.html',
  styleUrl: './hamburger-menu.css',
})
export class HamburgerMenu {
  readonly userName = input('Nombre de usuario');
  protected readonly links: NavigationLink[] = [
    {
      label: 'Planificar viaje',
      route: '/planificar',
      path: 'M3 5 9 3 15 5 21 3V19L15 21 9 19 3 21ZM9 3V19M15 5V21',
    },
    {
      label: 'Rutas',
      route: '/rutas',
      path: 'M5 11H19M7 18V21M17 18V21M5 4Q5 2 7 2H17Q19 2 19 4V16Q19 18 17 18H7Q5 18 5 16ZM8 15H8.01M16 15H16.01',
    },
    {
      label: 'Avisos de servicio',
      route: '/avisos',
      path: 'M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8M10 21Q12 23 14 21',
    },
    {
      label: 'Historial de viajes',
      route: '/historial',
      path: 'M21 12A9 9 0 1 1 3 12 9 9 0 1 1 21 12M12 6V12L16 14',
    },
    { label: 'Asistente IA', route: '/asistente', path: 'M3 3H21V17H8L3 22Z' },
    {
      label: 'Perfil',
      route: '/perfil',
      path: 'M16 7A4 4 0 1 1 8 7 4 4 0 1 1 16 7M4 22V19Q4 15 8 15H16Q20 15 20 19V22',
    },
  ];
  protected closeOnBackdrop(event: MouseEvent, dialog: HTMLDialogElement) {
    if (event.target === dialog) dialog.close();
  }
}
