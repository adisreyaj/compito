import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'compito-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  constructor(private http: HttpClient) {
    this.http.get(`${environment.api}/ping`).subscribe(console.log);
  }
}
