# Wytyczne dla programistów Tailspin Toys

To platforma crowdfundingowa dla gier o tematyce programistycznej. Aplikacja to pojedyncza witryna w **Astro 7** (w pełni prerenderowana, wyjście statyczne) ostylowana za pomocą **Tailwind CSS v4**. Dane są przechowywane w lokalnej bazie SQLite, do której w czasie budowania sięgamy przez **Drizzle ORM + wbudowany sterownik SQLite w Node.js**; strony odpytują bazę bezpośrednio we frontmatterze. Nie ma osobnego backendowego API ani frameworka UI po stronie klienta. Współtworząc projekt, trzymaj się poniższych wytycznych:

## Uwagi dla agenta

- Zanim zaczniesz generować kod, przejrzyj projekt
- Dla długich operacji twórz listy zadań
  - Przed każdym krokiem z listy zadań ponownie przeczytaj instrukcje, żeby zawsze mieć właściwe wskazówki
- Zawsze korzystaj z plików instrukcji, jeśli są dostępne, i przejrzyj je przed generowaniem kodu
- Po zakończeniu zadania nie generuj plików markdown z podsumowaniem
- W skryptach i poleceniach BASH zawsze używaj ścieżek bezwzględnych
- **NIGDY nie commituj ani nie wypychaj do main automatycznie, chyba że wyraźnie o to poproszono**

## Standardy kodu

### Wymagane przed każdym commitem

#### Wytyczne dotyczące testów

- **Testy jednostkowe, lint i kontrolę typów zawsze uruchamiaj przez skill `quality-checks`.** Skill opakowuje `npm run test:unit`, `npm run lint` i `npm run typecheck:all` wraz z przygotowaniem środowiska, kolejnością i rozwiązywaniem problemów. Zestaw testów E2E Playwright uruchamiaj bezpośrednio poleceniem `npm run test:e2e`. (Uruchomienie aplikacji do ręcznej weryfikacji nie jest kontrolą jakości: do tego służy bezpośrednio `npm run dev`.)
- Uruchamiaj testy jednostkowe Vitest, żeby zweryfikować warstwę danych i transformacje, oraz testy Playwright, żeby zweryfikować działanie end-to-end i frontendu
- Przed commitem uruchom ESLint, żeby sprawdzić jakość kodu frontendu
- Przejrzyj istniejące testy, żeby nie dublować pracy
- Kod testów powinien mieć taką samą jakość jak reszta projektu i stosować zasadę DRY
- Przy zmianach we frontendzie zweryfikuj build (`npm run build`) i uruchom bezpośrednio testy end-to-end (`npm run test:e2e`), żeby upewnić się, że wszystko działa poprawnie
- Przy zmianach w warstwie danych (schemat, helpery, transformacje) zaktualizuj i uruchom odpowiednie testy jednostkowe

#### Wytyczne projektowe

- Przy aktualizacji schematu bazy danych wygeneruj i zacommituj migrację drizzle-kit (`npm run db:generate`)
- Dodając nową funkcjonalność, pamiętaj o aktualizacji README
- Zadbaj o to, żeby wszystkie wskazówki w pliku Copilot Instructions były zaktualizowane o istotne zmiany, w tym dotyczące struktury projektu, skryptów i wytycznych programistycznych

### Wymagania formatowania kodu

- Używaj TypeScriptu z jawnymi typami parametrów funkcji i wartości zwracanych, zwłaszcza w warstwie danych (`db/`, `src/lib/`)
- Kod frontendu (TypeScript, Astro) musi przechodzić kontrolę ESLint (`npm run lint`)

### Wzorce warstwy danych (Drizzle + Node SQLite)

- Tabele definiuj w `db/schema.ts`; zmiany schematu zarządzaj migracjami drizzle-kit, zob. `drizzle.instructions.md`
- Helpery dostępu do danych trzymaj w `src/lib/` z **wstrzykiwanym argumentem `db`**, żeby dało się je testować
- Logikę CSV/seed trzymaj jako czyste funkcje w `db/transforms.ts`
- Wartości wyprowadzane z seeda muszą być deterministyczne (bez `Math.random`), żeby statyczne buildy były odtwarzalne

### Wzorce Astro

- **Strony i komponenty Astro**: routing, layouty, treść i komponenty to wyłącznie pliki `.astro`, zob. `astro.instructions.md`
- Dane odpytuj bezpośrednio we frontmatterze strony przez helpery z `src/lib/` (czas budowania, wyjście statyczne)
- Trasy dynamiczne używają `getStaticPaths()` + `export const prerender = true`
- Dostarcz firmową stronę `404.astro` (przy wyjściu statycznym nieznane trasy to prawdziwe błędy 404)
- Dodawaj lokalny (scoped) `<script>` Astro tylko wtedy, gdy interaktywność po stronie klienta jest naprawdę potrzebna

