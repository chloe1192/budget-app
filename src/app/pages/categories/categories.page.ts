import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService, Category } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.api.getCategories().subscribe(
      res => {
        this.categories = res;
        console.log(this.categories)
      },
      err => {
        console.log(err.error);
        alert(err.error)
      }
    )
  }
   doRefresh(event: any) {
    this.api.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        event.target.complete();
      },
      error: () => event.target.complete(),
    });
  }

  openCategory(c: Category) {
    this.navCtrl.navigateForward(`/categories/${c.id}`);
  }

  editCategory(c: Category) {
    this.navCtrl.navigateForward(`/categories/edit/${c.id}`);
  }

  async confirmDelete(c: Category) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `Deseja excluir a categoria <strong>${c.name}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => this.deleteCategory(c.id!),
          cssClass: 'danger'
        }
      ]
    });
    await alert.present();
  }

  deleteCategory(id: number) {
    this.api.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(tr => tr.id !== id);
      },
      error: (err) => console.error('Erro ao excluir:', err)
    });
  }

}
