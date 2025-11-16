import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-create-category',
  templateUrl: './create-category.page.html',
  styleUrls: ['./create-category.page.scss'],
})
export class CreateCategoryPage implements OnInit {
  categoryForm!: FormGroup;
  type_choices = [
    { value: 'INCOME', label: 'Entrada' },
    { value: 'EXPENSE', label: 'Saida' },
  ];

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', [Validators.required]],
      color: ['#8e44ad', [Validators.required]],
    });
  }

  async createCategory() {
    if (this.categoryForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Preencha o nome da categoria corretamente.',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
      return;
    }

    const category = this.categoryForm.value;
    this.api.createCategory(category).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Categoria criada com sucesso!',
          duration: 2000,
          color: 'success',
        });
        toast.present();
        this.navCtrl.back();
      },
      error: async (err) => {
        console.error(err);
        const toast = await this.toastCtrl.create({
          message: 'Erro ao criar categoria.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      },
    });
  }
}
