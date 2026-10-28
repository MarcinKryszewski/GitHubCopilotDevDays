/**
 * Czyste funkcje formatujące ocenę gry w gwiazdkach.
 *
 * Bez zależności od frameworka i bez efektów ubocznych, żeby dało się je
 * testować jednostkowo bez środowiska Astro (zob. `ratings.test.ts`).
 * Używane przez komponent `StarRating.astro`.
 */

/**
 * Przycina ocenę do wyświetlanego zakresu 0–5.
 */
export function clampRating(rating: number): number {
    return Math.min(5, Math.max(0, rating));
}

/**
 * Buduje ciąg gwiazdek dla oceny z zakresu 0–5.
 *
 * Renderuje pełne gwiazdki (★), opcjonalną połówkę (½) i puste (☆). Dla
 * `null` zwraca `'Brak oceny'`. Ocena jest przycinana do zakresu 0–5, więc
 * wynik ma zawsze dokładnie pięć pozycji.
 */
export function formatStarRating(rating: number | null): string {
    if (rating === null) return 'Brak oceny';

    const clamped = clampRating(rating);
    const fullStars = Math.floor(clamped);
    const halfStar = clamped % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}
