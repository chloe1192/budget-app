import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  standalone: false,
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {
  constructor(private tokenStorage: TokenStorageService, private router: Router) {}

  async ngOnInit() {
    await this.tokenStorage.logout();
    this.router.navigate(['/index']).then(() => { window.location.reload()})
  }
}
