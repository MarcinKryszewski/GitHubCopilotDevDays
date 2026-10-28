---
name: quality-checks
description: Uruchamia testy jednostkowe (Vitest), lint (ESLint) i kontrolę typów (tsgo + astro check) tego projektu oraz podpowiada, jak debugować błędy przed commitem, pushem lub merge'em. Używaj tego skilla przy uruchamianiu npm run test:unit, npm run lint lub npm run typecheck:all.
allowed-tools:
  - shell
---

# Kontrole jakości

Ten skill uruchamia testy jednostkowe, lint i kontrolę typów dla pojedynczej aplikacji Astro (Astro 7 + Drizzle ORM/Node SQLite). Komendy npm zdefiniowane w `package.json` uruchamiaj z katalogu głównego repozytorium.

## Skrót

| Kontrola | Komenda | Kiedy używać |
|------------|----------------------------|-------------|
| Testy jednostkowe (Vitest) | `npm run test:unit` | Po każdej zmianie w warstwie danych / transformacjach / helperach |
| Lint (ESLint) | `npm run lint` | Po każdej zmianie w plikach TypeScript lub Astro |
| Kontrola typów (tsgo + astro check) | `npm run typecheck:all` | Po każdej zmianie w plikach TypeScript lub Astro |

Wszystkie komendy zakładają, że zależności są zainstalowane (`npm ci`).

---

## Uruchamianie testów jednostkowych, lintu i kontroli typów

### Testy jednostkowe

```bash
npm run test:unit
```

- Uruchamia Vitest (`vitest run`) dla plików `db/**/*.test.ts` i `src/**/*.test.ts`.
- Obejmuje czyste funkcje seedu/transformacji oraz helpery dostępu do danych Drizzle, testowane na bazie Node SQLite w pamięci.

### Lint

```bash
npm run lint
```

- Uruchamia ESLint dla wszystkich plików TypeScript i Astro w projekcie.
- Przed commitem musi przejść bez żadnego błędu.

### Kontrola typów

```bash
npm run typecheck:all
```

- `npm run typecheck` uruchamia natywny kompilator **TypeScript 7** (`tsgo` z pakietu `@typescript/native-preview`) dla czystego TypeScriptu (`db/`, `src/lib/`, `src/types/`, konfiguracje, testy) na podstawie `tsconfig.tsgo.json` (`--noEmit`).
- `npm run typecheck:astro` uruchamia `astro sync`, a następnie `astro check` dla plików `.astro` (na klasycznym pakiecie `typescript`).
- Kontrola typów jest niezależna od lintowania: `tsgo` nie wpływa na ESLint, który nadal korzysta z klasycznego pakietu `typescript`. Oba muszą przejść bez żadnego błędu przed commitem.

---

## Debugowanie i rozwiązywanie problemów

### Błędy środowiska / konfiguracji

**Objaw**: `command not found`, brakujące moduły albo `Cannot find package`.

```bash
npm ci
```

- Upewnij się, że dostępny jest Node 22.13+: `node --version`.
- Uruchom `npx astro sync`, jeśli błędy edytora lub typów odwołują się do brakujących wygenerowanych typów Astro.

---

### Baza danych / dane w czasie budowania

**Objaw**: puste strony, `no such table` albo build, który nie generuje stron gier.

Baza SQLite musi zostać zmigrowana i zasilona (seed) **przed** `astro build`. Hooki npm `prebuild` i `predev` automatycznie uruchamiają zadania migracji i seedu napisane w TypeScript z katalogu `db/`, gdy używasz `npm run build` lub `npm run dev`. Aby skonfigurować bazę osobno:

```bash
npm run db:setup     # db:migrate + db:seed
```

- Baza znajduje się w pliku `tailspin.db` (ignorowanym przez git) i jest odtwarzana z `db/games.csv`.
- Aby wymusić czysty rebuild: `rm -f tailspin.db && rm -rf dist && npm run build`.

