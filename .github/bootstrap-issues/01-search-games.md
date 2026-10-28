# Dodaj wyszukiwarkę gier po tytule

Gracze, którzy już wiedzą, czego szukają, nie powinni przeglądać całego katalogu. Proste pole wyszukiwania na stronie listy gier pozwoli szybko zawęzić listę po tytule i poprawi odnajdywalność — obok planowanych filtrów po kategorii i wydawcy. Rozwiązanie opiera się na istniejącej warstwie danych listy gier i nie zmienia modelu danych.

## Kryteria akceptacji

- [ ] Strona listy gier zawiera pole wyszukiwania filtrujące gry po tytule
- [ ] Dopasowanie ignoruje wielkość liter i aktualizuje widoczną listę w trakcie pisania lub po zatwierdzeniu
- [ ] Przy braku dopasowań wyświetla się odpowiedni stan pusty
- [ ] Pole wyszukiwania spełnia wytyczne projektu dotyczące dostępności (etykietowanie, nawigacja klawiaturą, widoczny stan fokusu) i ma atrybut `data-testid`
- [ ] Testy jednostkowe pokrywają nowy helper warstwy danych / wyszukiwania, a testy e2e w Playwrighcie pokrywają zachowanie wyszukiwarki
