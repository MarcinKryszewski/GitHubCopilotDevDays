# Dodaj stronę wydawcy z listą jego gier

Kiedy wspierającemu spodoba się jakaś gra, naturalnym kolejnym krokiem jest sprawdzenie, co jeszcze zrobił ten sam wydawca. Dedykowana, prerenderowana strona dla każdego wydawcy z listą jego gier poprawi nawigację po katalogu. Model danych już łączy gry z wydawcami, więc to punktowe rozszerzenie zgodne z istniejącym wzorcem tras dynamicznych używanym na stronach szczegółów gry.

## Kryteria akceptacji

- [ ] Każdy wydawca ma prerenderowaną stronę (z użyciem `getStaticPaths()` + `export const prerender = true`) z listą wszystkich swoich gier
- [ ] Strona pokazuje nazwę i opis wydawcy oraz wykorzystuje istniejącą kartę gry do wyświetlenia listy
- [ ] Nazwy wydawców na karcie gry i/lub na stronie szczegółów gry linkują do strony wydawcy
- [ ] Strona spełnia wytyczne projektu dotyczące stylistyki i dostępności oraz ma atrybuty `data-testid`
- [ ] Helper dostępu do danych zwraca gry danego wydawcy i ma pokrycie testami jednostkowymi, a testy e2e w Playwrighcie pokrywają stronę wydawcy
