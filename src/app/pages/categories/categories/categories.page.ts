import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
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
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loadCategories(params);
    });
  }

  loadCategories(params: any = {}) {
    const apiParams: any = {};
    if (params.id) apiParams.id = params.id;
    if (params.type) apiParams.type = params.type;
    if (params.q) apiParams.q = params.q;
    
    this.api.fetchList<Category>('categories', { paginated: false, params: apiParams }).subscribe(
      (res: Category[]) => {
        this.categories = res;
        console.log(this.categories)
      },
      (err: any) => {
        console.log(err.error);
        alert(err.error)
      }
    )
  }
   doRefresh(event: any) {
    this.route.queryParams.subscribe(params => {
      this.loadCategories(params);
      event.target.complete();
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
          handler: () => this.removeCategory(c.id!),
          cssClass: 'danger'
        }
      ]
    });
    await alert.present();
  }

  removeCategory(id: number) {
    this.api.removeCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(tr => tr.id !== id);
      },
      error: (err) => console.error('Erro ao excluir:', err)
    });
  }

}
