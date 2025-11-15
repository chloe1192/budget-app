import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent implements OnInit {
  username: string = '';
  token: string = '';

  public appPages = [
    { title: 'Loader', url: '/loader', icon: 'refresh' },
    { title: 'Create Category', url: '/create-category', icon: 'add' },
    { title: 'Categories', url: '/categories', icon: 'list' },
    { title: 'Transactions', url: '/transactions', icon: 'cash' },
    { title: 'Goals', url: '/goals', icon: 'balloon' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}

  async ngOnInit() {
    this.token = localStorage.getItem('token') || '';
    this.username = localStorage.getItem('username') || '';
    console.log('🌟 AppComponent ngOnInit');
    console.log('✅ DataService.initDb() finalizado');
  }
}
