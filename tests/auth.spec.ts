import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('Admin can login successfully', async ({ page }) => {
    await page.fill('input[name="email"]', 'admin@eduplus.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should be redirected to portal
    await expect(page).toHaveURL(/.*portal/);
    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Instructors', exact: true })).toBeVisible();
    await expect(page.getByText('Total Courses')).toBeVisible();
  });

  test('Instructor can login successfully', async ({ page }) => {
    await page.fill('input[name="email"]', 'john.smith@eduplus.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*portal/);
    await expect(page.locator('text=My Courses')).toBeVisible();
    await expect(page.locator('text=Submissions to Grade')).toBeVisible();
  });

  test('Student can login successfully', async ({ page }) => {
    await page.fill('input[name="email"]', 'alice@student.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*portal/);
    await expect(page.getByText('Upcoming Deadlines')).toBeVisible();
    await expect(page.getByText('Average Grade')).toBeVisible();
  });

  test('Show error on invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'wrong@user.com');
    await page.fill('input[name="password"]', 'wrongpass123');
    await page.click('button[type="submit"]');
    
    // Check for error message
    const errorMsg = page.getByText('Invalid email or password');
    await expect(errorMsg).toBeVisible();
  });

  test('Student registration flow', async ({ page }) => {
    await page.goto('/auth/register');
    
    const testEmail = `newstudent_${Date.now()}@test.com`;
    await page.fill('input[name="name"]', 'New Student');
    await page.fill('input[name="email"]', testEmail);
    // Password must have special char
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Redirects directly to portal for auto-login
    await expect(page).toHaveURL(/.*portal/);
    await expect(page.getByText('Average Grade')).toBeVisible();
  });
});
