import { and, asc, eq, exists } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import type { Database } from './db';
import { gameCategories, games, categories, publishers } from '../../db/schema';
import type { Category, Game, Publisher } from '../types/game';

export interface GameFilters {
    categoryIds?: number[];
    publisherId?: number;
}

const gameSelection = {
    id: games.id,
    title: games.title,
    description: games.description,
    starRating: games.starRating,
    categoryId: categories.id,
    categoryName: categories.name,
    publisherId: publishers.id,
    publisherName: publishers.name,
};

type GameSelectionRow = {
    id: number;
    title: string;
    description: string;
    starRating: number | null;
    categoryId: number | null;
    categoryName: string | null;
    publisherId: number | null;
    publisherName: string | null;
};

function mapGames(rows: GameSelectionRow[]): Game[] {
    const mapped = new Map<number, Game>();

    for (const row of rows) {
        let game = mapped.get(row.id);
        if (!game) {
            game = {
                id: row.id,
                title: row.title,
                description: row.description,
                starRating: row.starRating,
                categories: [],
                publisher:
                    row.publisherId !== null && row.publisherName !== null
                        ? { id: row.publisherId, name: row.publisherName }
                        : null,
            };
            mapped.set(row.id, game);
        }

        if (
            row.categoryId !== null &&
            row.categoryName !== null &&
            !game.categories.some((category) => category.id === row.categoryId)
        ) {
            game.categories.push({ id: row.categoryId, name: row.categoryName });
        }
    }

    return [...mapped.values()];
}

function filterConditions(db: Database, filters: GameFilters): SQL[] {
    const conditions: SQL[] = [];

    if (filters.publisherId !== undefined) {
        conditions.push(eq(games.publisherId, filters.publisherId));
    }

    const categoryIds = [...new Set(filters.categoryIds ?? [])];
    for (const categoryId of categoryIds) {
        conditions.push(
            exists(
                db
                    .select({ gameId: gameCategories.gameId })
                    .from(gameCategories)
                    .where(
                        and(
                            eq(gameCategories.gameId, games.id),
                            eq(gameCategories.categoryId, categoryId),
                        ),
                    ),
            ),
        );
    }

    return conditions;
}

function baseGamesQuery(db: Database, conditions: SQL[] = []) {
    return db
        .select(gameSelection)
        .from(games)
        .leftJoin(gameCategories, eq(games.id, gameCategories.gameId))
        .leftJoin(categories, eq(gameCategories.categoryId, categories.id))
        .leftJoin(publishers, eq(games.publisherId, publishers.id))
        .where(and(...conditions));
}

/** Gry spełniające filtry, posortowane po tytule. Wszystkie kategorie muszą pasować. */
export async function getAllGames(db: Database, filters: GameFilters = {}): Promise<Game[]> {
    const rows = await baseGamesQuery(db, filterConditions(db, filters))
        .orderBy(asc(games.title), asc(categories.name));
    return mapGames(rows);
}

/** Wszystkie kategorie posortowane po nazwie. */
export async function getAllCategories(db: Database): Promise<Category[]> {
    return db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .orderBy(asc(categories.name));
}

/** Wszyscy wydawcy posortowani po nazwie. */
export async function getAllPublishers(db: Database): Promise<Publisher[]> {
    return db
        .select({ id: publishers.id, name: publishers.name })
        .from(publishers)
        .orderBy(asc(publishers.name));
}

/** Identyfikatory wszystkich gier posortowane po tytule. */
export async function getAllGameIds(db: Database): Promise<number[]> {
    const rows = await db.select({ id: games.id }).from(games).orderBy(asc(games.title));
    return rows.map((row) => row.id);
}

/** Pojedyncza gra po id albo null, gdy nie istnieje. */
export async function getGameById(db: Database, id: number): Promise<Game | null> {
    const [game] = mapGames(await baseGamesQuery(db, [eq(games.id, id)]));
    return game ?? null;
}
