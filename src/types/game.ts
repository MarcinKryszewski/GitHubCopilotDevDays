/**
 * Wspólne definicje typów dla danych o grach.
 * Te interfejsy opisują kształt zwracany przez helpery dostępu do danych
 * w `src/lib/games.ts` i używany przez strony oraz komponenty Astro.
 */

/** Wydawca gry (skrócona postać używana na listach). */
export interface Publisher {
    id: number;
    name: string;
}

/** Kategoria gry (skrócona postać używana na listach). */
export interface Category {
    id: number;
    name: string;
}

/** Gra wraz z powiązaną kategorią i wydawcą. */
export interface Game {
    id: number;
    title: string;
    description: string;
    publisher: Publisher | null;
    category: Category | null;
    starRating: number | null;
}
