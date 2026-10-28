---
description: 'Wzorce warstwy danych Drizzle ORM + Node SQLite dla aplikacji Astro'
applyTo: 'db/**/*.ts,src/lib/*.ts'
---

# Instrukcje dla Drizzle ORM + Node SQLite

Dane aplikacji znajdują się w lokalnej bazie SQLite, do której sięgamy przez **Drizzle ORM** na wbudowanym sterowniku `node:sqlite` z Node.js. Są konsumowane w **czasie budowania** z frontmattera stron Astro; nie ma serwera API działającego w czasie wykonania. Zmianami schematu zarządzają migracje **drizzle-kit**.

## Układ plików

- `db/schema.ts`: definicje tabel Drizzle (`publishers`, `categories`, `games`) i wywnioskowane typy wierszy. Jedyne źródło prawdy o schemacie.
- `db/transforms.ts`: **czyste** funkcje (parsowanie CSV, budowanie opisów, usuwanie duplikatów, deterministyczne `ratingFromTitle`). Bez dostępu do bazy, więc łatwo je testować jednostkowo.
- `db/seed.ts`: idempotentne zasilanie bazy z `db/games.csv` z użyciem transformacji.
- `db/migrate.ts`: stosuje wygenerowane migracje.
- `db/migrations/`: wygenerowane migracje SQL (nie edytuj ręcznie).
- `db/test-helpers.ts`: `createTestDatabase()` zwraca zmigrowaną bazę Node SQLite w pamięci na potrzeby testów.
- `src/lib/db.ts`: `createDatabase(url)` / `getDatabase()` budują klienta Drizzle na podstawie `DATABASE_URL` (domyślnie lokalny plik `tailspin.db`).
- `src/lib/games.ts`: typowane helpery dostępu do danych z **wstrzykiwanym `db`**, używane przez strony i testy.

## Konwencje schematu

- Używaj `sqliteTable` z jawnymi nazwami kolumn (`text`, `integer`, `real`).
- Klucze główne: `integer('id').primaryKey({ autoIncrement: true })`.
- Kolumny wymagane oznaczaj `.notNull()`; kolumny opcjonalne (np. `starRating`) zostaw jako nullable.
- Klucze obce definiuj przez `.references(() => other.id)`.
- Eksportuj wywnioskowane typy (`typeof table.$inferSelect`) i buduj na nich typy aplikacyjne; nie deklaruj kształtów wierszy ręcznie.

## Proces migracji

1. Edytuj `schema.ts`.
2. Wygeneruj migrację: `npm run db:generate` (drizzle-kit).
3. Zastosuj migrację i zasil bazę lokalnie: `npm run db:setup` (`db:migrate` + `db:seed`).
4. Zacommituj zarówno zmianę schematu, **jak i** wygenerowaną migrację w `db/migrations/`.

> [!IMPORTANT]
> Baza musi być zmigrowana i zasilona **przed** `astro build`. Skrypty npm `prebuild`/`predev` uruchamiają `db:setup` automatycznie; CI polega na tej kolejności.

## Helpery dostępu do danych (wstrzykiwane db)

Helpery przyjmują instancję `db` jako pierwszy argument, dzięki czemu działają zarówno z prawdziwym klientem (na stronach), jak i z klientem w pamięci (w testach):

```ts
import { asc, count, eq } from 'drizzle-orm';
import type { Database } from './db';
import { games } from '../../db/schema';

export async function getAllGameIds(db: Database): Promise<number[]> {
  const rows = await db.select({ id: games.id }).from(games).orderBy(asc(games.title));
  return rows.map((r) => r.id);
}
```

- Zawsze sortuj (`order by`) po stabilnej kolumnie (title), żeby statyczne buildy były deterministyczne.
- Mapuj surowe wiersze na typy aplikacyjne `Game`/`Publisher`/`Category` w jednym miejscu; nie przepuszczaj kształtów wierszy Drizzle do komponentów.
- Logikę sortowania i wyszukiwania trzymaj w `games.ts`, nie na stronach.

## Determinizm

Wartości wyprowadzane z seeda muszą być odtwarzalne między buildami. Oceny w gwiazdkach wyprowadzaj ze stabilnego hasha tytułu (`ratingFromTitle`), **nigdy** z `Math.random()`.

## Testowanie

Transformacje testuj jednostkowo bezpośrednio, a helpery na bazie z `createTestDatabase()`. Zob. [`unit-tests.instructions.md`](unit-tests.instructions.md).

## Wymagania dotyczące Node.js

Wymagany jest Node.js 22.13 lub nowszy, ponieważ warstwa danych korzysta z wbudowanego modułu `node:sqlite` bez flagi eksperymentalnej. Nie wprowadzaj zewnętrznych sterowników SQLite dostarczających binaria zależne od platformy.

## Kontrola typów

Warstwę danych (`db/**/*.ts`, `src/lib/*.ts`) sprawdza pod kątem typów `npm run typecheck`, który uruchamia natywny kompilator **TypeScript 7** (`tsgo` z pakietu `@typescript/native-preview`) na podstawie `tsconfig.tsgo.json`. Eksportowane helpery muszą mieć jawne typy parametrów i wartości zwracanych, żeby `tsgo` mógł je zweryfikować. Lintowanie pozostaje bez zmian: ESLint + `typescript-eslint` nadal działają na klasycznym pakiecie `typescript`.
