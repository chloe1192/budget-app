import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api';

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
    private router: Router
  ) { }

  login() {
    this.api.loginUser({ username: this.username, password: this.password }).subscribe(
      res => {
        console.log('User is logged')
        localStorage.setItem('token' , res.token);
        localStorage.setItem('username', res.user.username);
        this.router.navigate(['/index'])
      },
      err => {
        console.log('Error at logging in');
        alert('User or password invalid');
      }
    )
  }

}
