---
description: 'Wytyczne testów jednostkowych Vitest dla warstwy danych Astro + Drizzle/Node SQLite'
applyTo: '**/*.test.ts'
---

# Wytyczne testów jednostkowych (Vitest + Drizzle/Node SQLite)

Testy jednostkowe działają na **Vitest** (`npm run test:unit`). Pokrywają dwie najcenniejsze warstwy niezależne od frameworka:

1. **Czyste transformacje** (`db/transforms.ts`): parsowanie CSV, budowanie opisów, usuwanie duplikatów, deterministyczne oceny.
2. **Helpery dostępu do danych** (`src/lib/games.ts`): sortowanie, wyszukiwanie, testowane na prawdziwej bazie **Node SQLite** w pamięci.

> [!IMPORTANT]
> Testy muszą być niezależne od środowiska uruchomieniowego Astro. Helpery przyjmują **wstrzykiwany argument `db`**; testy przekazują bazę w pamięci, strony przekazują prawdziwego klienta. Nigdy nie uruchamiaj serwera Astro, żeby przetestować jednostkowo logikę danych.

## Struktura plików

- Testy umieszczaj obok kodu: `transforms.test.ts` obok `transforms.ts`, `games.test.ts` obok `games.ts`.
- Wzorzec nazw: `<modul>.test.ts`.
- Używaj bloków `describe('<moduł / funkcja>')` i przypadków `it('robi X, gdy Y')`.
- Dodawaj adnotacje typów do helperów i fixture'ów; ten projekt wymaga jawnych typów.

## Testowanie czystych transformacji

- Baza nie jest potrzebna: zaimportuj funkcję i sprawdź jej wynik.
- Pokryj: ścieżkę pozytywną, puste wejście lub same białe znaki, wiersze z brakującymi polami opcjonalnymi, usuwanie duplikatów oraz **determinizm** (np. `ratingFromTitle` zwraca tę samą wartość dla tego samego tytułu i mieści się w zakresie 3.0–5.0).
- Dla macierzy wejście/wyjście preferuj przypadki tabelaryczne z `it.each`.

```ts
import { describe, it, expect } from 'vitest';
import { ratingFromTitle } from './transforms';

describe('ratingFromTitle', () => {
  it('jest deterministyczny i mieści się w zakresie', () => {
    const a = ratingFromTitle('Code Quest');
    const b = ratingFromTitle('Code Quest');
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(3.0);
    expect(a).toBeLessThanOrEqual(5.0);
  });
});
```

## Testowanie helperów dostępu do danych

- Dla każdego testu buduj świeżą bazę w pamięci wspólnym helperem `createTestDatabase()` (`db/test-helpers.ts`), który uruchamia migracje na kliencie Node SQLite `:memory:`.
- Zasilaj bazę tylko tymi fixture'ami, których test potrzebuje, a potem wywołaj helper z tym `db`.
- Zawsze najpierw sprawdzaj to, co tanie (liczności, sumy, kolejność), a dopiero potem szczegółowy kształt obiektów.

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../db/test-helpers';
import { getAllGames, getGameById } from './games';

describe('getAllGames', () => {
  let db: Awaited<ReturnType<typeof createTestDatabase>>;

  beforeEach(async () => {
    db = await createTestDatabase();
    // …zasil wydawców, kategorie i gry…
  });

  it('zwraca gry posortowane po tytule wraz z relacjami', async () => {
    const games = await getAllGames(db);
    const titles = games.map((g) => g.title);
    expect(titles).toEqual([...titles].sort());
    expect(games[0].category).not.toBeNull();
  });
});
```

## Wymagane pokrycie

- Przypadki pozytywne z poprawnymi danymi
- Przypadki braku danych (`getGameById` dla nieistniejącego id zwraca `null`)
- Scenariusze z pustą bazą/kolekcją
- Gwarancje kolejności (alfabetycznie po tytule); statyczne buildy polegają na jej determinizmie
- Determinizm wartości wyprowadzanych z seeda

## Dobre praktyki

- Stosuj schemat Arrange-Act-Assert.
- Jedno zachowanie na `it`; nie sprawdzaj niepowiązanych rzeczy w jednym przypadku.
- Nie mockuj bazy danych: instancja Node SQLite w pamięci jest szybka i wykonuje prawdziwy SQL wraz ze złączeniami.
- Fixture'y trzymaj minimalne, ale reprezentatywne dla relacji (gra → wydawca, gra → kategoria).
- Jeśli zmiana schematu psuje testy, wygeneruj migracje ponownie przez `npm run db:generate` i zaktualizuj fixture'y.
