import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss',
})
export class AuthCallbackComponent {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    const code_challenge_method = this.route.snapshot.queryParamMap.get(
      'code_challenge_method'
    );
    const code_challenge =
      this.route.snapshot.queryParamMap.get('code_challenge');

    if (code && state) {
      // Exchange code for token (if needed)
      this.authService.exchangeCodeForToken(code, state).subscribe({
        next: (data: any) => {
          console.log(data);
          localStorage.clear();
          localStorage.setItem('airtable_access_token', data.access_token);
          localStorage.setItem('airtable_refresh_token', data.refresh_token);
          localStorage.setItem('airtable_expires_in', data.expires_in);
          this.router.navigate(['/login-success']);
        },
        error: () => this.router.navigate(['/']),
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
