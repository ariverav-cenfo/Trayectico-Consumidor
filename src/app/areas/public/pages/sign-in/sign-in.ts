import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopBar } from '../../../../shared/layout/top-bar/top-bar';
import { GoogleSignIn } from '../../components/google-sign-in/google-sign-in';

@Component({
  selector: 'app-sign-in',
  imports: [TopBar, RouterLink, GoogleSignIn],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {}
