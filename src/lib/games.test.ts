import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../db/test-helpers';
import { categories, gameCategories, publishers, games } from '../../db/schema';
import type { Database } from './db';
import {
    getAllCategories,
    getAllGames,
    getAllGameIds,
    getAllPublishers,
    getGameById,
} from './games';

async function seedGames(db: Database, count: number): Promise<void> {
    const [category] = await db
        .insert(categories)
        .values({ name: 'Strategia', description: 'kat' })
        .returning({ id: categories.id });
    const [publisher] = await db
        .insert(publishers)
        .values({ name: 'Wydawca Jeden', description: 'wyd' })
        .returning({ id: publishers.id });

    // Wstawiamy tytuły w odwrotnej kolejności alfabetycznej, żeby sprawdzić sortowanie.
    for (let i = count; i >= 1; i--) {
        const [game] = await db.insert(games).values({
            title: `Gra ${String(i).padStart(2, '0')}`,
            description: `Opis ${i}`,
            starRating: 4.2,
            publisherId: publisher.id,
        }).returning({ id: games.id });
        await db.insert(gameCategories).values({ gameId: game.id, categoryId: category.id });
    }
}

describe('helpery dostępu do danych o grach', () => {
    let db: Database;

    beforeEach(async () => {
        db = await createTestDatabase();
    });

    it('zwraca wszystkie gry posortowane po tytule', async () => {
        await seedGames(db, 3);
        const all = await getAllGames(db);
        expect(all.map((g) => g.title)).toEqual(['Gra 01', 'Gra 02', 'Gra 03']);
        expect(all[0].categories).toEqual([{ id: expect.any(Number), name: 'Strategia' }]);
        expect(all[0].publisher).toEqual({ id: expect.any(Number), name: 'Wydawca Jeden' });
    });

    it('zwraca identyfikatory wszystkich gier posortowane po tytule', async () => {
        await seedGames(db, 3);
        const ids = await getAllGameIds(db);
        const all = await getAllGames(db);
        expect(ids).toEqual(all.map((g) => g.id));
    });

    it('pobiera pojedynczą grę po id', async () => {
        await seedGames(db, 2);
        const ids = await getAllGameIds(db);
        const game = await getGameById(db, ids[0]);
        expect(game?.title).toBe('Gra 01');
    });

    it('zwraca null dla nieistniejącej gry', async () => {
        await seedGames(db, 2);
        expect(await getGameById(db, 99999)).toBeNull();
    });

    it('zwraca kategorie i wydawców posortowanych po nazwie', async () => {
        await db.insert(categories).values([
            { name: 'Zabawa', description: 'kat' },
            { name: 'Akcja', description: 'kat' },
        ]);
        await db.insert(publishers).values([
            { name: 'Wydawca Z', description: 'wyd' },
            { name: 'Wydawca A', description: 'wyd' },
        ]);

        expect((await getAllCategories(db)).map((category) => category.name)).toEqual(['Akcja', 'Zabawa']);
        expect((await getAllPublishers(db)).map((publisher) => publisher.name)).toEqual([
            'Wydawca A',
            'Wydawca Z',
        ]);
    });

    it('filtruje gry po wszystkich wskazanych kategoriach i wydawcy', async () => {
        const [strategy, action, puzzle] = await db
            .insert(categories)
            .values([
                { name: 'Strategia', description: 'kat' },
                { name: 'Akcja', description: 'kat' },
                { name: 'Łamigłówki', description: 'kat' },
            ])
            .returning({ id: categories.id });
        const [publisherOne, publisherTwo] = await db
            .insert(publishers)
            .values([
                { name: 'Wydawca Jeden', description: 'wyd' },
                { name: 'Wydawca Dwa', description: 'wyd' },
            ])
            .returning({ id: publishers.id });

        const insertGame = async (
            title: string,
            categoryIds: number[],
            publisherId: number,
        ): Promise<void> => {
            const [game] = await db
                .insert(games)
                .values({ title, description: title, publisherId })
                .returning({ id: games.id });
            await db.insert(gameCategories).values(
                categoryIds.map((categoryId) => ({ gameId: game.id, categoryId })),
            );
        };

        await insertGame('A', [strategy.id, action.id], publisherOne.id);
        await insertGame('B', [strategy.id], publisherOne.id);
        await insertGame('C', [strategy.id, action.id], publisherTwo.id);
        await insertGame('D', [action.id, puzzle.id], publisherOne.id);

        const categoryMatches = await getAllGames(db, {
            categoryIds: [strategy.id, action.id],
        });
        expect(categoryMatches.map((game) => game.title)).toEqual(['A', 'C']);

        const filtered = await getAllGames(db, {
            categoryIds: [strategy.id, action.id],
            publisherId: publisherOne.id,
        });
        expect(filtered.map((game) => game.title)).toEqual(['A']);
        expect(filtered[0].categories.map((category) => category.name)).toEqual(['Akcja', 'Strategia']);
    });

    it('ignoruje pustą listę kategorii podczas filtrowania po wydawcy', async () => {
        const [category] = await db
            .insert(categories)
            .values({ name: 'Strategia', description: 'kat' })
            .returning({ id: categories.id });
        const [publisher] = await db
            .insert(publishers)
            .values({ name: 'Wydawca', description: 'wyd' })
            .returning({ id: publishers.id });
        const [game] = await db
            .insert(games)
            .values({ title: 'Gra', description: 'Opis', publisherId: publisher.id })
            .returning({ id: games.id });
        await db.insert(gameCategories).values({ gameId: game.id, categoryId: category.id });

        expect(
            (await getAllGames(db, { categoryIds: [], publisherId: publisher.id })).map((entry) => entry.title),
        ).toEqual(['Gra']);
    });
});
