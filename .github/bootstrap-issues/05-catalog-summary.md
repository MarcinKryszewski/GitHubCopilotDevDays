# Pokaż podsumowanie katalogu na stronie głównej

Strona główna przechodzi od razu do siatki wyróżnionych gier, nie dając odwiedzającym pojęcia o wielkości ani jakości katalogu. Niewielkie podsumowanie — na przykład łączna liczba gier i średnia ocena w gwiazdkach — da wspierającym użyteczny kontekst na pierwszy rzut oka i ożywi stronę startową. Opiera się w całości na danych już dostępnych w warstwie danych.

## Kryteria akceptacji

- [ ] Strona główna wyświetla łączną liczbę gier w katalogu
- [ ] Strona główna wyświetla średnią ocenę w gwiazdkach spośród gier, które mają ocenę
- [ ] Podsumowanie elegancko obsługuje przypadki brzegowe (brak gier albo brak gier z oceną)
- [ ] Podsumowanie spełnia wytyczne projektu dotyczące stylistyki i dostępności oraz ma atrybuty `data-testid`
- [ ] Helper dostępu do danych wylicza podsumowanie deterministycznie i ma pokrycie testami jednostkowymi, a testy e2e w Playwrighcie weryfikują jego renderowanie na stronie głównej
