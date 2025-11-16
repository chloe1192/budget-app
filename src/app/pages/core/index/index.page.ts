import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService, Transaction, User } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  user: User | null = null;
  transactions: Transaction[] = [];
  
  constructor(
    private api: ApiService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadUser();
    this.loadTransactions();
  }

  loadUser() {
    this.api.fetchUser().subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (err) => {
        console.error('Error loading user:', err);
      }
    });
  }

  loadTransactions() {
    this.api.fetchList<Transaction>('transactions', { 
      paginated: false,
      params: { page_size: 10, ordering: '-date' }
    }).subscribe({
      next: (res: Transaction[]) => {
        this.transactions = res;
      },
      error: async (err: any) => {
        console.error('Error loading transactions:', err);
        const toast = await this.toastCtrl.create({
          message: 'Failed to load transactions',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
