---
description: 'Instrukcje generowania testów Playwright'
applyTo: '**/*.spec.ts'
---

# Wytyczne pisania testów

## Standardy jakości kodu

- **Lokatory**: Stawiaj na lokatory zorientowane na użytkownika, oparte na rolach (`getByRole`, `getByLabel`, `getByText` itd.), bo są odporne na zmiany i wspierają dostępność. Używaj `test.step()` do grupowania interakcji, żeby poprawić czytelność testów i raportów.
- **Limity czasu**: Polegaj wyłącznie na wbudowanym mechanizmie automatycznego oczekiwania Playwright. NIGDY nie używaj sztywnych opóźnień takich jak `waitForTimeout`, podwyższonych domyślnych limitów czasu ani `waitForLoadState`.
- **Asercje**: Używaj asercji web-first z automatycznym ponawianiem. Zaczynają się od słowa kluczowego `await` (np. `await expect(locator).toHaveText()`). Preferuj asercje weryfikujące istotny stan (`toHaveText`, `toContainText`, `toHaveCount`, `toMatchAriaSnapshot`, `toHaveURL`) zamiast gołego `toBeVisible()`, gdy naprawdę zależy ci na treści lub strukturze. `toBeVisible()` to poprawna asercja z automatycznym ponawianiem i nadaje się do rzeczywistego sprawdzania obecności/widoczności; nie sięgaj po nią tylko wtedy, gdy bardziej precyzyjna asercja lepiej wyraża intencję.
- **Czytelność**: Używaj opisowych tytułów testów i kroków, które jasno określają intencję. Komentarze dodawaj tylko po to, żeby wyjaśnić złożoną logikę lub nieoczywiste interakcje.

## Struktura testu

- **Importy**: Zaczynaj od `import { test, expect } from '@playwright/test';`.
- **Organizacja**: Powiązane testy jednej funkcjonalności grupuj w bloku `test.describe()`.
- **Hooki**: Używaj `beforeEach` do czynności przygotowawczych wspólnych dla wszystkich testów w bloku `describe` (np. przejścia na stronę).
- **Tytuły**: Trzymaj się czytelnej konwencji nazewnictwa, np. `Funkcjonalność - Konkretna akcja lub scenariusz`.


## Organizacja plików

- **Lokalizacja**: Wszystkie pliki testów trzymaj w katalogu `e2e-tests/`.
- **Nazewnictwo**: Stosuj konwencję `<funkcjonalnosc-lub-strona>.spec.ts` (np. `login.spec.ts`, `search.spec.ts`).
- **Zakres**: Dąż do jednego pliku testów na każdą główną funkcjonalność lub stronę aplikacji.

## Dobre praktyki asercji

- **Struktura UI**: Używaj `toMatchAriaSnapshot` do weryfikacji struktury drzewa dostępności komponentu. Daje to kompletny i dostępny zrzut.
- **Liczba elementów**: Używaj `toHaveCount` do sprawdzania liczby elementów znalezionych przez lokator.
- **Treść tekstowa**: Używaj `toHaveText` do dokładnego dopasowania tekstu i `toContainText` do dopasowania częściowego.
- **Nawigacja**: Używaj `toHaveURL` do weryfikacji adresu URL strony po wykonaniu akcji.


## Przykładowa struktura testu

```typescript
import { test, expect } from '@playwright/test';

test.describe('Wyszukiwanie filmów', () => {
  test.beforeEach(async ({ page }) => {
    // Przed każdym testem przejdź do aplikacji
    await page.goto('https://debs-obrien.github.io/playwright-movies-app');
  });

  test('Wyszukuje film po tytule', async ({ page }) => {
    await test.step('Aktywuj i wykonaj wyszukiwanie', async () => {
      await page.getByRole('search').click();
      const searchInput = page.getByRole('textbox', { name: 'Search Input' });
      await searchInput.fill('Garfield');
      await searchInput.press('Enter');
    });

    await test.step('Zweryfikuj wyniki wyszukiwania', async () => {
      // Zweryfikuj drzewo dostępności wyników wyszukiwania
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - main:
          - heading "Garfield" [level=1]
          - heading "search results" [level=2]
          - list "movies":
            - listitem "movie":
              - link "poster of The Garfield Movie The Garfield Movie rating":
                - /url: /playwright-movies-app/movie?id=tt5779228&page=1
                - img "poster of The Garfield Movie"
                - heading "The Garfield Movie" [level=2]
      `);
    });
  });
});
```

## Strategia pisania i iteracji

> [!NOTE]
> Ten plik opisuje, jak pisać specyfikacje testów. Żeby *uruchomić* zestaw testów E2E, użyj `npm run test:e2e`.

1. **Uruchom**: Wykonaj zestaw testów poleceniem `npm run test:e2e`.
2. **Zdiagnozuj błędy**: Przeanalizuj nieudane testy i znajdź przyczyny źródłowe.
3. **Iteruj**: W razie potrzeby dopracuj lokatory, asercje lub logikę testów i uruchom zestaw ponownie.
4. **Zweryfikuj**: Upewnij się, że testy przechodzą stabilnie i pokrywają zamierzoną funkcjonalność.
5. **Zaraportuj**: Przekaż informację o wynikach testów i wszelkich wykrytych problemach.

## Lista kontrolna jakości

Zanim uznasz testy za gotowe, upewnij się, że:
- [ ] Wszystkie lokatory są dostępne i precyzyjne oraz nie naruszają trybu ścisłego (strict mode)
- [ ] Testy są pogrupowane logicznie i mają czytelną strukturę
- [ ] Asercje są znaczące i odzwierciedlają oczekiwania użytkownika
- [ ] Testy stosują spójną konwencję nazewnictwa
- [ ] Kod jest poprawnie sformatowany i skomentowany
