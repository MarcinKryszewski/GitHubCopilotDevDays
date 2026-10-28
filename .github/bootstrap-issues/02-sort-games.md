# Umożliw sortowanie listy gier

Różni gracze przeglądają katalog na różne sposoby — jedni chcą najpierw najwyżej ocenione tytuły, inni wolą kolejność alfabetyczną. Opcje sortowania na stronie listy gier dadzą wspierającym większą kontrolę nad tym, jak zwiedzają katalog. Warstwa danych udostępnia już tytuł i ocenę w gwiazdkach, więc rozwiązanie opiera się na istniejących strukturach.

## Kryteria akceptacji

- [ ] Użytkownicy mogą sortować listę gier po tytule (A–Z i Z–A)
- [ ] Użytkownicy mogą sortować listę gier po ocenie w gwiazdkach (najwyższe najpierw)
- [ ] Gry bez oceny są przy sortowaniu po ocenie umieszczane w sensownej, udokumentowanej kolejności
- [ ] Kontrolka sortowania spełnia wytyczne projektu dotyczące dostępności (etykietowanie, nawigacja klawiaturą, widoczny stan fokusu) i ma atrybut `data-testid`
- [ ] Testy jednostkowe pokrywają helpery sortujące, a testy e2e w Playwrighcie pokrywają zachowanie sortowania
