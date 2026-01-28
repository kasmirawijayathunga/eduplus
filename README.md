# EduPlus - Learning Management System

A comprehensive Learning Management System built with Next.js, featuring role-based access control for Admins, Instructors, and Students.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Default Credentials](#default-credentials)

## ✨ Features

### Admin Portal
- User management (Create, Read, Update, Delete)
- Course management (CRUD operations)
- System-wide analytics and reporting
- Instructor assignment to courses

### Instructor Portal
- Course and assignment management
- Student submission grading
- Announcement broadcasting
- Course analytics

### Student Portal
- Course enrollment
- Assignment submission
- Grade viewing
- Announcement notifications
- Profile management

## 🛠 Tech Stack

- **Framework:** Next.js 16.1.3 (App Router)
- **Language:** TypeScript 5.x
- **Database:** MySQL with Prisma ORM 5.10.0
- **Authentication:** JWT with HTTP-only cookies
- **Styling:** Tailwind CSS 4.x
- **Testing:** Playwright 1.58.0
- **UI Components:** Lucide React icons
- **Password Hashing:** bcrypt 6.0.0

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** v22.18.0 or higher
- **pnpm:** v10.26.0 (recommended) or npm/yarn
- **MySQL:** 5.7+ or 8.0+ (or compatible database like MariaDB)
- **Git:** Latest version

### Verified Environment

This application has been developed and tested on:

- **OS:** macOS (also compatible with Windows and Linux)
- **Node.js:** v22.18.0
- **pnpm:** v10.26.0
- **MySQL:** 8.0+ (via MAMP/local installation)
- **Browser:** Chrome/Chromium (for E2E tests)

## 🔧 Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eduplus-app
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# System Configuration
SYSTEM_DOMAIN=localhost:3000
SYSTEM_TIMEZONE=+05:30

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=eduplus
DB_PORT=3306
DB_URL=mysql://root:your_mysql_password@localhost:3306/eduplus

# JWT Configuration
JWT_SECRET=your_secure_random_secret_key_here
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
```

**Important:** Replace `your_mysql_password` and `JWT_SECRET` with your actual values.

To generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🗄 Database Setup

### 1. Create Database

```bash
mysql -u root -p
CREATE DATABASE eduplus;
EXIT;
```

### 2. Run Prisma Migrations

```bash
npx prisma generate
npx prisma db push
```

### 3. Seed the Database

```bash
npx prisma db seed
```

This will create:
- 1 Admin user
- 2 Instructor users
- 3 Student users
- Sample courses, assignments, and announcements

## 🚀 Running the Application

### Development Mode

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `pnpm dev` | Starts the development server with hot reload |
| **build** | `pnpm build` | Creates an optimized production build |
| **start** | `pnpm start` | Runs the production server (requires build first) |
| **lint** | `pnpm lint` | Runs ESLint to check code quality |
| **test:e2e** | `pnpm test:e2e` | Runs Playwright E2E tests |

### Additional Useful Commands

```bash
# Database Management
npx prisma studio              # Open Prisma Studio (database GUI)
npx prisma db seed             # Seed the database with dummy data
node prisma/clear.js           # Clear all database tables

# Testing
npx playwright test                    # Run all E2E tests
npx playwright test --ui               # Run tests in UI mode
npx playwright test tests/auth.spec.ts # Run specific test file
npx playwright show-report             # View last test report

# Full Test Suite (with clean database)
node prisma/clear.js && npx prisma db seed && npx playwright test
```

## 🧪 Testing

### E2E Test Suite

The application includes a comprehensive E2E test suite with **15 tests** covering:

- **Authentication:** Login, registration, error handling (5 tests)
- **Admin:** User and course CRUD operations (2 tests)
- **Instructor:** Assignment management, grading, announcements (3 tests)
- **Student:** Enrollment, submissions, announcements (3 tests)
- **Profile:** Profile updates, notification settings (2 tests)

### Running Tests

```bash
# Run all tests
pnpm test:e2e

# Run tests with UI
npx playwright test --ui

# Run specific test file
npx playwright test tests/student.spec.ts

# Run with clean database state
node prisma/clear.js && npx prisma db seed && npx playwright test
```

### Test Configuration

- **Workers:** 1 (for database state isolation)
- **Timeout:** 60 seconds per test
- **Browser:** Chromium
- **Screenshots:** Captured on failure
- **Traces:** Captured on first retry

## 📁 Project Structure

```
eduplus-app/
├── app/                      # Next.js App Router
│   ├── auth/                # Authentication pages
│   ├── portal/              # Role-based portals
│   │   ├── @admin/         # Admin portal (parallel route)
│   │   ├── @instructor/    # Instructor portal (parallel route)
│   │   └── (student)/      # Student portal (route group)
│   └── profile/            # User profile page
├── components/              # Reusable React components
├── config/                  # Configuration files
├── lib/                     # Utility functions and helpers
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma       # Prisma schema
│   ├── seed.ts             # Database seeding script
│   └── clear.js            # Database clearing script
├── services/                # Business logic and services
├── tests/                   # E2E test files
│   ├── auth.spec.ts
│   ├── admin.spec.ts
│   ├── instructor.spec.ts
│   ├── student.spec.ts
│   └── profile.spec.ts
├── .env                     # Environment variables
├── playwright.config.ts     # Playwright configuration
└── package.json            # Dependencies and scripts
```

## 🔑 Default Credentials

After running `npx prisma db seed`, you can log in with:

### Admin
- **Email:** admin@eduplus.com
- **Password:** password123

### Instructors
- **Email:** john.smith@eduplus.com
- **Password:** password123

- **Email:** sarah.doe@eduplus.com
- **Password:** password123

### Students
- **Email:** alice@student.com
- **Password:** password123

- **Email:** bob@student.com
- **Password:** password123

- **Email:** charlie@student.com
- **Password:** password123

## 🔒 Security Notes

- All passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens are stored in HTTP-only cookies
- Session management with automatic token refresh
- Role-based access control (RBAC) for all routes
- Input validation using Zod schemas

## 🐛 Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Ensure MySQL is running
2. Verify credentials in `.env` file
3. Check if the database exists: `mysql -u root -p -e "SHOW DATABASES;"`
4. Update the `DB_URL` connection string format

### Port Already in Use

If port 3000 is already in use:

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 pnpm dev
```

### Prisma Client Issues

If you encounter Prisma client errors:

```bash
npx prisma generate
npx prisma db push
```

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js and Prisma
