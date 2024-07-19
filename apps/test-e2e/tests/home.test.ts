import { test, expect } from '@playwright/test';

test('As a user, I see the home page', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await expect(page.getByRole('heading', { name: 'Welcome to Remix with Material UI' })).toBeVisible();
});
