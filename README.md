# Tailspin Toys

> 🇵🇱 **Repozytorium szablonowe na GitHub Dev Days Gdańsk 2026.**
> Instrukcja warsztatu: **https://pawel-siwek.github.io/gdn-dev-days-2026/cli-workshop/real-world-development/cli/**
> Zacznij od kliknięcia **Use this template** → **Create a new repository**.

Tailspin Toys to platforma crowdfundingowa dla gier planszowych o tematyce programistycznej. Projekt jest stroną fikcyjnej firmy zbierającej fundusze na gry, zbudowaną jako pojedyncza witryna [Astro](https://astro.build/) (w pełni prerenderowana, wyjście statyczne), ostylowana [Tailwind CSS](https://tailwindcss.com/). Dane leżą w lokalnej bazie SQLite, do której dostęp odbywa się przez [Drizzle ORM](https://orm.drizzle.team/) i wbudowany sterownik SQLite w Node.js. Strony odpytują bazę bezpośrednio we frontmatterze w czasie budowania, więc nie ma osobnego backendu.

## Architektura

- **Astro 7**: strony, layouty, komponenty i routing. `output: 'static'`, więc cała witryna jest prerenderowana do HTML w czasie budowania.
- **Drizzle ORM + Node SQLite**: warstwa danych. Schemat w `db/schema.ts`, dane zasilane z `db/games.csv`. Migracjami zarządza `drizzle-kit`.
- **Tailwind CSS v4**: stylowanie klasami narzędziowymi (ciemny motyw).
- **Vitest**: testy jednostkowe warstwy danych i czystych transformacji.
- **Playwright**: testy end-to-end uruchamiane na zbudowanej witrynie statycznej.

Komendy deweloperskie są zdefiniowane w `package.json`. Hooki `predev` i `prebuild` uruchamiają migrację i zasilenie bazy z `db/`, zapisując do ignorowanego przez gita pliku `tailspin.db`.

## Jak korzystać z tego szablonu

To repozytorium jest szablonem GitHuba. Kiedy utworzysz z niego nowe repozytorium, jednorazowy workflow **Załóż zgłoszenia startowe** (`.github/workflows/bootstrap-issues.yml`) uruchomi się automatycznie przy pierwszym pushu na `main` i **założy 9 zgłoszeń po polsku** z propozycjami pierwszych funkcjonalności. Każde zgłoszenie jest zdefiniowane plikiem Markdown w `.github/bootstrap-issues/` (pierwszy nagłówek to tytuł, reszta to treść), więc możesz tam edytować, dodawać i usuwać pliki, żeby sterować tym, co powstanie.

Workflow uruchamia się wyłącznie w repozytoriach utworzonych z szablonu (warunek `if: ${{ !github.event.repository.is_template }}` pomija sam szablon), a po założeniu zgłoszeń usuwa siebie oraz katalog `.github/bootstrap-issues/` w commicie porządkowym, żeby nigdy nie wykonał się ponownie.

## Pierwsze kroki

Zainstaluj zależności. Wymagany Node.js 22.13 lub nowszy:

```bash
npm ci
npx playwright install chromium   # potrzebne tylko do testów E2E
```

## Uruchomienie strony

```bash
npm run dev
```

`predev` najpierw zmigruje i zasili lokalną bazę. Potem otwórz [stronę](http://localhost:4321).

Żeby zamiast tego podejrzeć build produkcyjny:

```bash
npm run build      # prebuild migruje i zasila, potem buduje witrynę statyczną
npm run preview
```

## Baza danych

Baza SQLite powstaje z `db/games.csv`. Nie ma żadnych danych produkcyjnych do migrowania.

```bash
npm run db:generate   # wygeneruj migrację po zmianie db/schema.ts
npm run db:migrate    # zastosuj migracje
npm run db:seed       # zasil bazę z games.csv (idempotentne)
npm run db:setup      # migracja + zasilenie (uruchamiane automatycznie przez predev/prebuild)
npm run db:export     # zapisz zasilony katalog do db/catalog.json
```

> [!NOTE]
> Zasilanie jest idempotentne: pomija gry, które już są w bazie (po tytule), zamiast uzgadniać zmienione wiersze. CI zawsze startuje z czystą bazą, więc odzwierciedla `games.csv` dokładnie. Lokalnie, jeśli zmienisz albo usuniesz wiersze w `games.csv`, skasuj `tailspin.db` i uruchom ponownie `npm run db:setup`.

## Testy

```bash
npm run test:unit   # testy jednostkowe Vitest (transformacje + helpery dostępu do danych)
npm run test:e2e    # testy E2E Playwright (najpierw buduje i serwuje witrynę statyczną)
```

## Lint

Frontend używa ESLinta do pilnowania jakości kodu w plikach TypeScript i Astro:

```bash
npm run lint
```

ESLint uruchamia się też automatycznie w CI dla pull requestów do `main`.

## Kontrola typów

Projekt sprawdza typy **TypeScriptem 7** (natywny kompilator w Go, `tsgo`), dodanym obok klasycznego kompilatora przez pakiet [`@typescript/native-preview`](https://www.npmjs.com/package/@typescript/native-preview). Klasyczny pakiet `typescript` celowo zostaje w wersji 6, żeby ESLint z `typescript-eslint` i `astro check` działały bez zmian. Programistyczne API TypeScripta 7 nie jest jeszcze na nie gotowe.

```bash
npm run typecheck        # tsgo (TS 7) sprawdza czysty TypeScript (db/, src/lib/, src/types/, konfiguracje, testy)
npm run typecheck:astro  # astro sync + astro check sprawdzają pliki .astro (klasyczny pakiet typescript)
npm run typecheck:all    # oba powyższe
```

`tsgo` działa na [`tsconfig.tsgo.json`](tsconfig.tsgo.json), zawężonej konfiguracji, która pomija pliki `.astro` (natywny kompilator ich nie rozumie). Kontrola typów uruchamia się automatycznie w CI dla pull requestów do `main`.

> [!NOTE]
> Natywny kompilator służy tylko do kontroli typów (`--noEmit`). Witrynę nadal buduje `astro build` (Vite/esbuild). Klasyczny pakiet `typescript` zostaje w wersji 6, dopóki `typescript-eslint` i `@astrojs/check` nie obsłużą natywnego API (około TS 7.1). Wpis `ignore` w `.github/dependabot.yml` wstrzymuje do tego czasu podbicie `typescript@7`.

## Język

Wszystko, co czyta człowiek, jest po polsku: interfejs, dane gier, instrukcje dla Copilota, komentarze w kodzie, opisy testów i backlog zgłoszeń. Po angielsku zostały identyfikatory w kodzie (`starRating`, nazwy plików, komendy), tytuły gier i nazwy wydawców.

## Pochodzenie

Kopia [`github-samples/tailspin-toys`](https://github.com/github-samples/tailspin-toys)
(commit `0b8cd7a7ba9f26b5b880ff773936860ec670ffcc`, licencja MIT) przygotowana na
**GitHub Dev Days Gdańsk**, 28.10.2026.
Pełna atrybucja: [NOTICE.md](https://github.com/pawel-siwek/gdn-dev-days-2026/blob/main/NOTICE.md).

To nie jest oficjalny materiał GitHuba.

## Licencja

Projekt jest dostępny na licencji MIT. Pełna treść w pliku [LICENSE](./LICENSE).

## Opiekun

Szablon warsztatowy utrzymuje [@pawel-siwek](https://github.com/pawel-siwek).

## Wsparcie

Projekt jest dostarczany „tak jak jest" i może być aktualizowany. Jeśli masz pytania, załóż zgłoszenie.

## Zastrzeżenie

Ta aplikacja nie jest przeznaczona do użytku produkcyjnego ani nie jest przykładem tego, jak aplikacja produkcyjna powinna wyglądać.
