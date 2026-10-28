# Współtworzenie Tailspin Toys

[fork]: https://github.com/pawel-siwek/tailspin-toys/fork
[pr]: https://github.com/pawel-siwek/tailspin-toys/compare
[code-of-conduct]: CODE_OF_CONDUCT.md

Dziękujemy za zainteresowanie współtworzeniem Tailspin Toys! Twoja pomoc jest nieoceniona w budowaniu platformy crowdfundingowej jak najlepszej zarówno dla twórców gier, jak i wspierających.

Wkład w ten projekt jest [publikowany](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) publicznie na [otwartej licencji projektu](LICENSE).

Pamiętaj, że projekt jest wydawany wraz z [Kodeksem postępowania współtwórców][code-of-conduct]. Uczestnicząc w projekcie, zgadzasz się przestrzegać jego postanowień.

## Pierwsze kroki

### Wymagania wstępne

Zanim uruchomisz i przetestujesz aplikację lokalnie, musisz zainstalować:

- **Node.js 22.13+** - [Pobierz](https://nodejs.org/) | [Homebrew](https://formulae.brew.sh/formula/node)
- **Git** - [Pobierz](https://git-scm.com/downloads) | [Homebrew](https://formulae.brew.sh/formula/git)

### Konfiguracja środowiska deweloperskiego

1. Zrób fork i sklonuj repozytorium:
   ```bash
   git clone https://github.com/TWOJA-NAZWA-UZYTKOWNIKA/tailspin-toys.git
   cd tailspin-toys
   ```

2. Zainstaluj zależności:
   ```bash
   npm ci
   npx playwright install chromium   # potrzebne tylko do testów E2E
   ```

3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```

4. Otwórz w przeglądarce [http://localhost:4321](http://localhost:4321)

## Struktura projektu

- `db/` - schemat Drizzle, migracje, transformacje, seed i `games.csv`
- `src/lib/` - klient bazy danych i helpery dostępu do danych
- `src/` - strony, layouty, komponenty, style i typy Astro
- `e2e-tests/` - testy E2E w Playwright

## Wprowadzanie zmian

### Warstwa danych (Drizzle + Node SQLite)

- Tabele definiuj w `db/schema.ts`; po zmianie schematu wygeneruj migrację przez `npm run db:generate`
- Podawaj typy dla wszystkich parametrów funkcji i wartości zwracanych
- Helpery dostępu do danych trzymaj w `src/lib/`, z wstrzykiwanym argumentem `db`
- Dodaj lub zaktualizuj testy Vitest dla każdej zmiany w warstwie danych
- Przed wysłaniem zmian uruchom testy: `npm run test:unit`
   - Wszystkie testy muszą przejść

### Frontend (Astro)

- Buduj UI jako strony i komponenty `.astro`; dane pobieraj we frontmatterze (wyjście statyczne)
- Trzymaj się ciemnego motywu, używając klas narzędziowych Tailwind CSS
- Dodawaj atrybuty `data-testid` do elementów interaktywnych na potrzeby testów
- Przed wysłaniem zmian uruchom testy E2E: `npm run test:e2e`
   - Wszystkie testy muszą przejść

## Zgłaszanie pull requesta

### Zgłoszenia

Każda prośba o zmianę powinna zaczynać się od zgłoszenia. Możesz założyć zgłoszenie razem z PR, ale zgłoszenie musi zawsze istnieć.

### Przebieg pracy

1. Utwórz nową gałąź od `main` dla swoich zmian:
   ```bash
   git checkout -b feature/nazwa-funkcji
   ```

2. Wprowadź zmiany zgodnie z udokumentowanymi standardami kodowania.

3. Uruchom zestawy testów, aby upewnić się, że nic się nie zepsuło:
   ```bash
   npm run lint
   npm run test:unit
   npm run test:e2e
   ```

4. Zacommituj zmiany z jasnym, opisowym komunikatem:
   ```bash
   git commit -m "Dodaj funkcję: krótki opis zmian"
   ```

5. Wypchnij zmiany do swojego forka i [otwórz pull request][pr].

6. Poczekaj, aż pull request zostanie zrecenzowany i zmergowany.

### Wytyczne dotyczące pull requestów

- Użyj odpowiedniego szablonu pull requesta i upewnij się, że wszystkie sekcje są wypełnione.
- Trzymaj się jednego tematu. Jeśli masz kilka niepowiązanych zmian, wyślij je jako osobne pull requesty.
- Pisz czytelne komunikaty commitów, które wyjaśniają, *co* i *dlaczego*.
- Zaktualizuj dokumentację, jeśli zmiany wpływają na sposób działania aplikacji.
- Upewnij się, że wszystkie testy przechodzą, zanim poprosisz o review.
- Reaguj na uwagi i bądź gotów(-owa) na poprawki.

## Zgłaszanie problemów

Znalazłeś(-aś) błąd albo masz pomysł na funkcję? [Załóż zgłoszenie](https://github.com/pawel-siwek/tailspin-toys/issues/new) i podaj:

- Jasny, opisowy tytuł
- Kroki do odtworzenia (w przypadku błędów)
- Zachowanie oczekiwane i faktyczne
- Zrzuty ekranu, jeśli to pomoże
- Szczegóły środowiska (system operacyjny, przeglądarka, wersja Node)

## Materiały

- [Jak współtworzyć open source](https://opensource.guide/how-to-contribute/)
- [Korzystanie z pull requestów](https://help.github.com/articles/about-pull-requests/)
- [Jak pisać dobre komunikaty commitów](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
- [Pomoc GitHub](https://help.github.com)
