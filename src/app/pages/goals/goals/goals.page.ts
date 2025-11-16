import { Component, OnInit } from '@angular/core';
import { ApiService, Goal } from 'src/app/services/api';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
})
export class GoalsPage implements OnInit {
  goals: Goal[] = [];

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadGoals();
  }

  loadGoals() {
    this.api.fetchList<Goal>('goals', { paginated: false }).subscribe({
      next: (res: Goal[]) => {
        this.goals = res;
      },
      error: (err: any) => {
        console.error('Erro ao carregar metas:', err);
      },
    });
  }

  doRefresh(event: any) {
    this.api.fetchList<Goal>('goals', { paginated: false }).subscribe({
      next: (res: Goal[]) => {
        this.goals = res;
        event.target.complete();
      },
      error: () => event.target.complete(),
    });
  }

  openGoal(goal: Goal) {
    this.navCtrl.navigateForward(`/goals/${goal.id}`);
  }

  editGoal(goal: Goal) {
    this.navCtrl.navigateForward(`/goals/edit/${goal.id}`);
  }

  async confirmDelete(goal: Goal) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `Deseja excluir a meta <strong>${goal.title}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => this.removeGoal(goal.id!),
          cssClass: 'danger',
        },
      ],
    });
    await alert.present();
  }

  removeGoal(id: number) {
    this.api.removeGoal(id).subscribe({
      next: () => {
        this.goals = this.goals.filter((g) => g.id !== id);
      },
      error: (err) => console.error('Erro ao excluir meta:', err),
    });
  }
}
