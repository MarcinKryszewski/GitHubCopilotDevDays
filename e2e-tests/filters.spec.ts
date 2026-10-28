import { test, expect } from '@playwright/test';

test.describe('Filtrowanie katalogu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('filtruje gry po jednej i wielu kategoriach z obsługą klawiatury i stanem koloru', async ({ page }) => {
    const strategyFilter = page.getByRole('button', { name: 'Strategia' });
    const actionFilter = page.getByRole('button', { name: 'Akcja' });
    const visibleCards = page.locator('[data-testid="game-card"]:visible');

    await test.step('Wybierz kategorię klawiaturą', async () => {
      await strategyFilter.focus();
      await page.keyboard.press('Space');
      await expect(strategyFilter).toHaveAttribute('aria-pressed', 'true');
      await expect(strategyFilter).toHaveClass(/bg-blue-600/);
      await expect(strategyFilter).toHaveAttribute('data-testid', /^category-filter-\d+$/);
      await expect(visibleCards).toHaveCount(4);
    });

    await test.step('Zawęź wyniki do gier z obiema kategoriami', async () => {
      await actionFilter.click();
      await expect(actionFilter).toHaveAttribute('aria-pressed', 'true');
      await expect(visibleCards).toHaveCount(1);
      await expect(visibleCards.first()).toContainText('DevOps Dominion');
      await expect(page.getByTestId('filter-results-count')).toHaveText('Liczba wyników: 1');
    });
  });

  test('łączy filtr kategorii z filtrem wydawcy', async ({ page }) => {
    await page.getByRole('button', { name: 'Strategia' }).click();
    await page.getByRole('combobox', { name: 'Wydawca' }).selectOption({
      label: 'CodeForge Studios',
    });

    const visibleCards = page.locator('[data-testid="game-card"]:visible');
    await expect(visibleCards).toHaveCount(1);
    await expect(visibleCards.first()).toContainText('DevOps Dominion');
    await expect(page.getByRole('combobox', { name: 'Wydawca' })).toHaveAttribute(
      'data-testid',
      'publisher-filter',
    );
  });

  test('filtruje gry po wydawcy', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Wydawca' }).selectOption({
      label: 'CodeForge Studios',
    });

    const devOpsGame = page.getByTestId('game-card').filter({ hasText: 'DevOps Dominion' });
    const pipelineGame = page.getByTestId('game-card').filter({ hasText: 'Pipeline Conquest' });
    await expect(devOpsGame).toBeVisible();
    await expect(pipelineGame).toBeHidden();
  });

  test('pokazuje pusty stan, gdy żaden tytuł nie spełnia filtrów', async ({ page }) => {
    await page.getByRole('button', { name: 'Akcja' }).click();
    await page.getByRole('button', { name: 'Łamigłówki' }).click();

    await expect(page.locator('[data-testid="game-card"]:visible')).toHaveCount(0);
    await expect(page.getByTestId('filter-empty-state')).toBeVisible();
    await expect(page.getByTestId('filter-results-count')).toHaveText('Liczba wyników: 0');
  });

  test('czyści aktywne filtry kategorii i wydawcy', async ({ page }) => {
    const strategyFilter = page.getByRole('button', { name: 'Strategia' });
    const publisherFilter = page.getByRole('combobox', { name: 'Wydawca' });
    const resetButton = page.getByRole('button', { name: 'Wyczyść filtry' });

    await strategyFilter.click();
    await publisherFilter.selectOption({ label: 'CodeForge Studios' });
    await expect(resetButton).toBeEnabled();

    await resetButton.click();

    await expect(strategyFilter).toHaveAttribute('aria-pressed', 'false');
    await expect(strategyFilter).not.toHaveClass(/bg-blue-600/);
    await expect(publisherFilter).toHaveValue('');
    await expect(resetButton).toBeDisabled();
    await expect(page.locator('[data-testid="game-card"]:visible')).toHaveCount(21);
    await expect(page.getByTestId('filter-results-count')).toHaveText('Liczba wyników: 21');
  });
});
