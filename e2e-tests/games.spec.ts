import { test, expect, type Response } from '@playwright/test';

test.describe('Lista gier i nawigacja', () => {
  test('wyświetla gry z tytułami na stronie głównej', async ({ page }) => {
    await test.step('Przejdź na stronę główną', async () => {
      await page.goto('/');
    });

    await test.step('Sprawdź, że siatka gier jest widoczna', async () => {
      const gamesGrid = page.getByTestId('games-grid');
      await expect(gamesGrid).toBeVisible();
    });

    await test.step('Sprawdź, że karty gier są wyświetlone', async () => {
      const gameCards = page.getByTestId('game-card');
      await expect(gameCards.first()).toBeVisible();
      expect(await gameCards.count()).toBeGreaterThan(0);
    });

    await test.step('Sprawdź, że karty gier mają niepuste tytuły', async () => {
      const gameCards = page.getByTestId('game-card');
      await expect(gameCards.first().getByTestId('game-title')).toBeVisible();
      await expect(gameCards.first().getByTestId('game-title')).not.toBeEmpty();
    });
  });

  test('po kliknięciu gry przechodzi na właściwą stronę szczegółów', async ({ page }) => {
    let gameId: string | null;
    let gameTitle: string | null;

    await test.step('Przejdź na stronę główną i poczekaj na gry', async () => {
      await page.goto('/');
      const gamesGrid = page.getByTestId('games-grid');
      await expect(gamesGrid).toBeVisible();
    });

    await test.step('Pobierz dane pierwszej gry i kliknij ją', async () => {
      const firstGameCard = page.getByTestId('game-card').first();
      gameId = await firstGameCard.getAttribute('data-game-id');
      gameTitle = await firstGameCard.getAttribute('data-game-title');
      await firstGameCard.click();
    });

    await test.step('Sprawdź przejście na stronę szczegółów gry', async () => {
      await expect(page).toHaveURL(`/game/${gameId}`);
      await expect(page.getByTestId('game-details')).toBeVisible();
    });

    await test.step('Sprawdź, że tytuł gry zgadza się z klikniętą kartą', async () => {
      if (gameTitle) {
        await expect(page.getByTestId('game-details-title')).toHaveText(gameTitle);
      }
    });
  });

  test('wyświetla szczegóły gry ze wszystkimi wymaganymi informacjami', async ({ page }) => {
    await test.step('Przejdź na stronę szczegółów konkretnej gry', async () => {
      await page.goto('/game/1');
      await expect(page.getByTestId('game-details')).toBeVisible();
    });

    await test.step('Sprawdź, że tytuł gry jest wyświetlony', async () => {
      const gameTitle = page.getByTestId('game-details-title');
      await expect(gameTitle).toBeVisible();
      await expect(gameTitle).not.toBeEmpty();
    });

    await test.step('Sprawdź, że opis gry jest wyświetlony', async () => {
      const gameDescription = page.getByTestId('game-details-description');
      await expect(gameDescription).toBeVisible();
      await expect(gameDescription).not.toBeEmpty();
    });

    await test.step('Sprawdź, że jest wydawca lub kategoria', async () => {
      const publisherExists = await page.getByTestId('game-details-publisher').isVisible();
      const categoryExists = await page.getByTestId('game-details-category').isVisible();
      expect(publisherExists || categoryExists).toBeTruthy();

      if (publisherExists) {
        await expect(page.getByTestId('game-details-publisher')).not.toBeEmpty();
      }

      if (categoryExists) {
        await expect(page.getByTestId('game-details-category')).not.toBeEmpty();
      }
    });
  });

  test('wyświetla przycisk wsparcia gry', async ({ page }) => {
    await test.step('Przejdź na stronę szczegółów gry', async () => {
      await page.goto('/game/1');
      await expect(page.getByTestId('game-details')).toBeVisible();
    });

    await test.step('Sprawdź, że przycisk wsparcia jest widoczny i aktywny', async () => {
      const backButton = page.getByTestId('back-game-button');
      await expect(backButton).toBeVisible();
      await expect(backButton).toContainText('Wesprzyj tę grę');
      await expect(backButton).toBeEnabled();
    });
  });

  test('pozwala wrócić ze szczegółów gry na stronę główną', async ({ page }) => {
    await test.step('Przejdź na stronę szczegółów gry', async () => {
      await page.goto('/game/1');
      await expect(page.getByTestId('game-details')).toBeVisible();
    });

    await test.step('Kliknij link powrotu do wszystkich gier', async () => {
      const backLink = page.getByRole('link', { name: /wróć do wszystkich gier/i });
      await expect(backLink).toBeVisible();
      await backLink.click();
    });

    await test.step('Sprawdź powrót na stronę główną', async () => {
      await expect(page).toHaveURL('/');
      await expect(page.getByTestId('games-grid')).toBeVisible();
    });
  });

  test('zwraca stronę 404 dla nieistniejącej gry', async ({ page }) => {
    let response: Response | null;

    await test.step('Przejdź do nieistniejącej gry', async () => {
      response = await page.goto('/game/99999');
    });

    await test.step('Sprawdź, że serwowana jest firmowa strona 404', async () => {
      expect(response?.status()).toBe(404);
      await expect(page).toHaveTitle(/Nie znaleziono strony - Tailspin Toys/);
      await expect(page.getByTestId('not-found')).toBeVisible();
      await expect(page.getByTestId('not-found-heading')).not.toBeEmpty();
      await expect(page.getByTestId('not-found-home-link')).toBeVisible();
    });
  });
});
