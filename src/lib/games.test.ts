import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../db/test-helpers';
import { categories, publishers, games } from '../../db/schema';
import type { Database } from './db';
import {
    getAllGames,
    getAllGameIds,
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
        await db.insert(games).values({
            title: `Gra ${String(i).padStart(2, '0')}`,
            description: `Opis ${i}`,
            starRating: 4.2,
            categoryId: category.id,
            publisherId: publisher.id,
        });
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
        expect(all[0].category).toEqual({ id: expect.any(Number), name: 'Strategia' });
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
});
