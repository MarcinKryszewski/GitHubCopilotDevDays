import { test, expect } from '@playwright/test';

test.describe('Strona główna', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('wyświetla poprawny tytuł strony', async ({ page }) => {
    await expect(page).toHaveTitle('Tailspin Toys - Wesprzyj swoją nową ulubioną grę!');
  });

  test('wyświetla główny nagłówek', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Witaj w Tailspin Toys', exact: true })).toBeVisible();
  });

  test('wyświetla nazwę serwisu w nagłówku strony', async ({ page }) => {
    // Nazwa serwisu jest w nagłówku (to już nie jest h1)
    await expect(page.getByText('Tailspin Toys').first()).toBeVisible();
  });

  test('wyświetla hasło powitalne', async ({ page }) => {
    await expect(page.getByText('Znajdź swoją następną grę. A może nawet ją wesprzesz? Przejrzyj naszą kolekcję!')).toBeVisible();
  });
});
