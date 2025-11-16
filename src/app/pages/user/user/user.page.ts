import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
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
    private api: ApiService,
    private toastCtrl: ToastController
  ) { }

  loadUser() {
    this.api.fetchUser().subscribe({
      next: (res) => {
        this.user = res;
        console.log('User loaded:', this.user);
      },
      error: async (err) => {
        console.error('Error loading user:', err);
        const errorMsg = err.error?.error || err.error?.message || err.message || 'Error loading user data';
        const toast = await this.toastCtrl.create({
          message: errorMsg,
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  ngOnInit(): void {
    this.loadUser()
  }
  
}
