import { test, expect } from '@playwright/test';

test.describe('Instructor Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as Instructor
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'john.smith@eduplus.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*portal/);
  });

  test('Instructor can manage assignments', async ({ page }) => {
    await page.getByRole('link', { name: 'Courses', exact: true }).click();
    await expect(page).toHaveURL(/.*portal\/courses/);

    // Go to CS101 detail
    await page.locator('.bg-white').filter({ hasText: 'CS101' }).getByText('Manage Course & Assignments').click();
    
    // Create new assignment
    const assignmentTitle = `New Test Assignment ${Date.now()}`;
    const form = page.locator('#new-assignment-form');
    await form.locator('input[name="title"]').fill(assignmentTitle);
    await form.locator('textarea[name="description"]').fill('Assignment description by E2E test.');
    await form.getByRole('button', { name: 'Post Assignment' }).click();

    await expect(page.locator(`text=${assignmentTitle}`)).toBeVisible();

    // Delete assignment
    const assignmentRow = page.locator('.bg-white').filter({ hasText: assignmentTitle });
    await assignmentRow.getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator(`text=${assignmentTitle}`)).not.toBeVisible();
  });

  test('Instructor can grade submissions', async ({ page }) => {
    await page.getByRole('link', { name: 'Courses', exact: true }).click();
    await page.locator('.bg-white').filter({ hasText: 'CS101' }).getByText('Manage Course & Assignments').click();

    // Go to Logic Gates Homework submissions
    const logicGatesRow = page.locator('.bg-white').filter({ hasText: 'Logic Gates Homework' });
    await logicGatesRow.getByText('View Submissions').click();

    // Find Alice's submission (Pending/Submitted)
    const aliceRow = page.locator('tr').filter({ hasText: 'Alice Johnson' });
    // Use exact text match for status bit to avoid strict mode violation
    await expect(aliceRow.locator('span:text-is("Submitted")')).toBeVisible();

    // Grade it
    await aliceRow.locator('input[name="grade"]').fill('88');
    await aliceRow.getByRole('button', { name: 'Save' }).click();

    // Should now be graded
    await expect(aliceRow.locator('span:text-is("Graded")')).toBeVisible();
    await expect(aliceRow.locator('input[name="grade"]')).toHaveValue('88');
  });

  test('Instructor can manage announcements', async ({ page }) => {
    await page.getByRole('link', { name: 'Announcements', exact: true }).click();
    await expect(page).toHaveURL(/.*portal\/announcements/);

    // Create announcement
    const annTitle = `Important Update ${Date.now()}`;
    await page.selectOption('select[name="courseId"]', { label: 'CS101 - Introduction to Computer Science' });
    await page.locator('input[name="title"]').fill(annTitle);
    await page.locator('textarea[name="content"]').fill('Please check the new materials on the dashboard.');
    await page.getByRole('button', { name: 'Post Announcement' }).click();

    // Reload to see new announcement if needed (Server action revalidates, but sometimes browser needs a kick)
    await page.reload();
    await expect(page.locator(`text=${annTitle}`)).toBeVisible();

    // Delete announcement
    const annBox = page.locator('.bg-white').filter({ hasText: annTitle });
    await annBox.getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator(`text=${annTitle}`)).not.toBeVisible();
  });
});
