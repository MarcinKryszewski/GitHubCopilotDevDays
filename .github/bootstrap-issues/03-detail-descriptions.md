# Pokaż opisy kategorii i wydawcy na stronie szczegółów gry

Tabele kategorii i wydawców mają już pole `description`, ale strona szczegółów gry pokazuje wyłącznie nazwy. Wyświetlenie tych opisów da wspierającym przydatny kontekst: kto stoi za grą i jakiego rodzaju to gra. Nie wymaga żadnych zmian w schemacie.

## Kryteria akceptacji

- [ ] Strona szczegółów gry wyświetla opis kategorii, jeśli jest dostępny
- [ ] Strona szczegółów gry wyświetla opis wydawcy, jeśli jest dostępny
- [ ] Brakujące opisy są obsłużone elegancko (sekcja jest ukrywana, zamiast pokazywać pustą treść)
- [ ] Nowa treść spełnia wytyczne projektu dotyczące stylistyki i dostępności oraz ma atrybuty `data-testid`
- [ ] Helper dostępu do danych został rozszerzony o pola opisów, ma pokrycie testami jednostkowymi, a testy e2e w Playwrighcie weryfikują renderowanie opisów
