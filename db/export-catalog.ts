/**
 * Buduje plik z wiedzą o katalogu dla agenta Backer Concierge.
 *
 * `toCatalogExport` to czysta transformacja, więc da się ją testować bez
 * bazy, a CLI poniżej czyta zasiloną bazę przez helpery z `src/lib/games.ts`
 * z wstrzykiwanym `db`. Wynik jest deterministyczny (posortowany, bez
 * `Math.random`), więc ponowny eksport daje identyczny bajt w bajt JSON.
 *
 * Uruchomienie: `npm run db:export`
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createDatabase, type Database } from '../src/lib/db';
import { getAllGames } from '../src/lib/games';
import { formatStarRating } from '../src/lib/ratings';
import type { Game } from '../src/types/game';

const here = dirname(fileURLToPath(import.meta.url));

/** Domyślna lokalizacja wygenerowanego pliku. */
export const CATALOG_EXPORT_PATH = join(here, 'catalog.json');

const UNKNOWN_CATEGORY = 'Bez kategorii';
const UNKNOWN_PUBLISHER = 'Nieznany wydawca';

/** Pojedynczy wpis katalogu, tak jak widzi go agent. */
export interface CatalogGame {
    id: number;
    title: string;
    description: string;
    category: string;
    publisher: string;
    /** Pomijane całkowicie, gdy gra nie ma oceny, żeby w eksporcie nie było nulli. */
    starRating?: number;
    ratingLabel: string;
}

/** Pełny dokument z wiedzą o katalogu wysyłany do agenta. */
export interface CatalogExport {
    source: string;
    note: string;
    gameCount: number;
    categories: string[];
    publishers: string[];
    games: CatalogGame[];
}

const GROUNDING_NOTE =
    'Ten plik to kompletny katalog Tailspin Toys. Zawiera każdą grę, którą platforma wystawia. ' +
    'W tym zbiorze nie ma kwot zebranych, liczby wspierających, liczby graczy, progów wsparcia, cen ani dat premiery. ' +
    'Nie podawaj żadnych takich liczb.';

function mapCatalogGame(game: Game): CatalogGame {
    return {
        id: game.id,
        title: game.title,
        description: game.description,
        category: game.category?.name ?? UNKNOWN_CATEGORY,
        publisher: game.publisher?.name ?? UNKNOWN_PUBLISHER,
        ...(game.starRating !== null ? { starRating: game.starRating } : {}),
        ratingLabel: formatStarRating(game.starRating),
    };
}

/**
 * Unikalne wartości posortowane po jednostkach kodowych UTF-16 (porządkowo,
 * bez uwzględniania locale), żeby eksport był identyczny bajt w bajt na każdym
 * środowisku, niezależnie od domyślnego locale i danych ICU. To porządek
 * deterministyczny, nie językowo-alfabetyczny (np. wielkie litery przed małymi).
 */
function distinctSorted(values: string[]): string[] {
    return [...new Set(values)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/**
 * Zamienia wynik z warstwy danych na dokument dla agenta. Funkcja czysta: to
 * samo wejście zawsze daje to samo wyjście, niezależnie od kolejności.
 *
 * Gry są sortowane po tytule porównaniem porządkowym (jednostki kodowe
 * UTF-16), a przy powtórzonych tytułach rozstrzyga `id`. To nie jest porządek
 * alfabetyczny zależny od locale, dzięki czemu eksport jest identyczny na
 * każdym środowisku.
 */
export function toCatalogExport(games: Game[]): CatalogExport {
    const entries = games
        .map(mapCatalogGame)
        .sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : a.id - b.id));

    return {
        source: 'Katalog crowdfundingowy Tailspin Toys',
        note: GROUNDING_NOTE,
        gameCount: entries.length,
        categories: distinctSorted(entries.map((entry) => entry.category)),
        publishers: distinctSorted(entries.map((entry) => entry.publisher)),
        games: entries,
    };
}

/** Serializuje eksport ze stabilnym formatowaniem i końcowym znakiem nowej linii. */
export function serializeCatalogExport(exported: CatalogExport): string {
    return `${JSON.stringify(exported, null, 2)}\n`;
}

/** Czyta zasiloną bazę i zapisuje plik z katalogiem na dysk. */
export async function writeCatalogExport(db: Database, outputPath: string = CATALOG_EXPORT_PATH): Promise<CatalogExport> {
    const exported = toCatalogExport(await getAllGames(db));
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, serializeCatalogExport(exported), 'utf-8');
    return exported;
}

// Pozwala uruchomić bezpośrednio: `tsx db/export-catalog.ts`
if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const db = createDatabase();
    writeCatalogExport(db)
        .then((exported) => {
            console.log(`Wyeksportowano ${exported.gameCount} gier do ${CATALOG_EXPORT_PATH}`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('Eksport katalogu nie powiódł się:', error);
            process.exit(1);
        });
}
