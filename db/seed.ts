import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { eq } from 'drizzle-orm';
import { createDatabase, type Database } from '../src/lib/db';
import { categories, gameCategories, games, publishers } from './schema';
import {
    categoryDescription,
    gameDescription,
    parseGamesCsv,
    publisherDescription,
    ratingFromTitle,
    uniqueCategories,
    uniquePublishers,
} from './transforms';

const here = dirname(fileURLToPath(import.meta.url));

async function upsertCategories(db: Database, names: string[]): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    for (const name of names) {
        const existing = await db.select().from(categories).where(eq(categories.name, name)).limit(1);
        if (existing.length > 0) {
            map.set(name, existing[0].id);
            continue;
        }
        const [row] = await db
            .insert(categories)
            .values({ name, description: categoryDescription(name) })
            .returning({ id: categories.id });
        map.set(name, row.id);
    }
    return map;
}

async function upsertPublishers(db: Database, names: string[]): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    for (const name of names) {
        const existing = await db.select().from(publishers).where(eq(publishers.name, name)).limit(1);
        if (existing.length > 0) {
            map.set(name, existing[0].id);
            continue;
        }
        const [row] = await db
            .insert(publishers)
            .values({ name, description: publisherDescription(name) })
            .returning({ id: publishers.id });
        map.set(name, row.id);
    }
    return map;
}

/** Zasila bazę z CSV z grami. Idempotentne: pomija gry, które już są (po tytule). */
export async function seedDatabase(db: Database, csvPath: string = join(here, 'games.csv')): Promise<void> {
    const rows = parseGamesCsv(readFileSync(csvPath, 'utf-8'));

    const categoryIds = await upsertCategories(db, uniqueCategories(rows));
    const publisherIds = await upsertPublishers(db, uniquePublishers(rows));

    for (const row of rows) {
        const existing = await db
            .select({ id: games.id })
            .from(games)
            .where(eq(games.title, row.title))
            .limit(1);
        let gameId: number;

        if (existing.length > 0) {
            gameId = existing[0].id;
        } else {
            const [game] = await db
                .insert(games)
                .values({
                    title: row.title,
                    description: gameDescription(row.description),
                    starRating: ratingFromTitle(row.title),
                    publisherId: publisherIds.get(row.publisher)!,
                })
                .returning({ id: games.id });
            gameId = game.id;
        }

        const existingCategories = await db
            .select({ categoryId: gameCategories.categoryId })
            .from(gameCategories)
            .where(eq(gameCategories.gameId, gameId));
        const existingCategoryIds = new Set(existingCategories.map((entry) => entry.categoryId));
        const newCategoryIds = row.categories
            .map((name) => categoryIds.get(name)!)
            .filter((categoryId) => !existingCategoryIds.has(categoryId));

        if (newCategoryIds.length > 0) {
            await db.insert(gameCategories).values(
                newCategoryIds.map((categoryId) => ({ gameId, categoryId })),
            );
        }
    }
}

// Pozwala uruchomić bezpośrednio: `tsx db/seed.ts`
// pathToFileURL normalizuje backslashe i liczbę ukośników na Windowsie, więc
// porównanie działa na każdej platformie.
if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const db = createDatabase();
    seedDatabase(db)
        .then(() => {
            console.log('Baza zasilona.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Zasilanie bazy nie powiodło się:', error);
            process.exit(1);
        });
}
