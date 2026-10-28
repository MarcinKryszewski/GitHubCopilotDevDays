import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Dostępność', () => {
  test('strona główna nie ma naruszeń dostępności', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('strona szczegółów gry nie ma naruszeń dostępności', async ({ page }) => {
    await page.goto('/game/1');
    await page.waitForSelector('[data-testid="game-details"]', { timeout: 10000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('strona O nas nie ma naruszeń dostępności', async ({ page }) => {
    await page.goto('/about');
    await page.waitForSelector('[data-testid="about-section"]', { timeout: 10000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('nawigacja klawiaturą - da się obsłużyć menu w nagłówku', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });

    const menuButton = page.getByRole('button', { name: /przełącz menu/i });
    const menu = page.locator('#menu');

    await test.step('Tabuj, aż przycisk menu dostanie fokus', async () => {
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');
        if (await menuButton.evaluate(el => el === document.activeElement)) break;
      }
      await expect(menuButton).toBeFocused();
    });

    await test.step('Otwórz menu Enterem i sprawdź, że jest widoczne', async () => {
      await page.keyboard.press('Enter');
      await expect(menu).not.toHaveClass(/hidden/);
    });

    await test.step('Sprawdź, że pozycje menu są osiągalne', async () => {
      const homeLink = menu.getByRole('link', { name: /strona główna/i });
      // Po otwarciu fokus może już być na pierwszej pozycji menu
      if (!await homeLink.evaluate(el => el === document.activeElement)) {
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');
          if (await homeLink.evaluate(el => el === document.activeElement)) break;
        }
      }
      await expect(homeLink).toBeFocused();

      const aboutLink = menu.getByRole('link', { name: /o nas/i });
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        if (await aboutLink.evaluate(el => el === document.activeElement)) break;
      }
      await expect(aboutLink).toBeFocused();
    });
  });

  test('nawigacja klawiaturą - da się dojść do kart gier', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });

    await test.step('Tabuj po stronie, aż karta gry dostanie fokus', async () => {
      const MAX_TABS = 50;
      let tabCount = 0;

      await expect.poll(async () => {
        if (tabCount < MAX_TABS) {
          await page.keyboard.press('Tab');
          tabCount++;
        }
        return page.locator('[data-testid="game-card"]:focus').count();
      }, { timeout: 15000, message: 'Karta gry powinna dostać fokus przez Tab' }).toBeGreaterThan(0);
    });
  });

  test('nawigacja klawiaturą - da się otworzyć kartę gry Enterem', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });

    let gameId: string | null = null;

    await test.step('Dojdź Tabem do karty gry prawdziwą nawigacją klawiaturą', async () => {
      let tabCount = 0;
      let gameCardFocused = false;

      while (tabCount < 20 && !gameCardFocused) {
        await page.keyboard.press('Tab');
        tabCount++;

        const focusedElement = page.locator(':focus');
        const testId = await focusedElement.getAttribute('data-testid').catch(() => null);

        if (testId === 'game-card') {
          gameId = await focusedElement.getAttribute('data-game-id');
          gameCardFocused = true;
        }
      }

      expect(gameCardFocused).toBeTruthy();
      expect(gameId).not.toBeNull();
    });

    await test.step('Naciśnij Enter i sprawdź przejście na stronę gry', async () => {
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(`/game/${gameId}`);
    });
  });

  test('wskaźniki fokusu - elementy interaktywne mają widoczny fokus', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });

    // Sprawdź, czy przycisk menu ma wskaźnik fokusu
    const menuButton = page.locator('#menu-toggle');
    await menuButton.focus();

    // Odczytaj obliczone style i sprawdź outline albo box-shadow
    const hasVisibleFocus = await menuButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      const outline = styles.outline;
      const outlineWidth = styles.outlineWidth;
      const boxShadow = styles.boxShadow;

      // Widoczny outline albo box-shadow (pierścień fokusu)
      return (outline !== 'none' && outlineWidth !== '0px') || boxShadow !== 'none';
    });

    expect(hasVisibleFocus).toBeTruthy();
  });

  test('etykiety ARIA - menu w nagłówku ma poprawne atrybuty ARIA', async ({ page }) => {
    await page.goto('/');

    // Przycisk menu ma aria-label lub aria-labelledby
    const menuButton = page.locator('#menu-toggle');
    const hasAriaLabel = await menuButton.evaluate((el) => {
      return el.hasAttribute('aria-label') ||
             el.hasAttribute('aria-labelledby') ||
             el.hasAttribute('aria-describedby');
    });

    // SVG ma rolę albo tytuł
    const menuIcon = menuButton.locator('svg');
    const svgAccessible = await menuIcon.evaluate((el) => {
      return el.hasAttribute('role') ||
             el.hasAttribute('aria-label') ||
             el.querySelector('title') !== null;
    });

    expect(hasAriaLabel || svgAccessible).toBeTruthy();
  });

  test('kontrast kolorów - spełnia WCAG AA', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });

    // Uruchom axe tylko z kontrolą kontrastu
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    // Odfiltruj naruszenia kontrastu
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('semantyczny HTML - główne landmarki są obecne', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });

    // Landmark header (first(), żeby uniknąć naruszenia strict mode przez dev tools)
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // Landmark main
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('dekoracyjne SVG mają atrybut aria-hidden', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });

    // SVG w przycisku menu ma aria-hidden
    const menuButtonSvg = page.locator('#menu-toggle svg');
    await expect(menuButtonSvg).toHaveAttribute('aria-hidden', 'true');

    // Strzałki na kartach gier mają aria-hidden (tylko pierwsza karta, żeby uniknąć strict mode)
    const firstGameCard = page.locator('[data-testid="game-card"]').first();
    const gameCardSvgs = firstGameCard.locator('svg');
    const count = await gameCardSvgs.count();

    // Co najmniej jeden SVG istnieje i wszystkie mają aria-hidden
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(gameCardSvgs.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
