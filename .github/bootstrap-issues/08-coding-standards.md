# Zaktualizuj standardy kodowania w repozytorium

Jasne, spisane standardy kodowania utrzymują spójność kodu i ułatwiają nowym współtwórcom (oraz Copilotowi) wprowadzanie poprawnych zmian. Nasze obecne wytyczne dotyczące komentarzy i dokumentacji są ubogie, co prowadzi do niespójności — jedne pliki są przekomentowane powtórzeniami kodu, inne nie wyjaśniają w ogóle intencji. Chcemy jednej, dobrze rozumianej konwencji, która mówi co dokumentować, gdzie i jak, ze szczególnym naciskiem na komentarze i dokumentację.

## Czego oczekujemy

- **Komentuj intencję, nie mechanikę.** Komentarze powinny wyjaśniać, *dlaczego* dany fragment kodu istnieje albo jakie było uzasadnienie nieoczywistej decyzji — a nie powtarzać to, co kod już mówi. Usuwaj komentarze, które jedynie parafrazują linijkę pod nimi.
- **Dokumentuj warstwę danych.** Każda eksportowana funkcja w `db/` i `src/lib/` musi mieć komentarz TSDoc/JSDoc opisujący jej przeznaczenie, parametry i wartość zwracaną. Helpery powinny mieć udokumentowany wstrzykiwany argument `db`, żeby wzorzec testowania pozostał czytelny.
- **Dokumentuj kontrakty komponentów.** Każdy komponent `.astro` wielokrotnego użytku powinien dokumentować swój interfejs `Props`, żeby API komponentu samo się tłumaczyło.
- **Utrzymuj komentarze w aktualności.** Traktuj nieaktualne komentarze jak błędy — aktualizuj je albo usuwaj w tej samej zmianie, która dotyka powiązanego kodu.

## Kryteria akceptacji

- [ ] Pliki w `.github/instructions` opisują jasną filozofię komentowania: komentujemy *dlaczego* (intencja, decyzje), a nie *co*, i nie powtarzamy kodu
- [ ] Udokumentowane są oczekiwania co do TSDoc/JSDoc dla eksportowanych funkcji w `db/` i `src/lib/`, wraz z opisem parametrów i wartości zwracanych
- [ ] Udokumentowane są oczekiwania co do dokumentowania interfejsów `Props` w komponentach `.astro`
- [ ] Reguły formatowania TypeScriptu są udokumentowane i — tam, gdzie to możliwe — egzekwowane przez ESLint
- [ ] README linkuje do zaktualizowanych standardów kodowania albo je streszcza
- [ ] Lintowanie przechodzi z nowo dodanymi regułami (uruchomione przez skill `quality-checks` / `npm run lint`)
