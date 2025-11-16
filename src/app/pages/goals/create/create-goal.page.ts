import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService, Goal } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-create-goal',
  templateUrl: './create-goal.page.html',
  styleUrls: ['./create-goal.page.scss'],
})
export class CreateGoalPage implements OnInit {
  goalForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.goalForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      amount: ['', [Validators.required]],
      date: [new Date().toISOString(), Validators.required],
    });

    this.goalForm.get('amount')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.formatCurrency(value);
        if (formatted !== value) {
          this.goalForm.get('amount')?.setValue(formatted, { emitEvent: false });
        }
      }
    });
  }

  formatCurrency(value: string): string {
    let numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    
    const amount = parseInt(numbers) / 100;
    return amount.toFixed(2).replace('.', ',');
  }

  parseCurrency(value: string): number {
    return parseFloat(value.replace(',', '.')) || 0;
  }

  async createGoal() {
    if (this.goalForm.invalid) return;

    const formValue = this.goalForm.value;
    const data = {
      ...formValue,
      amount: this.parseCurrency(formValue.amount)
    };
    this.api.createGoal(data).subscribe({
      next: async (res: Goal) => {
        const toast = await this.toastCtrl.create({
          message: `Meta com nome: ${res.title} criada com sucesso!`,
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.navCtrl.back();
      },
      error: async (err) => {
        console.error(err);
        const toast = await this.toastCtrl.create({
          message: 'Erro ao criar meta.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }
}
