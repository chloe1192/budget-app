import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService, Category, Transaction } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.page.html',
  styleUrls: ['./create-transaction.page.scss'],
})
export class CreateTransactionPage implements OnInit {
  transactionForm!: FormGroup;
  transactions: Transaction[] = [];
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.loadTransactions();
    this.transactionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      amount: ['', [Validators.required]],
      date: [new Date().toISOString(), Validators.required],
      category_id: [null, Validators.required],
    });

    this.transactionForm.get('amount')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.formatCurrency(value);
        if (formatted !== value) {
          this.transactionForm.get('amount')?.setValue(formatted, { emitEvent: false });
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

  loadTransactions() {
    this.api.fetchList<Category>('categories', { paginated: false }).subscribe(
      (res: Category[]) => {
        this.categories = res;
        this.api.fetchList<Transaction>('transactions', { paginated: false }).subscribe(
          (txRes: Transaction[]) => {
            console.log(txRes);
            this.transactions = txRes;
          },
          (err: any) => {
            console.log(err?.error ?? err);
          }
        );
      },
      (err: any) => {
        console.log(err?.error ?? err);
      }
    );
  }

  async createTransaction() {
    if (this.transactionForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Preencha todos os campos corretamente.',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
      return;
    }

    const formValue = this.transactionForm.value;
    const transaction: Transaction = {
      ...formValue,
      amount: this.parseCurrency(formValue.amount)
    };
    this.api.createTransaction(transaction).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Transação criada com sucesso!',
          duration: 2000,
          color: 'success',
        });
        toast.present();
        this.navCtrl.back();
      },
      error: async (err) => {
        console.error(err);
        const toast = await this.toastCtrl.create({
          message: 'Erro ao criar transação.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      },
    });
  }
}
