import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ApiService, User } from 'src/app/services/api';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  standalone: false,
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private tokenSvc: TokenStorageService
  ) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      avatar: [null],
    })
  }

  ngOnInit() {
    this.api.fetchUser().subscribe((user: User) => {
      this.userForm.patchValue({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email
      });
    });
  }

  updateUser() {
    if (this.userForm.valid) {
      const userData = { ...this.userForm.value };
      
      // Remove password if empty (don't update password)
      if (!userData.password || userData.password.trim() === '') {
        delete userData.password;
      }
      
      // Remove avatar if null (don't update avatar for now)
      if (!userData.avatar) {
        delete userData.avatar;
      }
      
      this.api.updateUser(userData).subscribe({
        next: async (response) => {
          const toast = await this.toastCtrl.create({
            message: 'Profile updated successfully',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
          this.router.navigate(['/user']);
        },
        error: async (err) => {
          let errorMsg = 'Error updating profile';
          
          // Handle different error formats
          if (err.error?.password) {
            errorMsg = Array.isArray(err.error.password) 
              ? err.error.password.join(', ') 
              : err.error.password;
          } else if (err.error?.error) {
            errorMsg = err.error.error;
          } else if (err.error?.message) {
            errorMsg = err.error.message;
          } else if (typeof err.error === 'string') {
            errorMsg = err.error;
          } else if (err.error) {
            const firstError = Object.values(err.error).find(v => v);
            if (firstError) {
              errorMsg = Array.isArray(firstError) ? firstError[0] : String(firstError);
            }
          }
          
          const toast = await this.toastCtrl.create({
            message: errorMsg,
            duration: 3000,
            color: 'danger'
          });
          await toast.present();
        }
      });
    }
  }

  deleteAccount() {
    this.api.deleteUser().subscribe({
      next: async (res) => {
        const toast = await this.toastCtrl.create({
          message: "User deleted",
          duration: 2000,
          color: "success"
        })
        await toast.present();
        this.tokenSvc.logout();
        this.router.navigate(['/']);
      }, error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: "Error",
          duration: 2000,
          color: "danger"
        })
        await toast.present()
      }
    })
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: "Confirm",
      message: "You want to delete your account",
      buttons: [
        { text: "Cancel", role: "cancel"},
        { text: "Delete",
          handler: () => this.deleteAccount()
        }
      ]
    })
    await alert.present()
  }
}