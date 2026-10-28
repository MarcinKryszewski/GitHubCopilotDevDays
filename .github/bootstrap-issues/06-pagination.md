# Wprowadź paginację na liście gier

Wraz ze wzrostem liczby gier ładowanie całego katalogu na jednej stronie pogarsza wydajność i utrudnia przeglądanie. Paginacja utrzyma stronę listy gier szybką i wygodną w obsłudze.

## Kryteria akceptacji

- [ ] Helpery dostępu do danych w `src/lib/` obsługują paginację (na przykład page/limit albo kursorową)
- [ ] Strona listy gier zawiera kontrolki paginacji
- [ ] Kontrolki paginacji spełniają wytyczne projektu dotyczące dostępności i mają atrybuty `data-testid`
- [ ] Testy jednostkowe w Vitest pokrywają helpery paginacji, a testy e2e w Playwrighcie pokrywają jej zachowanie
