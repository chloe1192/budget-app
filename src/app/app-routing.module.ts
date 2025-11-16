import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  // Core pages
  {
    path: 'index',
    loadChildren: () =>
      import('./pages/core/index/index.module').then((m) => m.IndexPageModule),
  },
  {
    path: 'loader',
    loadChildren: () =>
      import('./pages/core/loader/loader.module').then((m) => m.LoaderPageModule),
  },
  // Auth pages
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'logout',
    loadChildren: () =>
      import('./pages/auth/logout/logout.module').then((m) => m.LogoutPageModule),
  },
  // User pages
  {
    path: 'user',
    loadChildren: () =>
      import('./pages/user/user/user.module').then((m) => m.UserPageModule),
  },
  {
    path: 'user/edit',
    loadChildren: () =>
      import('./pages/user/edit-user/edit-user.module').then(
        (m) => m.EditUserPageModule
      ),
  },
  // Category pages
  {
    path: 'categories',
    loadChildren: () =>
      import('./pages/categories/categories/categories.module').then(
        (m) => m.CategoriesPageModule
      ),
  },
  {
    path: 'categories/create',
    loadChildren: () =>
      import('./pages/categories/create/create-category.module').then(
        (m) => m.CreateCategoryPageModule
      ),
  },
  {
    path: 'categories/edit',
    loadChildren: () =>
      import('./pages/categories/edit/edit-category.module').then(
        (m) => m.EditCategoryPageModule
      ),
  },
  // Transaction pages
  {
    path: 'transactions',
    loadChildren: () =>
      import('./pages/transactions/transactions/transactions.module').then(
        (m) => m.TransactionsPageModule
      ),
  },
  {
    path: 'transactions/create',
    loadChildren: () =>
      import('./pages/transactions/create/create-transaction.module').then(
        (m) => m.CreateTransactionPageModule
      ),
  },
  {
    path: 'transactions/edit',
    loadChildren: () =>
      import('./pages/transactions/edit/edit-transaction.module').then(
        (m) => m.EditTransactionPageModule
      ),
  },
  // Goal pages
  {
    path: 'goals',
    loadChildren: () =>
      import('./pages/goals/goals/goals.module').then((m) => m.GoalsPageModule),
  },
  {
    path: 'goals/create',
    loadChildren: () =>
      import('./pages/goals/create/create-goal.module').then(
        (m) => m.CreateGoalPageModule
      ),
  },
  {
    path: 'goals/edit',
    loadChildren: () =>
      import('./pages/goals/edit/edit-goal.module').then(
        (m) => m.EditGoalPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
