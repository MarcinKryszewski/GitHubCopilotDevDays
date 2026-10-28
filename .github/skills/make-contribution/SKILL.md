---
name: make-contribution
description: Wszystkie zmiany w kodzie muszą być zgodne z wytycznymi udokumentowanymi w repozytorium. Zanim zostanie założone zgłoszenie, utworzona gałąź, wygenerowane commity lub otwarty pull request (PR), trzeba przeszukać repozytorium, aby upewnić się, że wykonywane są właściwe kroki. Ilekroć masz utworzyć zgłoszenie, napisać komunikaty commitów, wypchnąć kod lub utworzyć PR, używaj tego skilla, żeby wszystko zostało zrobione poprawnie.
---

# Wytyczne dotyczące kontrybucji

Prawie każdy projekt ma zestaw wytycznych dotyczących kontrybucji, których każdy musi przestrzegać przy tworzeniu zgłoszeń, pull requestów (PR) lub w inny sposób wnosząc kod. Mogą one obejmować między innymi:

- Utworzenie zgłoszenia przed utworzeniem PR albo utworzenie obu jednocześnie
- Szablony zgłoszeń lub PR, których trzeba użyć w zależności od rodzaju zmiany
- Wytyczne co do tego, co należy udokumentować w tych zgłoszeniach i PR
- Testy, lintery i inne wymagania wstępne, które trzeba uruchomić przed wypchnięciem zmian

Pamiętaj zawsze, że jesteś gościem w cudzym repozytorium. Dlatego wnosząc kod, musisz przestrzegać zasad i wytycznych ustalonych przez właściciela repozytorium.

## Korzystanie z istniejących wytycznych

Zanim utworzysz PR lub wykonasz którykolwiek z kroków prowadzących do niego, przejrzyj projekt, aby sprawdzić, czy zawiera jakieś wytyczne. Miejsca, które warto sprawdzić, to między innymi:

- README.md
- CONTRIBUTING.md
- Dokumentacja projektu
- Szablony zgłoszeń
- Szablony pull requestów (PR)

Jeśli którykolwiek z nich istnieje albo znajdziesz dokumentację w innym miejscu repozytorium, przeczytaj to, co znajdziesz, weź to pod uwagę i postępuj zgodnie z wytycznymi najlepiej, jak potrafisz. Jeśli masz pytania lub wątpliwości, poproś użytkownika o wskazówki, jak najlepiej postąpić. NIE twórz PR, dopóki nie masz pewności, że zastosowano się do przyjętych praktyk.

## Brak wytycznych

Jeśli nie znajdziesz żadnych wytycznych albo nie obejmują one pewnych tematów, użyj poniższych zasad jako podstawy do przygotowania dobrej jakości wkładu. **ZAWSZE** pierwszeństwo mają wytyczne zawarte w repozytorium.

## Zadania

Wielu właścicieli repozytoriów ma wytyczne co do kroków wstępnych, które trzeba wykonać przed utworzeniem PR. Mogą one obejmować między innymi:

- zbudowanie projektu lub wygenerowanie zasobów
- uruchomienie linterów i upewnienie się, że wszystkie problemy zostały rozwiązane
- wytyczne dotyczące nazewnictwa i inne wzorce
- testy jednostkowe, testy end-to-end lub inne testy, które trzeba napisać i które muszą przejść
  - w związku z tym mogą obowiązywać wymagane progi pokrycia

Przejrzyj wszystkie znalezione wytyczne i upewnij się, że wszystkie wymagania wstępne są spełnione.

## Zgłoszenie

Zawsze zaczynaj od sprawdzenia, czy istnieje zgłoszenie związane z bieżącym zadaniem. Mógł je już utworzyć użytkownik albo ktoś inny. Jeśli takie znajdziesz, zapytaj użytkownika, czy chce użyć tego zgłoszenia, a jeśli jest ich kilka, którego.

Jeśli nie znajdziesz zgłoszenia, sprawdź w wytycznych, czy jego utworzenie jest wymagane. Jeśli tak, użyj szablonu dostępnego w repozytorium. Jeśli jest ich kilka, wybierz ten, który najlepiej pasuje do wykonywanej pracy. W razie wątpliwości zapytaj użytkownika, którego użyć.

Jeśli założenie zgłoszenia jest wymagane, ale repozytorium nie ma szablonu zgłoszenia, skorzystaj z [tego szablonu zgłoszenia](./assets/issue-template.md) jako wskazówki, co powinno się w nim znaleźć.

## Gałąź

Zanim wykonasz jakiekolwiek commity, upewnij się, że dla tej pracy została utworzona gałąź. Postępuj zgodnie z wytycznymi zawartymi w dokumentacji repozytorium. Jeśli zdefiniowano prefiksy, takie jak `feature` lub `chore`, albo wymagane jest użycie nazwy użytkownika osoby tworzącej PR, zastosuj się do tego. Tą gałęzią nigdy nie może być `main` ani gałąź domyślna; musi to być gałąź utworzona specjalnie dla wprowadzanych zmian. Jeśli gałąź jeszcze nie istnieje, utwórz nową z dobrą nazwą, opartą na wprowadzanych zmianach i wytycznych.

## Commity

Przy commitowaniu zmian:

1. Przejrzyj wszystkie zmiany
2. Pogrupuj zmiany logicznie
3. Dla każdej grupy napisz krótki komunikat commita, zgodnie z wytycznymi repozytorium
4. Zacommituj pogrupowany kod do gałęzi.

## Merge

**NIGDY** nie merguj do main, chyba że użytkownik wyraźnie o to poprosi

## Pull request

Tworząc pull request, użyj szablonów istniejących w repozytorium, jeśli jakieś są, i postępuj zgodnie ze znalezionymi wytycznymi.

Jeśli szablonu nie ma, użyj [tego szablonu PR](./assets/pr-template.md). Zawiera on zestaw nagłówków wraz ze wskazówkami, co umieścić w poszczególnych sekcjach.

Jeśli zgłoszenie zostało utworzone lub jest używane, upewnij się, że PR się do niego odwołuje. Użyj składni `Closes #NUMER`, aby zgłoszenie zamknęło się automatycznie.
