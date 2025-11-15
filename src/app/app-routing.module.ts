import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: 'index',
    loadChildren: () =>
      import('./pages/index/index.module').then((m) => m.IndexPageModule),
  },
  {
    path: 'loader',
    loadChildren: () =>
      import('./pages/loader/loader.module').then((m) => m.LoaderPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'index',
    loadChildren: () =>
      import('./pages/index/index.module').then((m) => m.IndexPageModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./pages/user/user.module').then((m) => m.UserPageModule),
  },
  {
    path: 'user/edit',
    loadChildren: () =>
      import('./pages/edit-user/edit-user.module').then(
        (m) => m.EditUserPageModule
      ),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./pages/categories/categories.module').then(
        (m) => m.CategoriesPageModule
      ),
  },
  {
    path: 'categories/create',
    loadChildren: () =>
      import('./pages/create-category/create-category.module').then(
        (m) => m.CreateCategoryPageModule
      ),
  },
  {
    path: 'categories/edit',
    loadChildren: () =>
      import('./pages/edit-category/edit-category.module').then(
        (m) => m.EditCategoryPageModule
      ),
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./pages/transactions/transactions.module').then(
        (m) => m.TransactionsPageModule
      ),
  },
  {
    path: 'transactions/create',
    loadChildren: () =>
      import('./pages/create-transaction/create-transaction.module').then(
        (m) => m.CreateTransactionPageModule
      ),
  },
  {
    path: 'transactions/edit',
    loadChildren: () =>
      import('./pages/edit-transaction/edit-transaction.module').then(
        (m) => m.EditTransactionPageModule
      ),
  },
  {
    path: 'goals',
    loadChildren: () =>
      import('./pages/goals/goals.module').then((m) => m.GoalsPageModule),
  },
  {
    path: 'goals/create',
    loadChildren: () =>
      import('./pages/create-goal/create-goal.module').then(
        (m) => m.CreateGoalPageModule
      ),
  },
  {
    path: 'goals/edit',
    loadChildren: () =>
      import('./pages/edit-goal/edit-goal.module').then(
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
