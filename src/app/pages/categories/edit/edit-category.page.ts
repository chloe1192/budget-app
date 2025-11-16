import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService, Category } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-edit-category',
  templateUrl: './edit-category.page.html',
  styleUrls: ['./edit-category.page.scss'],
})
export class EditCategoryPage implements OnInit {
  categoryForm!: FormGroup;
  categoryId!: number;
  type_choices = [
    { value: 'INCOME', label: 'Entrada' },
    { value: 'EXPENSE', label: 'Saída' },
  ];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      color: ['#000000', Validators.required],
      type: ['', Validators.required],
    });

    this.loadCategory();
  }

  loadCategory() {
    this.api.fetchList<Category>('categories', { paginated: false }).subscribe(
      (categories: Category[]) => {
        const category = categories.find((c) => c.id === this.categoryId);
        if (category) {
          this.categoryForm.patchValue({
            name: category.name,
            color: category.color,
            type: category.type,
          });
        }
      },
      (err: any) => console.error(err)
    );
  }

  async updateCategory() {
    if (!this.categoryForm.valid) return;

    this.api
      .updateCategory(this.categoryId, this.categoryForm.value)
      .subscribe({
        next: async () => {
          const toast = await this.toastCtrl.create({
            message: 'Categoria atualizada com sucesso!',
            duration: 2000,
            color: 'success',
          });
          await toast.present();
          this.navCtrl.back();
        },
        error: async (err) => {
          const toast = await this.toastCtrl.create({
            message: 'Erro ao atualizar categoria.',
            duration: 2000,
            color: 'danger',
          });
          await toast.present();
          console.error(err);
        },
      });
  }
}
