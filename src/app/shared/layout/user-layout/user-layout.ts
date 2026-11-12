import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { TopBar } from '../top-bar/top-bar';
import { HamburgerMenu } from '../../../areas/user/components/hamburger-menu/hamburger-menu';

@Component({
  selector: 'app-user-layout',
  host: { class: 'user-area' },
  imports: [RouterOutlet, NavigationBar, TopBar, HamburgerMenu],
  template: `
    <app-top-bar><app-hamburger-menu /></app-top-bar>
    <div class="user-content"><router-outlet /></div>
    <app-navigation-bar />
  `,
  styles: `
    :host {
      display: block;
    }
    .user-content {
      padding-bottom: calc(82px + env(safe-area-inset-bottom, 0px));
    }
  `,
})
export class UserLayout {}