---

### Błędy testów jednostkowych

**Objaw**: niespełnione asercje w `npm run test:unit`.

1. **Przeczytaj niespełnioną asercję**: Vitest wypisuje wartość oczekiwaną i otrzymaną w jednym miejscu.
2. **Baza w pamięci**: testy helperów tworzą dla każdego testu świeżą bazę Node SQLite `:memory:`, uruchamiają migracje i zasilają ją danymi testowymi. Jeśli zmiana schematu nie jest odzwierciedlona, wygeneruj migracje ponownie przez `npm run db:generate`.
3. **Determinizm**: oceny gwiazdkowe są wyliczane ze stabilnego hasha tytułu (`ratingFromTitle`), nigdy z `Math.random`. Niestabilna asercja na ocenie zwykle oznacza, że do danych wkradła się niedeterministyczność.

Uruchomienie pojedynczego pliku:

```bash
npx vitest run src/lib/games.test.ts
```

---

### Błędy lintu

**Objaw**: błędy ESLint z `npm run lint`.

1. **Automatyczna poprawka bezpiecznych problemów**: `npm run lint -- --fix`.
2. **Nieużywane zmienne**: celowo nieużywane identyfikatory poprzedź prefiksem `_`.
3. **Błędy typów TypeScript**: dodaj brakujące adnotacje typów albo popraw niepoprawne typy.
4. **Błędy pozostałe po `--fix`**: popraw ręcznie, nie wyciszaj ich przez `eslint-disable` bez uzasadnienia.

---

### Rozbieżności między środowiskiem lokalnym a CI

**Objaw**: testy jednostkowe, lint lub kontrola typów przechodzą lokalnie, ale nie przechodzą w CI (albo odwrotnie).

- **Niezgodność wersji Node**: CI używa bieżącego wydania Node LTS.
- **Stan bazy danych**: CI zawsze buduje z czystego seedu. Lokalnie usuń `tailspin.db` i zbuduj ponownie, jeśli podejrzewasz nieaktualne dane.

---

## Zasady weryfikacji

### Testy jednostkowe, lint i kontrola typów muszą przejść przed commitem/merge'em

- Wszystkie istniejące testy jednostkowe, lint i kontrola typów muszą przejść przed commitem zmian
- Nigdy nie pomijaj ani nie wyłączaj testów jednostkowych bez wyraźnego uzasadnienia
- Niepowodzenie testów jednostkowych, lintu lub kontroli typów blokuje merge: napraw je, nie ignoruj
- Uruchamiaj pełny zestaw testów jednostkowych, nie tylko testy zmienionego kodu
- Nowa funkcjonalność musi być dostarczana z odpowiednim pokryciem testami jednostkowymi

> [!NOTE]
> Ten skill obejmuje **uruchamianie, weryfikację i debugowanie** testów jednostkowych, lintu i kontroli typów. Jeśli chodzi o **sposób pisania** kodu testów jednostkowych (struktura, dane testowe, nazewnictwo i standardy jakości), kieruj się plikami instrukcji, które są jedynym źródłem prawdy:
> - Testy jednostkowe (`**/*.test.ts`): [unit-tests.instructions.md](../../instructions/unit-tests.instructions.md)

---

## Lista kontrolna przed commitem

1. Uruchom lint (jeśli zmieniły się jakiekolwiek pliki frontendu): `npm run lint`
2. Uruchom kontrolę typów (jeśli zmieniły się jakiekolwiek pliki TypeScript / Astro): `npm run typecheck:all`
3. Uruchom testy jednostkowe (jeśli zmieniła się warstwa danych / helpery): `npm run test:unit`
4. Sprawdź, czy nowa funkcjonalność ma odpowiednie pokrycie testami jednostkowymi
5. Potwierdź, że żadne testy jednostkowe nie zostały zepsute, pominięte ani wyłączone
