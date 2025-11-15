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
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString(), Validators.required],
      category_id: [null, Validators.required],
    });
  }

  loadTransactions() {
    this.api.getCategories().subscribe(
      res => {
        this.categories = res
        this.api.getTransactions().subscribe(
          (res) => {
            console.log(res);
            this.transactions = res;
          },
          (err) => {
            console.log(err.error);
          }
        );
      }, err => {
        console.log(err.error)
      }
    )
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

    const transaction: Transaction = this.transactionForm.value;
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
