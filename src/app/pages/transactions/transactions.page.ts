import { Component, OnInit } from '@angular/core';
import { ApiService, Transaction } from 'src/app/services/api';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {

  transactions: any[] = [];

  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.api.getTransactions().subscribe({
      next: (res: any) => {
        this.transactions = res;
      },
      error: (err) => {
        console.error('Erro ao carregar transações:', err);
        this.transactions = [];
      }
    });
  }

  doRefresh(event: any) {
    this.api.getTransactions().subscribe({
      next: (res) => {
        this.transactions = res;
        event.target.complete();
      },
      error: () => event.target.complete()
    });
  }

  openTransaction(t: any) {
    this.navCtrl.navigateForward(`/transactions/${t.id}`);
  }

  editTransaction(t: any) {
    this.navCtrl.navigateForward(`/transactions/edit/${t.id}`);
  }

  async confirmDelete(t: any) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir',
      message: `Deseja excluir a transação <strong>${t.description}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          cssClass: 'danger',
          handler: () => this.deleteTransaction(t.id)
        }
      ]
    });

    await alert.present();
  }

  deleteTransaction(id: number) {
    this.api.deleteTransaction(id).subscribe({
      next: () => {
        this.transactions = this.transactions.filter(tr => tr.id !== id);
      },
      error: (err) => console.error('Erro ao excluir:', err)
    });
  }

}
