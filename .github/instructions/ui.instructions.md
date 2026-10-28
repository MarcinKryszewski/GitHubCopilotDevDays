---
description: 'Centralna strategia UI i filozofia tworzenia komponentów'
---

# Strategia komponentów UI

Ten plik definiuje centralną strategię rozwoju UI dla Tailspin Toys. Wskazówki dotyczące konkretnych technologii znajdują się w osobnych plikach instrukcji.

## Architektura komponentów

### Podział technologii

- **Astro** (pliki `.astro`): strony, layouty, komponenty, routing i treść statyczna. Witryna jest w pełni prerenderowana (`output: 'static'`), więc komponenty renderują się do HTML w czasie budowania.
- **Tailwind CSS** (klasy narzędziowe): stylowanie
- **`<script>` Astro**: Po niewielki skrypt po stronie klienta sięgaj tylko wtedy, gdy interaktywność jest naprawdę potrzebna; nie ma frameworka UI po stronie klienta.

Pliki instrukcji dla konkretnych technologii:
- [`astro.instructions.md`](astro.instructions.md) - strony, layouty i komponenty Astro
- [`style.instructions.md`](style.instructions.md) - wzorce stylowania Tailwind CSS

## Podstawowe zasady

### Testowalność

- Każdy element interaktywny MUSI mieć atrybut `data-testid`
- Używaj opisowych identyfikatorów testowych, które określają przeznaczenie i kontekst elementu
- Przykłady: `data-testid="game-card-{game.id}"`, `data-testid="submit-button"`, `data-testid="nav-home"`

### Dostępność

- Używaj semantycznych elementów HTML (`<nav>`, `<main>`, `<article>`, `<button>`)
- Tam, gdzie semantyczny HTML nie wystarcza, dodawaj etykiety i role ARIA
- Do nawigacji po witrynie używaj zwykłego `<nav>` z elementami `<a>`/`<button>`; **nie** dodawaj `role="menu"`. Zarezerwuj `role="menu"` / `role="menuitem"` dla prawdziwych menu aplikacyjnych, które implementują pełną złożoną semantykę klawiatury (przenoszenie fokusu strzałkami, Home/End, wyszukiwanie przez wpisywanie)
- Stany ładowania powinny używać `role="status"` i `aria-live="polite"`, żeby czytniki ekranu je ogłaszały
- Dodawaj obsługę klawisza Escape do elementów zamykanych (menu, okna modalne)
- Zadbaj o działającą nawigację klawiaturą dla wszystkich elementów interaktywnych, z poprawnym zarządzaniem fokusem
- Dodawaj widoczne stany fokusu: `focus:ring-2 focus:ring-blue-500 focus:outline-none`
- Utrzymuj wystarczający kontrast kolorów (zwłaszcza w ciemnym motywie)

### Spójność projektu

- Ciemny motyw w całej aplikacji
- Nowoczesne, czyste UI z zaokrąglonymi rogami i płynnymi przejściami
- Spójne odstępy i hierarchia wizualna
- Responsywny układ działający na telefonie, tablecie i komputerze

### Komponenty wielokrotnego użytku

- Twórz komponenty wielokrotnego użytku dla typowych wzorców UI
- Każdy komponent powinien mieć jedną odpowiedzialność
- Konfiguruj przez props, zamiast powielać kod
- Dokumentuj API komponentów typami TypeScript

## Przebieg pracy

1. **Wybierz właściwe narzędzie**: 
   - Treść i struktura → komponenty/strony Astro
   - Stylowanie → Tailwind
   - Interaktywność po stronie klienta (rzadko) → lokalny (scoped) `<script>` Astro

2. **Stosuj wzorce właściwe dla technologii**: 
   - Sięgnij do odpowiedniego pliku instrukcji

3. **Zapewnij testowalność**: 
   - Dodaj `data-testid` do wszystkich elementów interaktywnych

4. **Zweryfikuj dostępność**: 
   - Przetestuj nawigację klawiaturą
   - Sprawdź stany fokusu
   - Zweryfikuj strukturę semantyczną
