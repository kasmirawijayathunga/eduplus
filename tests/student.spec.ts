import { test, expect } from '@playwright/test';

test.describe('Student Flow', () => {
  
  test('Student can enroll in a course', async ({ page }) => {
    // Login as Charlie
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'charlie@student.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*portal/);

    await page.getByRole('link', { name: 'Courses', exact: true }).click();
    await expect(page).toHaveURL(/.*portal\/courses/);

    // Charlie is not in CS101, so he should see "Enroll Now"
    const cs101Card = page.locator('.group').filter({ hasText: 'CS101' });
    await expect(cs101Card.getByRole('button', { name: 'Enroll Now' })).toBeVisible();

    await cs101Card.getByRole('button', { name: 'Enroll Now' }).click();

    // Now it should show "Go to Course"
    await expect(cs101Card.getByRole('link', { name: 'Go to Course' })).toBeVisible();
  });

  test('Student can submit an assignment', async ({ page }) => {
    // Use a FRESH student to ensure no "already submitted" remnants
    await page.goto('/auth/register');
    const freshEmail = `submit_student_${Date.now()}@test.com`;
    await page.fill('input[name="name"]', 'Submit Student');
    await page.fill('input[name="email"]', freshEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*portal/);

    // Enroll in CS302 first (since it's a new student)
    await page.getByRole('link', { name: 'Courses', exact: true }).click();
    const cs302Card = page.locator('.group').filter({ hasText: 'CS302' });
    await cs302Card.getByRole('button', { name: 'Enroll Now' }).click();
    await cs302Card.getByRole('link', { name: 'Go to Course' }).click();

    // Wait for course page to load
    await expect(page.locator('h1:has-text("Advanced Web Development")')).toBeVisible();

    // Find React Components Project assignment box
    const assignmentBox = page.locator('.bg-white').filter({ hasText: 'React Components Project' });
    
    // Verify we can submit (textarea should be visible for new enrollment)
    await expect(assignmentBox.locator('textarea[name="content"]')).toBeVisible();

    // Submit it
    const submissionContent = `Fresh Student's Project Submission ${Date.now()}`;
    await assignmentBox.locator('textarea[name="content"]').fill(submissionContent);
    await assignmentBox.getByRole('button', { name: 'Submit Assignment' }).click();

    // Wait for page to update and verify submission appears
    await expect(page.locator(`text=${submissionContent}`)).toBeVisible({ timeout: 10000 });
  });

  test('Student can view announcements', async ({ page }) => {
    // Login as Charlie
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'charlie@student.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.getByRole('link', { name: 'Announcements', exact: true }).click();
    await expect(page).toHaveURL(/.*portal\/announcements/);

    // Should see announcements for enrolled courses
    await expect(page.locator('text=Course Announcements')).toBeVisible();
    // Assuming CS302 has an announcement
    await expect(page.locator('text=CS302')).toBeVisible();
  });
});
