import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private service: AuthService) {}
  loginWithSSO() {
    this.service.getAuthURL().subscribe((data: any) => {
      window.location.href = data.authorizationUrl;
    });
  }
}
