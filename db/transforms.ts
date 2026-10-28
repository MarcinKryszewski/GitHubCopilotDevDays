/**
 * Czyste funkcje bez efektów ubocznych, które zamieniają CSV z danymi
 * startowymi na rekordy bazy. Trzymane osobno od dostępu do bazy, żeby dało
 * się je testować w izolacji i użyć w skrypcie zasilającym.
 */

export interface GameCsvRow {
    title: string;
    category: string;
    publisher: string;
    description: string;
}

const CROWDFUNDING_BLURB = ' Wesprzyj tę grę na naszej platformie crowdfundingowej!';

/**
 * Minimalny parser CSV w stylu RFC 4180: obsługuje pola w cudzysłowach,
 * cudzysłowy podwojone ("") i znaki nowej linii wewnątrz pól. Zwraca wiersze
 * jako obiekty z kluczami z nagłówka.
 */
export function parseCsv(content: string): Record<string, string>[] {
    const records: string[][] = [];
    let field = '';
    let record: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        if (inQuotes) {
            if (char === '"') {
                if (content[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field += char;
            }
            continue;
        }

        if (char === '"') {
            inQuotes = true;
        } else if (char === ',') {
            record.push(field);
            field = '';
        } else if (char === '\n' || char === '\r') {
            // CRLF: pomiń sparowany \n.
            if (char === '\r' && content[i + 1] === '\n') {
                i++;
            }
            record.push(field);
            field = '';
            if (record.some((value) => value.length > 0) || record.length > 1) {
                records.push(record);
            }
            record = [];
        } else {
            field += char;
        }
    }

    // Dopchnij ostatnie pole/wiersz (plik bez końcowego znaku nowej linii).
    if (field.length > 0 || record.length > 0) {
        record.push(field);
        if (record.some((value) => value.length > 0)) {
            records.push(record);
        }
    }

    if (records.length === 0) {
        return [];
    }

    const [header, ...rows] = records;
    return rows.map((row) => {
        const entry: Record<string, string> = {};
        header.forEach((key, index) => {
            entry[key] = row[index] ?? '';
        });
        return entry;
    });
}

/** Parsuje CSV z grami na otypowane wiersze. */
export function parseGamesCsv(content: string): GameCsvRow[] {
    return parseCsv(content)
        .filter((row) => (row.Title ?? '').trim().length > 0)
        .map((row) => ({
            title: row.Title.trim(),
            category: row.Category.trim(),
            publisher: row.Publisher.trim(),
            description: row.Description.trim(),
        }));
}

export function categoryDescription(name: string): string {
    return `Gry z kategorii ${name} dostępne w crowdfundingu`;
}

export function publisherDescription(name: string): string {
    return `${name} to wydawca gier szukający finansowania na nowe tytuły`;
}

export function gameDescription(rawDescription: string): string {
    return rawDescription + CROWDFUNDING_BLURB;
}

/** Unikalne nazwy kategorii w kolejności pierwszego wystąpienia. */
export function uniqueCategories(rows: GameCsvRow[]): string[] {
    return [...new Set(rows.map((row) => row.category))];
}

/** Unikalne nazwy wydawców w kolejności pierwszego wystąpienia. */
export function uniquePublishers(rows: GameCsvRow[]): string[] {
    return [...new Set(rows.map((row) => row.publisher))];
}

/**
 * Deterministycznie wylicza ocenę z zakresu [3.0, 5.0] (jedno miejsce po
 * przecinku) z tytułu gry. Stabilny hash zamiast Math.random sprawia, że
 * statyczne buildy są powtarzalne.
 */
export function ratingFromTitle(title: string): number {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
    }
    // 21 koszyków -> 3.0, 3.1, ... 5.0
    const tenths = hash % 21;
    return Math.round((3.0 + tenths / 10) * 10) / 10;
}
