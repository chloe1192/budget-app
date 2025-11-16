import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username: string = '';
  password: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) { }

  async login() {
    this.api.loginUser({ username: this.username, password: this.password }).subscribe(
      async res => {
        console.log('User is logged')
        try {
          await this.tokenStorage.setToken(res.token);
          await this.tokenStorage.setUsername(res.user.username);
          this.router.navigate(['/index'])
        } catch (error) {
          console.error('Error storing token:', error);
          alert('Login successful but failed to store credentials');
        }
      },
      err => {
        console.log('Error at logging in');
        alert('User or password invalid');
      }
    )
  }

}
