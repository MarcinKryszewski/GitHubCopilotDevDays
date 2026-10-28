import { describe, it, expect } from 'vitest';
import { clampRating, formatStarRating } from './ratings';

describe('clampRating', () => {
    it('zwraca wartość bez zmian, gdy mieści się w zakresie', () => {
        expect(clampRating(0)).toBe(0);
        expect(clampRating(3.5)).toBe(3.5);
        expect(clampRating(5)).toBe(5);
    });

    it('przycina wartości spoza zakresu 0–5', () => {
        expect(clampRating(-2)).toBe(0);
        expect(clampRating(7)).toBe(5);
    });
});

describe('formatStarRating', () => {
    it('zwraca komunikat o braku oceny dla null', () => {
        expect(formatStarRating(null)).toBe('Brak oceny');
    });

    it('renderuje tylko pełne i puste gwiazdki dla liczb całkowitych', () => {
        expect(formatStarRating(0)).toBe('☆☆☆☆☆');
        expect(formatStarRating(3)).toBe('★★★☆☆');
        expect(formatStarRating(5)).toBe('★★★★★');
    });

    it('renderuje połówkę gwiazdki, gdy część ułamkowa wynosi co najmniej 0.5', () => {
        expect(formatStarRating(3.5)).toBe('★★★½☆');
        expect(formatStarRating(4.75)).toBe('★★★★½');
    });

    it('zaokrągla części ułamkowe poniżej 0.5 w dół do pełnej gwiazdki', () => {
        expect(formatStarRating(3.4)).toBe('★★★☆☆');
    });

    it('zawsze daje pięć pozycji gwiazdek', () => {
        for (const rating of [0, 1, 2.5, 3.5, 4, 5]) {
            expect([...formatStarRating(rating)]).toHaveLength(5);
        }
    });

    it('przycina oceny spoza zakresu 0–5', () => {
        expect(formatStarRating(-1)).toBe('☆☆☆☆☆');
        expect(formatStarRating(6)).toBe('★★★★★');
    });

    it('jest deterministyczna dla tego samego wejścia', () => {
        expect(formatStarRating(3.5)).toBe(formatStarRating(3.5));
    });
});
