import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService, Transaction, Category } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.page.html',
  styleUrls: ['./edit-transaction.page.scss'],
})
export class EditTransactionPage implements OnInit {
  transactionForm!: FormGroup;
  transactionId!: number;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.transactionId = +this.route.snapshot.paramMap.get('id')!;

    this.transactionForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required]],
      date: [new Date().toISOString(), Validators.required],
      category_id: [null, Validators.required],
    });

    this.transactionForm.get('amount')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const formatted = this.formatCurrency(value);
        if (formatted !== value) {
          this.transactionForm.get('amount')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    this.loadCategories();
    this.loadTransaction();
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

  loadCategories() {
    this.api.fetchList<Category>('categories', { paginated: false }).subscribe(
      (categories: Category[]) => (this.categories = categories),
      (err: any) => console.error(err)
    );
  }

  loadTransaction() {
    this.api.fetchList<Transaction>('transactions', { paginated: false }).subscribe(
      (transactions: Transaction[]) => {
        const transaction = transactions.find((t) => t.id === this.transactionId);
        if (transaction) {
          this.transactionForm.patchValue({
            description: transaction.description,
            amount: transaction.amount.toFixed(2).replace('.', ','),
            date: transaction.date,
            category_id: transaction.category.id,
          });
        }
      },
      (err: any) => console.error(err)
    );
  }

  async updateTransaction() {
    if (!this.transactionForm.valid) return;

    const formValue = this.transactionForm.value;
    const data = {
      ...formValue,
      amount: this.parseCurrency(formValue.amount)
    };

    this.api.updateTransaction(this.transactionId, data).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Transação atualizada com sucesso!',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.navCtrl.back();
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: 'Erro ao atualizar transação.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
        console.error(err);
      },
    });
  }
}
