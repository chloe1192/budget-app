# Personal Finance Management App

A cross-platform mobile application built with Angular and Ionic Framework for managing personal finances. This frontend application provides an intuitive interface for tracking expenses, managing budgets, and monitoring financial goals with a modern dark theme design.

Disclaimer: This app/api is not made with any intention of going in production and host any real user data, it is for learning purposes only.

## Features

> **Note**: Some features are still in development. See [Roadmap](#roadmap) section below.

- **User Authentication** - Registration and login with secure token storage
- **Dashboard** - Overview of balance and recent transactions
- **Transaction Management** - Add, edit, and delete income/expense transactions
- **Category Management** - Organize transactions with customizable categories
- **Financial Goals** - Set and track progress toward savings goals
- **Responsive Design** - Mobile-first approach with Ionic components
- **Form Validation** - Client-side validation with error feedback
- **Toast Notifications** - User feedback for actions and errors

## Roadmap

Features in development and planned:
- [ ] Transaction filtering and search
- [ ] Budget limits with visual indicators
- [ ] Recurring transaction templates
- [ ] Charts and analytics dashboard
- [ ] Export data (CSV, PDF)
- [ ] Multi-currency display
- [ ] Push notifications
- [ ] Dark/light theme toggle

## Tech Stack

- **Framework**: [Angular 17](https://angular.io/)
- **UI Framework**: [Ionic 8](https://ionicframework.com/)
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/)
- **Styling**: SCSS with custom theming
- **HTTP Client**: Angular HttpClient with interceptors
- **Forms**: Reactive Forms with validation
- **Storage**: Ionic Storage for token persistence

## Prerequisites

- Node.js 18+
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)
- Ionic CLI (`npm install -g @ionic/cli`)
- Backend API running (see [budget_api](https://github.com/yourusername/budget_api))

## Getting Started

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd budget_app/budget-app

# Install dependencies
npm install
