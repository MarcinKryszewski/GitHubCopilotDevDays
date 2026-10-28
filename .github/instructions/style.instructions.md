---
description: 'Wzorce stylowania Tailwind CSS v4 i wytyczne ciemnego motywu'
applyTo: '**/*.{astro,css}'
---

# Instrukcje dla Tailwind CSS

## Konfiguracja Tailwind CSS v4

Projekt używa Tailwind CSS v4.1.14 przez wtyczkę `@tailwindcss/vite`.

### Konfiguracja globalnego CSS

- Importuj Tailwind w `global.css`: `@import "tailwindcss";`
- Nie używamy osobnego pliku `tailwind.config.js`
- Konfiguracja odbywa się przez wtyczkę Vite

## Stylowanie w ciemnym motywie

WSZYSTKIE komponenty UI MUSZĄ używać kolorów ciemnego motywu:

### Paleta kolorów

- Kolory tła: `bg-slate-800`, `bg-slate-900`, `bg-slate-950`
- Kolory tekstu: `text-slate-100`, `text-slate-200`, `text-slate-300`
- Kolory obramowań: `border-slate-700`, `border-slate-600`
- Kolory akcentów dla stanów hover/fokusu

### Typowe wzorce

- Karty i kontenery: `bg-slate-800 rounded-xl p-6 shadow-lg`
- Efekty hover: `hover:bg-slate-700 transition-colors duration-200`
- Obramowania: `border border-slate-700`
- Gradienty dla urozmaicenia wizualnego: `bg-gradient-to-br from-slate-800 to-slate-900`
- Efekty tła (backdrop): `backdrop-blur-sm bg-slate-900/50`

### Responsywność

- Używaj prefiksów responsywnych: `sm:`, `md:`, `lg:`, `xl:`
- Podejście mobile-first
- Zadbaj o czytelność na wszystkich rozmiarach ekranu

## Klasy narzędziowe

- Gdy to możliwe, preferuj klasy narzędziowe zamiast własnego CSS
- Grupuj je semantycznie: układ, odstępy, kolory, typografia
- Dbaj o to, żeby kombinacje klas były czytelne i łatwe w utrzymaniu

## Nowoczesne wzorce UI

- Zaokrąglone rogi: `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Płynne przejścia: `transition-all duration-200 ease-in-out`
- Cienie dla głębi: `shadow-md`, `shadow-lg`, `shadow-xl`
- Stany fokusu dla dostępności: `focus:ring-2 focus:ring-blue-500`
