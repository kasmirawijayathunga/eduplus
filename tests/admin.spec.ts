import { test, expect } from '@playwright/test';

test.describe('Admin Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as Admin
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@eduplus.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*portal/);
  });

  test('Admin can manage users (CRUD)', async ({ page }) => {
    // Navigate to Users via header or dashboard card
    await page.getByRole('link', { name: 'Users', exact: true }).click();
    await expect(page).toHaveURL(/.*portal\/users/);

    // Create a new user
    await page.getByRole('link', { name: 'Add User' }).click();
    await expect(page).toHaveURL(/.*portal\/users\/new/);
    
    const testEmail = `admin_test_user_${Date.now()}@test.com`;
    await page.fill('input[name="name"]', 'Admin Test User');
    await page.fill('input[name="email"]', testEmail);
    // password is not in the form for creation as per server action (it uses a default)
    // Wait, let's check createUser action in portal/actions.ts
    // It takes { name, email, role }
    await page.selectOption('select[name="role"]', 'STUDENT');
    await page.click('button[type="submit"]');

    // Should be back on users list
    await expect(page).toHaveURL(/.*portal\/users/);
    await expect(page.locator(`text=${testEmail}`)).toBeVisible();

    // Edit the user
    const userRow = page.locator('tr').filter({ hasText: testEmail });
    await userRow.getByRole('link', { name: 'Edit' }).click();
    
    await page.fill('input[name="name"]', 'Admin Test User Updated');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*portal\/users/);
    await expect(page.locator('text=Admin Test User Updated')).toBeVisible();

    // Delete the user
    await userRow.getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator(`text=${testEmail}`)).not.toBeVisible();
  });

  test('Admin can manage courses (CRUD)', async ({ page }) => {
    await page.getByRole('link', { name: 'Courses', exact: true }).click();
    await expect(page).toHaveURL(/.*portal\/courses/);

    // Create a course
    await page.getByRole('link', { name: 'Create New Course' }).click();
    await expect(page).toHaveURL(/.*portal\/courses\/new/);
    
    const courseCode = `TEST${Math.floor(Math.random() * 1000)}`;
    await page.fill('input[name="title"]', 'Admin Test Course');
    await page.fill('input[name="code"]', courseCode);
    await page.fill('textarea[name="description"]', 'This is a test course created by E2E test.');
    // Instructor selection
    await page.selectOption('select[name="instructorId"]', { label: 'Dr. John Smith' });
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*portal\/courses/);
    await expect(page.locator(`text=${courseCode}`)).toBeVisible();

    // Edit Course
    const courseCard = page.locator('.bg-white').filter({ hasText: courseCode });
    await courseCard.getByRole('link', { name: 'Edit' }).click();
    
    await page.fill('input[name="title"]', 'Admin Test Course Updated');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*portal\/courses/);
    await expect(page.locator('text=Admin Test Course Updated')).toBeVisible();

    // Delete Course
    await courseCard.getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator(`text=${courseCode}`)).not.toBeVisible();
  });
});
