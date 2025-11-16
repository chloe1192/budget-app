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
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString(), Validators.required],
    });
  }

  async createGoal() {
    if (this.goalForm.invalid) return;

    const data = this.goalForm.value;
    this.api.addGoal(data).subscribe({
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
