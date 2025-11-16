import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { ApiService, Category, User } from './services/api';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  username: string = '';
  token: string = '';
  user: any;
  categories: Category[] = [];

  public appPages = [
    { title: 'Home', url: '/index', icon: 'home' },
    { title: 'Transactions', url: '/transactions', icon: 'swap-horizontal' },
    { title: 'Categories', url: '/categories', icon: 'pricetags' },
    { title: 'Goals', url: '/goals', icon: 'trophy' },
    { title: 'Profile', url: '/user', icon: 'person-circle' },
    { title: 'Logout', url: '/logout', icon: 'log-out' },
  ];
  constructor(
    private tokenStorage: TokenStorageService,
    private api: ApiService
  ) {}

  async ngOnInit() {
    this.token = (await this.tokenStorage.getToken()) || '';
    this.username = this.tokenStorage.getUsernameSync() || '';
    this.loadCategories();
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
        error: (err) => {
          console.error('Error loading categories:', err);
        },
      });
  }
}
