import { describe, it, expect } from 'vitest';
import {
    parseGamesCsv,
    parseCsv,
    categoryDescription,
    publisherDescription,
    gameDescription,
    uniqueCategories,
    uniquePublishers,
    ratingFromTitle,
    type GameCsvRow,
} from './transforms';

describe('parseCsv', () => {
    it('parsuje pola w cudzysłowach zawierające przecinki', () => {
        const rows = parseCsv('A,B\n"witaj, świecie","x"');
        expect(rows).toEqual([{ A: 'witaj, świecie', B: 'x' }]);
    });

    it('obsługuje podwojone cudzysłowy', () => {
        const rows = parseCsv('A\n"powiedziała ""cześć"""');
        expect(rows[0].A).toBe('powiedziała "cześć"');
    });

    it('obsługuje znaki nowej linii wewnątrz pól w cudzysłowach', () => {
        const rows = parseCsv('A,B\n"linia1\nlinia2","y"');
        expect(rows[0].A).toBe('linia1\nlinia2');
        expect(rows[0].B).toBe('y');
    });

    it('zwraca pustą tablicę dla pustego wejścia', () => {
        expect(parseCsv('')).toEqual([]);
    });
});

describe('parseGamesCsv', () => {
    const csv = [
        'Title,Category,Publisher,Description',
        '"Gra A","Strategia","Wydawca Jeden","Opis A"',
        '"Gra B","Strategia","Wydawca Dwa","Opis B"',
        '', // końcowa pusta linia ma być zignorowana
    ].join('\n');

    it('mapuje wiersze na otypowane rekordy gier', () => {
        const rows = parseGamesCsv(csv);
        expect(rows).toHaveLength(2);
        expect(rows[0]).toEqual({
            title: 'Gra A',
            category: 'Strategia',
            publisher: 'Wydawca Jeden',
            description: 'Opis A',
        });
    });

    it('pomija wiersze bez tytułu', () => {
        const rows = parseGamesCsv('Title,Category,Publisher,Description\n,,,');
        expect(rows).toHaveLength(0);
    });
});

describe('helpery opisów', () => {
    it('buduje opis kategorii', () => {
        expect(categoryDescription('Strategia')).toBe(
            'Gry z kategorii Strategia dostępne w crowdfundingu',
        );
    });

    it('buduje opis wydawcy', () => {
        expect(publisherDescription('CodeForge')).toBe(
            'CodeForge to wydawca gier szukający finansowania na nowe tytuły',
        );
    });

    it('dokleja zdanie o crowdfundingu do opisu gry', () => {
        expect(gameDescription('Świetna gra.')).toBe(
            'Świetna gra. Wesprzyj tę grę na naszej platformie crowdfundingowej!',
        );
    });
});

describe('helpery usuwające duplikaty', () => {
    const rows: GameCsvRow[] = [
        { title: 'A', category: 'Strategia', publisher: 'W1', description: '' },
        { title: 'B', category: 'Łamigłówki', publisher: 'W1', description: '' },
        { title: 'C', category: 'Strategia', publisher: 'W2', description: '' },
    ];

    it('zwraca unikalne kategorie w kolejności pierwszego wystąpienia', () => {
        expect(uniqueCategories(rows)).toEqual(['Strategia', 'Łamigłówki']);
    });

    it('zwraca unikalnych wydawców w kolejności pierwszego wystąpienia', () => {
        expect(uniquePublishers(rows)).toEqual(['W1', 'W2']);
    });
});

describe('ratingFromTitle', () => {
    it('jest deterministyczna dla tego samego tytułu', () => {
        expect(ratingFromTitle('DevOps Dominion')).toBe(ratingFromTitle('DevOps Dominion'));
    });

    it('mieści się w domkniętym zakresie [3.0, 5.0]', () => {
        for (const title of ['A', 'Pipeline Conquest', 'zzz', 'Server Siege', '']) {
            const rating = ratingFromTitle(title);
            expect(rating).toBeGreaterThanOrEqual(3.0);
            expect(rating).toBeLessThanOrEqual(5.0);
        }
    });

    it('daje co najwyżej jedno miejsce po przecinku', () => {
        const rating = ratingFromTitle('Jakiś tytuł');
        expect(Math.round(rating * 10)).toBeCloseTo(rating * 10, 5);
    });
});
