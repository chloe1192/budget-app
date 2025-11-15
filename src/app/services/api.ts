import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface User {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  avatar?: File | null;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface Transaction {
  id?: number;
  description: string;
  amount: number;
  date: string;
  category_id: number;
}

export interface Goal {
  id?: number;
  title: string;
  description: string;
  date: string;
  amount: number;
  user?: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Token ${token || ''}`,
    });
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/me/`, {
      headers: this.getAuthHeaders(),
    });
  }

  loginUser(credentials: {
    username: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login/`, credentials);
  }

  // Criacao de usuario
  createUser(user: User): Observable<any> {
    if (user.avatar) {
      const formData = new FormData();
      formData.append('first_name', user.first_name);
      formData.append('last_name', user.last_name);
      formData.append('username', user.username);
      formData.append('email', user.email);
      formData.append('password', user.password);
      formData.append('avatar', user.avatar);

      return this.http.post(`${this.apiUrl}/user/create/`, formData);
    }

    return this.http.post(`${this.apiUrl}/user/create/`, {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }

  // categories
  createCategory(data: { name: string; color: string; type: string }) {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/categories/create/`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateCategory(
    id: number,
    data: { name: string; color: string; type: string }
  ) {
    return this.http.put(`${this.apiUrl}/categories/${id}/`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteCategory(id: number): Observable<Category[]> {
    return this.http.delete<Category[]>(`${this.apiUrl}/categories/${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  // transactions
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/`, {
      headers: this.getAuthHeaders(),
    });
  }

  createTransaction(data: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/transactions/create`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  updateTransaction(
    id: number,
    data: {
      description: string;
      amount: number;
      date: string;
      category_id: number;
    }
  ) {
    return this.http.put(`${this.apiUrl}/transactions/${id}/`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteTransaction(id: number): Observable<Transaction[]> {
    return this.http.delete<Transaction[]>(
      `${this.apiUrl}/transactions/${id}/`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Goals
  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/`, {
      headers: this.getAuthHeaders(),
    });
  }

  createGoal(data: {
    title: string;
    description: string;
    date: string;
  }): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals/create/`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  updateGoal(
    id: number,
    data: { title: string; description: string; date: string }
  ): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/goals/${id}/`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteGoal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/goals/${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }
}
