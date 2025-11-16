import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  user: any;

  constructor(
    private api: ApiService
  ) { }

  loadUser() {
    this.api.fetchUser().subscribe(
      res => {
        this.user = res;
        console.log(this.user)
      },
      err => {
        console.log(err.error);
        alert(err.error)
      }
    )
  }

  ngOnInit(): void {
    this.loadUser()
  }
  
}
