import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Abalawe/);
});

test('can navigate to products', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Shop Now');
    await expect(page).toHaveURL(/.*products/);
});
