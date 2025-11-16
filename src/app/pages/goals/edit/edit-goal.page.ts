import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService, Goal } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-edit-goal',
  templateUrl: './edit-goal.page.html',
  styleUrls: ['./edit-goal.page.scss'],
})
export class EditGoalPage implements OnInit {
  goalForm!: FormGroup;
  goalId!: number;
  goal!: Goal;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.goalId = +this.route.snapshot.paramMap.get('id')!;
    this.loadGoal();

    this.goalForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      amount: ['', [Validators.required]],
      date: [new Date().toISOString(), Validators.required],
    });

    this.goalForm.get('amount')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
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

  loadGoal() {
    this.api.fetchList<Goal>('goals', { paginated: false }).subscribe({
      next: (goals: Goal[]) => {
        this.goal = goals.find((g) => g.id === this.goalId)!;
        if (this.goal) {
          this.goalForm.patchValue({
            title: this.goal.title,
            description: this.goal.description,
            amount: this.goal.amount.toFixed(2).replace('.', ','),
            date: this.goal.date,
          });
        }
      },
      error: (err: any) => {
        console.error('Erro ao carregar meta:', err);
      },
    });
  }

  async updateGoal() {
    if (this.goalForm.invalid) return;

    const formValue = this.goalForm.value;
    const data = {
      ...formValue,
      amount: this.parseCurrency(formValue.amount)
    };
    this.api.updateGoal(this.goalId, data).subscribe({
      next: async (res) => {
        const toast = await this.toastCtrl.create({
          message: 'Meta atualizada com sucesso!',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.navCtrl.back();
      },
      error: async (err) => {
        console.error('Erro ao atualizar meta:', err);
        const toast = await this.toastCtrl.create({
          message: 'Erro ao atualizar meta.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }
}
