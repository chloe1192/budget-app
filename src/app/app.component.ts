import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { ApiService, Category, User } from './services/api';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnChanges {
  username: string = '';
  token: string = '';
  user: User | null = null;
  categories: Category[] = [];
  public appPages: any;
  constructor(
    private tokenStorage: TokenStorageService,
    private api: ApiService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.token = (await this.tokenStorage.getToken()) || '';
    this.username = this.tokenStorage.getUsernameSync() || '';
    this.loadUser();
  }
  async ngOnChanges() {
    this.ngOnInit()
  }
  trackPage(index: number, item: { title: string; url: string; icon: string }) {
    return item.url;
  }

  trackLabel(index: number, item: string) {
    return item;
  }

  loadCategories() {
    this.api
      .fetchList('categories', {
        paginated: false,
        params: {
          ordering: 'name',
          page_size: 5,
          sort_by: 'transactions_count',
        },
      })
      .subscribe({
        next: (res) => {
          console.log('Categories loaded:', res);
          this.categories = res as Category[];
        },
        error: async (err) => {
          console.error('Error loading categories:', err);
          const toast = await this.toastCtrl.create({
            message: "Fail to load categories",
            duration: 2000,
            color: "danger"
          })
          await toast.present()
        },
      });
  }

  loadAppPages() {
    this.appPages = [
      { title: 'Home', url: '/index', icon: 'home' },
      { title: 'Transactions', url: '/transactions', icon: 'swap-horizontal' },
      { title: 'Categories', url: '/categories', icon: 'pricetags' },
      { title: 'Goals', url: '/goals', icon: 'trophy' },
      { title: 'Profile', url: '/user', icon: 'person-circle' },
      { title: 'Logout', url: '/logout', icon: 'log-out' },
    ];
  }

  loadUser(){
    if (this.token != "") {
      this.api.fetchUser().subscribe({
        next: (res) => {
          this.user = res as User;
          this.loadCategories()
          this.loadAppPages()
        },
        error: async (err) => {
          const toast = await this.toastCtrl.create({
            message: "Failed to load user data",
            duration: 2000,
            color: "danger"
          })
          await toast.present()
        }
      })
    }
  }
}
