# Dodaj asystenta Backer Concierge do pytań o katalog

### Opis problemu

Filtrowanie i sortowanie pomagają wspierającym, którzy już wiedzą, czego szukają. Sporo osób trafia do nas jednak bez takiej jasności — pytają o rzeczy w rodzaju „która gra spodoba się osobom lubiącym żarty o gicie?" albo „jaka jest najwyżej oceniona gra strategiczna?" na Discordzie i mailem, a ktoś odpowiada ręcznie.

### Proponowane rozwiązanie

Asystent **Backer Concierge** powinien odpowiadać na takie pytania bezpośrednio na stronie, opierając się wyłącznie na katalogu Tailspin, żeby nigdy nie wymyślać gier ani liczb. Katalog przechowuje tytuł, opis, kategorię, wydawcę i ocenę w gwiazdkach — i nic więcej. Asystent musi więc uczciwie przyznawać, na co nie potrafi odpowiedzieć (sumy zebranych środków, liczba wspierających, liczba graczy, ceny, daty premiery) i zadawać pytanie doprecyzowujące zamiast zgadywać.

## Kryteria akceptacji

- [ ] Wspierający mogą zadawać dowolne pytania o katalog i otrzymywać rekomendacje gier
- [ ] Każda rekomendacja opiera się na katalogu Tailspin — żadnych wymyślonych gier, wydawców, kategorii ani ocen
- [ ] Asystent odmawia podawania sum zebranych środków, liczby wspierających, progów wsparcia, cen i dat premiery — i wyjaśnia dlaczego
- [ ] Niejasne prośby oraz te zależne od danych, których katalog nie przechowuje, skutkują jednym krótkim pytaniem doprecyzowującym, a nie zgadywaniem
- [ ] Ogólna wiedza o grach planszowych może pochodzić z wyszukiwarki, ale musi być wyraźnie oznaczona jako kontekst ogólny, a nie fakt z Tailspin
- [ ] Asystent jest dostępny ze strony przez link w głównej nawigacji
- [ ] Interfejs spełnia wytyczne projektu dotyczące dostępności (nawigacja klawiaturą, ARIA, widoczny stan fokusu, `role="status"` dla stanu ładowania) i ma atrybuty `data-testid`
- [ ] Testy e2e w Playwrighcie pokrywają zadanie pytania i wyrenderowanie odpowiedzi, z zamockowanym wywołaniem asystenta
- [ ] Eksport katalogu używany do ugruntowania odpowiedzi jest generowany skryptem i pokryty testami jednostkowymi w Vitest