### Stylowanie

- Używaj wyłącznie klas narzędziowych Tailwind CSS, zob. `style.instructions.md`
- Kolory ciemnego motywu: paleta slate (`bg-slate-800`, `text-slate-100` itd.)
- Zaokrąglone rogi i nowoczesne wzorce UI
- Stosuj nowoczesne zasady UI/UX: czyste, dostępne interfejsy

### Workflowy GitHub Actions

- Stosuj dobre praktyki bezpieczeństwa
- Zawsze jawnie ustawiaj uprawnienia workflow
- Dodawaj komentarze opisujące, jakie zadania są wykonywane

## Polecenia npm

- Polecenia deweloperskie są zdefiniowane w `package.json`. Uruchamiają Astro dla witryny oraz zadania TypeScript w `db/` do przygotowania bazy danych.
- **Skille mają pierwszeństwo.** Zanim uruchomisz polecenie bezpośrednio, sprawdź, czy jakiś skill nie obejmuje tego zadania (np. skill `quality-checks` opakowuje testy jednostkowe, lint i kontrolę typów). Jeśli taki istnieje, postępuj zgodnie z nim.
- Najważniejsze skrypty npm:
  - `npm run dev`: uruchamia serwer deweloperski Astro (`predev` migruje i zasila lokalną bazę SQLite)
  - `npm run build`: buduje statyczną witrynę (`prebuild` migruje i zasila lokalną bazę SQLite)
  - `npm run preview`: serwuje zbudowane wyjście z `dist/`
  - `npm run lint`: ESLint
  - `npm run test:unit`: testy jednostkowe Vitest
  - `npm run test:e2e`: testy E2E Playwright (najpierw build i preview)
  - `npm run typecheck`: kontrola typów czystego TypeScriptu za pomocą `tsgo` (natywny kompilator TypeScript 7 z pakietu `@typescript/native-preview`) z użyciem `tsconfig.tsgo.json`
  - `npm run typecheck:astro`: kontrola typów plików `.astro` przez `astro check` (klasyczny pakiet TypeScript)
  - `npm run typecheck:all`: uruchamia oba skrypty kontroli typów (używany przez zadanie `type-check` w CI)
  - `npm run db:generate` / `db:migrate` / `db:seed` / `db:setup`: zadania Drizzle dotyczące schematu, migracji i seeda
  - `npm run db:export`: migruje i zasila bazę przez `predb:export`, a następnie zapisuje plik katalogu (grounding) do `db/catalog.json`

> [!NOTE]
> TypeScript 7 (`tsgo`) jest wdrożony **równolegle** i służy wyłącznie do kontroli typów; nie wpływa na lintowanie. ESLint + `typescript-eslint` oraz `astro check` nadal korzystają z klasycznego pakietu `typescript` (utrzymywanego w wersji 6), bo API natywnego kompilatora nie jest jeszcze dla nich gotowe. **Nie** podnoś klasycznego pakietu `typescript` do wersji 7 (blokuje to wpis `ignore` w Dependabocie), dopóki `typescript-eslint` + `@astrojs/check` nie będą wspierać natywnego API. `tsgo` działa wyłącznie w trybie `--noEmit`; witrynę nadal buduje `astro build`.

## Struktura repozytorium

Aplikacja znajduje się w katalogu głównym repozytorium:

- `db/`: schemat Drizzle, migracje, transformacje, seed i `games.csv`
- `src/lib/`: klient Node SQLite (`db.ts`) i helpery dostępu do danych (`games.ts`)
- `src/components/`: komponenty `.astro` wielokrotnego użytku
- `src/layouts/`: szablony layoutów Astro
- `src/pages/`: trasy stron Astro (lista `index.astro`, `game/[id].astro`, `404.astro`, `about.astro`)
- `src/styles/`: CSS i konfiguracja Tailwind
- `src/types/`: interfejsy TypeScript (Game, Publisher, Category)
- `e2e-tests/`: testy E2E Playwright (strona główna, gry, dostępność)
- `drizzle.config.ts`, `vitest.config.ts`, `astro.config.mjs`, `playwright.config.ts`: konfiguracja narzędzi
- `README.md`: dokumentacja projektu

## Język

Odpowiadaj po polsku. Po polsku pisz też wszystko, co czyta człowiek: napisy
w interfejsie, dane przykładowe, komentarze w kodzie, opisy testów (`describe`,
`it`, `test.step`), komunikaty commitów, nazwy pull requestów. Identyfikatory
w kodzie (nazwy funkcji, zmiennych, typów, plików, kolumn, `data-testid`)
i nazwy gałęzi zostają po angielsku.
