import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface User {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  avatar?: File | null;
  total_balance?: number;
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
  category: Category;
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

export interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;
  private readonly RETRY_COUNT = 1; // Retry failed requests once
  private readonly TIMEOUT_MS = 30000;

  constructor(private http: HttpClient) {}

  /**
   * Global error handler for API calls.
   * Logs errors and returns a user-friendly error observable.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMsg = `Server error: ${error.status} ${error.statusText}`;
      if (error.error?.detail) {
        errorMsg = error.error.detail;
      }
    }

    console.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }

  /**
   * Retrieve the currently authenticated user's profile.
   * - Uses `GET /user/me/` on the backend.
   * - Retries once on transient failures.
   * @returns Observable<User> containing user details
   */
  fetchUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/me/`).pipe(
      retry(this.RETRY_COUNT),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Authenticate a user and return a token + basic user info.
   * - POST `/user/login/` with `{ username, password }`.
   * - Caller should persist `response.token` using the token storage service.
   * @param credentials Object with `username` and `password` properties
   * @returns Observable<LoginResponse> with `token` and `user` fields
   */
  loginUser(credentials: {
    username: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/user/login/`, credentials).pipe(
      tap((response) => {
        console.log(`User ${response.user.username} logged in successfully`);
      }),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Create a new user account.
   * - If `user.avatar` is provided, the request is sent as `FormData` so files upload correctly.
   * - POST `/user/create/` returns the created user object.
   * @param user User payload containing at minimum `username`, `email`, and `password`.
   * @returns Observable<User> created user
   */
  // Create user
  addUser(user: User): Observable<User> {
    if (user.avatar) {
      const formData = new FormData();
      formData.append('first_name', user.first_name);
      formData.append('last_name', user.last_name);
      formData.append('username', user.username);
      formData.append('email', user.email);
      formData.append('password', user.password);
      formData.append('avatar', user.avatar);

      return this.http.post<User>(`${this.apiUrl}/user/create/`, formData).pipe(
        catchError((err) => this.handleError(err))
      );
    }

    return this.http.post<User>(`${this.apiUrl}/user/create/`, {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      password: user.password,
    }).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Create a category for the authenticated user.
   * @param data Object with `name`, `color`, and `type` ('INCOME'|'EXPENSE')
   * @returns Observable<Category> created category
   */
  // Categories
  addCategory(data: { name: string; color: string; type: string }): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories/create/`, data).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Update an existing category.
   * @param id Category id
   * @param data Partial category payload to update
   * @returns Observable<Category> updated category
   */
  editCategory(
    id: number,
    data: { name: string; color: string; type: string }
  ): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}/`, data).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Delete a category by id.
   * @param id Category id to delete
   * @returns Observable<void>
   */
  removeCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}/`).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Retrieve transactions for the authenticated user.
   * Retries once on transient errors.
   * @returns Observable<Transaction[]> list of transactions
   */
  // Transactions (use fetchList())

  /**
   * Create a transaction.
   * @param data Transaction payload (description, amount, date, category_id)
   * @returns Observable<Transaction> created transaction
   */
  addTransaction(data: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/transactions/create`,
      data
    ).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Update a transaction.
   * @param id Transaction id
   * @param data Updated transaction fields
   * @returns Observable<Transaction> updated transaction
   */
  editTransaction(
    id: number,
    data: {
      description: string;
      amount: number;
      date: string;
      category_id: number;
    }
  ): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/transactions/${id}/`, data).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Delete a transaction by id.
   * @param id Transaction id to delete
   * @returns Observable<void>
   */
  removeTransaction(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/transactions/${id}/`
    ).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Retrieve user goals.
   * Retries once on transient errors.
   * @returns Observable<Goal[]> list of goals
   */
  // Goals (use fetchList())

  // Generic list fetcher for categories, transactions, and goals.
  fetchList<T>(
    resource: 'categories' | 'transactions' | 'goals',
    options?: {
      paginated?: boolean;
      params?: Record<string, string | number | boolean | null | undefined>;
    }
  ): Observable<T[]>;
  fetchList<T>(
    resource: 'categories' | 'transactions' | 'goals',
    options: { paginated: true; params?: Record<string, string | number | boolean | null | undefined> }
  ): Observable<PaginatedResponse<T>>;
  fetchList<T>(
    resource: 'categories' | 'transactions' | 'goals',
    options?: { paginated?: boolean; params?: Record<string, string | number | boolean | null | undefined> }
  ): Observable<T[] | PaginatedResponse<T>> {
    const url = `${this.apiUrl}/${resource}/`;
    let httpParams = new HttpParams();
    if (options?.paginated) {
      httpParams = httpParams.set('paginate', 'true');
    }
    if (options?.params) {
      Object.entries(options.params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          httpParams = httpParams.set(k, String(v));
        }
      });
    }

    return this.http.get<any>(url, { params: httpParams }).pipe(
      retry(this.RETRY_COUNT),
      map((res) => {
        if (options?.paginated) {
          if (Array.isArray(res)) {
            return { results: res } as PaginatedResponse<T>;
          }
          return (res ?? { results: [] }) as PaginatedResponse<T>;
        }
        if (Array.isArray(res)) {
          return res as T[];
        }
        return (res?.results ?? []) as T[];
      }),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Create a new financial goal.
   * @param data Goal payload containing `title`, `description`, and `date`
   * @returns Observable<Goal> created goal
   */
  addGoal(data: {
    title: string;
    description: string;
    date: string;
  }): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals/create/`, data).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Update an existing goal.
   * @param id Goal id
   * @param data Updated goal fields
   * @returns Observable<Goal> updated goal
   */
  editGoal(
    id: number,
    data: { title: string; description: string; date: string }
  ): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/goals/${id}/`, data).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Delete a goal by id.
   * @param id Goal id to delete
   * @returns Observable<void>
   */
  removeGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/goals/${id}/`).pipe(
      catchError((err) => this.handleError(err))
    );
  }
}
