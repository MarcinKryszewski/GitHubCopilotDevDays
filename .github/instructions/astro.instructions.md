---
description: 'Wzorce komponentów Astro dla stron, layoutów, komponentów i routingu'
applyTo: '**/*.astro'
---

# Instrukcje dla komponentów Astro

## Wzorce komponentów Astro

Astro obsługuje całe UI: strony, layouty, komponenty, routing i treść. Witryna jest **w pełni prerenderowana** (`output: 'static'`), nie ma frameworka UI po stronie klienta ani osobnego serwera API. Strony czytają dane **bezpośrednio we frontmatterze** w czasie budowania, przez helpery dostępu do danych Drizzle/Node SQLite z `src/lib/`.

### Struktura komponentu

```astro
---
// Frontmatter: wykonuje się w czasie budowania (wyjście statyczne)
import Layout from '../layouts/Layout.astro';
import GameCard from '../components/GameCard.astro';
import { getDatabase } from '../lib/db';
import { getAllGames } from '../lib/games';

interface Props {
  title: string;
}

const { title } = Astro.props;
const games = await getAllGames(getDatabase());
---

<Layout title={title}>
  {games.map((game) => <GameCard {game} />)}
</Layout>
```

## Layouty

- Twórz layouty wielokrotnego użytku w `src/layouts/`
- Używaj `<slot />` do wstawiania treści
- Umieszczaj w nich wspólne elementy: `<head>`, nawigację, stopkę
- Importuj globalne style w layoutach

### Przykład layoutu

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Strony

- Twórz strony w `src/pages/`
- Routing oparty na plikach: `src/pages/about.astro` → `/about`
- Trasy dynamiczne: `src/pages/game/[id].astro`
- Dostarcz firmową stronę `src/pages/404.astro`: przy wyjściu statycznym każdy URL bez wygenerowanej strony to prawdziwy błąd 404.

### Trasy dynamiczne (wyjście statyczne)

Przy `output: 'static'` każda trasa dynamiczna musi wyliczyć swoje strony przez `getStaticPaths()` i ustawić `prerender = true`. Dane odpytuj we frontmatterze za pomocą helperów dostępu do danych:

```astro
---
import type { GetStaticPaths } from 'astro';
import Layout from '../../layouts/Layout.astro';
import { getDatabase } from '../../lib/db';
import { getAllGameIds, getGameById } from '../../lib/games';

export const prerender = true;

export const getStaticPaths = (async () => {
  const ids = await getAllGameIds(getDatabase());
  return ids.map((id) => ({ params: { id: String(id) } }));
}) satisfies GetStaticPaths;

const { id } = Astro.params;
const game = await getGameById(getDatabase(), Number(id));
---

<Layout title="Szczegóły gry - Tailspin Toys">
  <!-- Szczegóły gry -->
</Layout>
```

## Dostęp do danych

- Dane w czasie budowania pochodzą z lokalnej bazy SQLite przez **Drizzle ORM + Node SQLite** (zob. [`drizzle.instructions.md`](drizzle.instructions.md)).
- Importuj `getDatabase()` z `src/lib/db.ts` oraz typowane helpery z `src/lib/games.ts`.
- Baza musi być zmigrowana i zasilona przed `astro build`; zajmuje się tym skrypt npm `prebuild` (`db:setup`).

## Interaktywność po stronie klienta (rzadko)

Nie ma warstwy Svelte/React. Gdy strona naprawdę potrzebuje zachowania po stronie klienta, dodaj lokalny (scoped) `<script>` Astro korzystający ze standardowych API DOM. Preferuj natywne elementy interaktywne (`<button>`, `<a href>`), żeby obsługę klawiatury i fokusu dostać za darmo.

## TypeScript

- Używaj TypeScriptu dla bezpiecznie typowanych props
- Definiuj interfejs `Props` we frontmatterze
- Typuj importy komponentów i wartości zwracane przez helpery
- Przed lintowaniem lub kontrolą typów uruchom `npx astro sync`, żeby (ponownie) wygenerować typy tras i treści
- Pliki `.astro` sprawdza pod kątem typów `npm run typecheck:astro` (uruchamia `astro sync`, a potem `astro check`) na klasycznym pakiecie `typescript`. Czysty TypeScript w `db/`, `src/lib/` i `src/types/` jest sprawdzany osobno przez `npm run typecheck` (natywny kompilator TS 7, `tsgo`), który **nie** przetwarza plików `.astro`.

## Dobre praktyki

- Pobieranie danych trzymaj we frontmatterze (czas budowania); unikaj pobierania po stronie klienta
- Minimalizuj JavaScript po stronie klienta: domyślnie nie wysyłamy żadnego JS
- Importuj i używaj globalnych stylów CSS z layoutów
- Zawsze dodawaj `data-testid` do elementów interaktywnych (zob. `ui.instructions.md`)
