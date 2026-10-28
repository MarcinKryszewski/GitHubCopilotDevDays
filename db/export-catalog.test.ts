import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { categories, publishers, games } from './schema';
import { createTestDatabase } from './test-helpers';
import {
    toCatalogExport,
    serializeCatalogExport,
    writeCatalogExport,
    type CatalogExport,
} from './export-catalog';
import type { Game } from '../src/types/game';
import type { Database } from '../src/lib/db';

function makeGame(overrides: Partial<Game> = {}): Game {
    return {
        id: 1,
        title: 'Merge Conflict',
        description: 'Kooperacyjna gra o rozwiązywaniu konfliktów.',
        starRating: 4.5,
        category: { id: 1, name: 'Strategia' },
        publisher: { id: 1, name: 'Rebase Games' },
        ...overrides,
    };
}

function containsNull(value: unknown): boolean {
    if (value === null) return true;
    if (Array.isArray(value)) return value.some(containsNull);
    if (typeof value === 'object') return Object.values(value).some(containsNull);
    return false;
}

describe('toCatalogExport', () => {
    it('mapuje grę na spłaszczony wpis katalogu', () => {
        const exported: CatalogExport = toCatalogExport([makeGame()]);

        expect(exported.gameCount).toBe(1);
        expect(exported.games[0]).toEqual({
            id: 1,
            title: 'Merge Conflict',
            description: 'Kooperacyjna gra o rozwiązywaniu konfliktów.',
            category: 'Strategia',
            publisher: 'Rebase Games',
            starRating: 4.5,
            ratingLabel: '★★★★½',
        });
    });

    it('sortuje gry po tytule niezależnie od kolejności na wejściu', () => {
        const exported = toCatalogExport([
            makeGame({ id: 2, title: 'Zero Downtime' }),
            makeGame({ id: 3, title: 'Async Await' }),
            makeGame({ id: 1, title: 'Merge Conflict' }),
        ]);

        expect(exported.games.map((game) => game.title)).toEqual([
            'Async Await',
            'Merge Conflict',
            'Zero Downtime',
        ]);
    });

    it('sortuje porządkowo po jednostkach kodowych, nie alfabetycznie wg locale', () => {
        // Wielkie litery mają niższe kody niż małe, a znaki diakrytyczne sortują
        // się za zwykłym ASCII. Ten test utrwala deterministyczny komparator
        // (bez `localeCompare`), żeby nikt po cichu nie wrócił do sortowania
        // zależnego od locale.
        const exported = toCatalogExport([
            makeGame({ id: 1, title: 'alpha' }),
            makeGame({ id: 2, title: 'Zebra' }),
            makeGame({ id: 3, title: 'Álpha' }),
            makeGame({ id: 4, title: 'Alpha' }),
        ]);

        expect(exported.games.map((game) => game.title)).toEqual([
            'Alpha',
            'Zebra',
            'alpha',
            'Álpha',
        ]);
    });

    it('rozstrzyga remisy między identycznymi tytułami po id', () => {
        const exported = toCatalogExport([
            makeGame({ id: 3, title: 'Ten sam tytuł' }),
            makeGame({ id: 1, title: 'Ten sam tytuł' }),
            makeGame({ id: 2, title: 'Ten sam tytuł' }),
        ]);

        expect(exported.games.map((game) => game.id)).toEqual([1, 2, 3]);
    });

    it('wypisuje unikalne kategorie i wydawców alfabetycznie', () => {
        const exported = toCatalogExport([
            makeGame({ id: 1, category: { id: 2, name: 'Akcja' }, publisher: { id: 2, name: 'Stack Overflow Studios' } }),
            makeGame({ id: 2, title: 'Druga', category: { id: 1, name: 'Strategia' }, publisher: { id: 1, name: 'Rebase Games' } }),
            makeGame({ id: 3, title: 'Trzecia', category: { id: 1, name: 'Strategia' }, publisher: { id: 1, name: 'Rebase Games' } }),
        ]);

        expect(exported.categories).toEqual(['Akcja', 'Strategia']);
        expect(exported.publishers).toEqual(['Rebase Games', 'Stack Overflow Studios']);
    });

    it('sortuje unikalne kategorie i wydawców porządkowo po jednostkach kodowych', () => {
        const exported = toCatalogExport([
            makeGame({ id: 1, category: { id: 1, name: 'zeta' }, publisher: { id: 1, name: 'zeta' } }),
            makeGame({ id: 2, title: 'Druga', category: { id: 2, name: 'Zeta' }, publisher: { id: 2, name: 'Zeta' } }),
            makeGame({ id: 3, title: 'Trzecia', category: { id: 3, name: 'Ínca' }, publisher: { id: 3, name: 'Ínca' } }),
        ]);

        expect(exported.categories).toEqual(['Zeta', 'zeta', 'Ínca']);
        expect(exported.publishers).toEqual(['Zeta', 'zeta', 'Ínca']);
    });

    it('wstawia zastępniki za brakujące relacje i pomija brakującą ocenę', () => {
        const exported = toCatalogExport([
            makeGame({ category: null, publisher: null, starRating: null }),
        ]);

        const [game] = exported.games;
        expect(game.category).toBe('Bez kategorii');
        expect(game.publisher).toBe('Nieznany wydawca');
        expect(game.starRating).toBeUndefined();
        expect(game.ratingLabel).toBe('Brak oceny');
    });

    it('nigdy nie emituje wartości null', () => {
        const exported = toCatalogExport([
            makeGame(),
            makeGame({ id: 2, title: 'Same nulle', category: null, publisher: null, starRating: null }),
        ]);

        expect(containsNull(exported)).toBe(false);
    });

    it('zwraca pusty katalog dla pustej bazy', () => {
        const exported = toCatalogExport([]);

        expect(exported.gameCount).toBe(0);
        expect(exported.games).toEqual([]);
        expect(exported.categories).toEqual([]);
        expect(exported.publishers).toEqual([]);
    });

    it('jest deterministyczna dla tego samego wejścia', () => {
        const games = [makeGame({ id: 2, title: 'Beta' }), makeGame({ id: 1, title: 'Alfa' })];

        expect(serializeCatalogExport(toCatalogExport(games))).toBe(
            serializeCatalogExport(toCatalogExport(games)),
        );
    });
});

