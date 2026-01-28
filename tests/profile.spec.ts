import { test, expect } from '@playwright/test';

test.describe('Profile Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as Student (Alice)
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'alice@student.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*portal/);
  });

  test('User can update profile details', async ({ page }) => {
    // Navigate to Profile
    await page.click('a[title="My Profile"]');
    await expect(page).toHaveURL(/.*profile/);

    const newName = `Alice Updated ${Date.now()}`;
    await page.fill('input[name="name"]', newName);
    await page.click('button:has-text("Save Changes")');

    // Button might stay disabled for a bit while saving
    // Check if updated in the form
    await expect(page.locator('input[name="name"]')).toHaveValue(newName);
    
    // Check if it persisted after reload
    await page.reload();
    await expect(page.locator('input[name="name"]')).toHaveValue(newName);
  });

  test('User can update notification settings', async ({ page }) => {
    await page.click('a[title="My Profile"]');
    
    // Toggle a setting using the ID for absolute precision
    const assignmentCheckbox = page.locator('input#notify-assignments');
    await expect(assignmentCheckbox).toBeVisible();
    
    const initialState = await assignmentCheckbox.isChecked();
    
    // Click the label or the checkbox
    await page.locator('label[for="notify-assignments"]').click();
    
    const newState = await assignmentCheckbox.isChecked();
    expect(newState).toBe(!initialState);
    
    // Check persistence after reload
    await page.reload();
    const persistedState = await page.locator('input#notify-assignments').isChecked();
    expect(persistedState).toBe(newState);
  });
});
