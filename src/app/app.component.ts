import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {'class': 'min-vh-100'}
})
export class AppComponent {
  title = 'plataforma-asociaciones-clm';
}