describe('serializeCatalogExport', () => {
    it('produkuje JSON z wcięciami i końcowym znakiem nowej linii', () => {
        const output = serializeCatalogExport(toCatalogExport([makeGame()]));

        expect(output.endsWith('}\n')).toBe(true);
        expect(output).toContain('\n  "gameCount": 1');
        expect(JSON.parse(output).games).toHaveLength(1);
    });
});

describe('writeCatalogExport', () => {
    let tempDir: string;

    afterEach(() => {
        if (tempDir) rmSync(tempDir, { recursive: true, force: true });
    });

    it('czyta bazę i zapisuje zwrócony katalog do zagnieżdżonej ścieżki', async () => {
        const db: Database = await createTestDatabase();
        const [category] = await db
            .insert(categories)
            .values({ name: 'Strategia', description: 'kat' })
            .returning({ id: categories.id });
        const [publisher] = await db
            .insert(publishers)
            .values({ name: 'Rebase Games', description: 'wyd' })
            .returning({ id: publishers.id });

        await db.insert(games).values({
            title: 'Merge Conflict',
            description: 'Kooperacyjna gra o rozwiązywaniu konfliktów.',
            starRating: 4.5,
            categoryId: category.id,
            publisherId: publisher.id,
        });

        tempDir = mkdtempSync(join(tmpdir(), 'catalog-export-'));
        const outputPath = join(tempDir, 'nested', 'catalog.json');

        const returned: CatalogExport = await writeCatalogExport(db, outputPath);
        const output = readFileSync(outputPath, 'utf-8');
        const written = JSON.parse(output) as CatalogExport;

        expect(returned.gameCount).toBe(1);
        expect(returned.games[0].title).toBe('Merge Conflict');
        expect(written).toEqual(returned);
        expect(output.endsWith('}\n')).toBe(true);
    });
});
