# Umożliw filtrowanie gier po kategorii i wydawcy

Wraz z rozrostem katalogu gracze potrzebują szybszego sposobu na znalezienie tytułów, które ich interesują. Możliwość filtrowania listy gier po kategorii i po wydawcy poprawia odnajdywalność i bezpośrednio wspiera cel platformy: pomóc wspierającym znaleźć gry, które chcą wesprzeć. Model danych już zawiera kategorie i wydawców, więc rozwiązanie opiera się na istniejących strukturach.

## Kryteria akceptacji

- [ ] Użytkownicy mogą filtrować listę gier po jednej lub wielu kategoriach
- [ ] Użytkownicy mogą filtrować listę gier po wydawcy
- [ ] Filtry kategorii i wydawcy można łączyć
- [ ] Helpery dostępu do danych w `src/lib/` obsługują filtrowanie gier po kategorii i wydawcy
- [ ] Kontrolki filtrów spełniają wytyczne projektu dotyczące dostępności (nawigacja klawiaturą, ARIA, widoczny stan fokusu) i mają atrybuty `data-testid`
- [ ] Testy jednostkowe w Vitest pokrywają helpery filtrowania, a testy e2e w Playwrighcie pokrywają nowe zachowanie filtrów
