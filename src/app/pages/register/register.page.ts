import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService, User } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userForm!: FormGroup;
  user: User = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    avatar: null,
  };

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      avatar: null,
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.user.avatar = file;
    } else {
      alert('Arquivo inválido! Selecione uma imagem.');
    }
  }

  async register() {
    if (this.userForm.invalid) return;

    this.api.createUser(this.user).subscribe({
      next: async (res: User) => {
        console.log('Usuário criado:', res);
        const toast = await this.toastCtrl.create({
          message: `Usuario ${res.username} criado com successo`,
          duration: 2000,
          color: 'success',
        });
        this.router.navigate(['/index']);
      },
      error: async (error) => {
        console.error('Detalhes', error.error);
        const toast = await this.toastCtrl.create({
          message: 'Erro ao criar usuario',
          duration: 2000,
          color: 'danger',
        });
        await toast.present()
      },
    });
  }
}
