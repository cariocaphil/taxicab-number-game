# The Taxicab Number Game

An interactive educational mathematics game inspired by the famous Hardy–Ramanujan number **1729**.

Players explore numbers that can be written as the sum of two positive integer cubes in more than one way. The classic example is:

**1729 = 1³ + 12³ = 9³ + 10³**

## Motivation

Taxicab numbers make abstract number theory tangible. By framing discovery around illustrated taxi number plates, the project aims to help learners notice patterns, form conjectures, and connect stories from mathematical history with hands-on exploration.

## The Hardy–Ramanujan story

In 1918, G. H. Hardy visited Srinivasa Ramanujan in hospital and remarked that the taxi he had taken bore the rather dull number 1729. Ramanujan replied at once that 1729 is actually remarkable: it is the smallest positive integer that can be expressed as the sum of two positive cubes in two different ways. That anecdote is the spark for this game.

## Mathematical domain

The pure TypeScript domain lives in `src/domain/taxicab/` and has **no React dependency**.

### Concept

A cube pair `(a, b)` with `1 ≤ a ≤ b` satisfies `a³ + b³ = target`. Some targets admit two or more distinct pairs. That property is what the game will explore.

**Taxicab(n)** (also written **Ta(n)**) is the conventional sequence of the *smallest* positive integers that can be written as a sum of two positive cubes in *n* distinct ways. **1729** is Ta(2). Other catalogue entries (4104, 13832, 20683) also have two representations, but they are larger than 1729 and are included as educational examples—not as further terms of Ta(n).

### Domain model

- `CubePair` — `{ a, b }` with the normalization invariant `1 ≤ a ≤ b`
- `TaxicabPuzzle` — `{ id, target, representations }` with no gameplay state

### Engine

- `cube`, `sumOfCubes`, `findCubePairs` — public `number` API with **BigInt** arithmetic internally
- `validatePuzzle` — structural checks plus set-equality against `findCubePairs` (the engine is the source of mathematical truth)

### Puzzle catalogue

`TAXICAB_PUZZLES` currently includes four verified targets: **1729**, **4104**, **13832**, and **20683**, each with two distinct cube-sum representations.

## Interactive game

The main UI (`GamePage`) loads the **1729** puzzle from the domain catalogue via `getPuzzleById` and never hardcodes cube pairs in React components.

Players see the target as a stylized taxi license plate and two hidden equations (`?³ + ?³ = 1729`). A reveal control progressively discloses each representation from the domain data. When every representation is visible, a short educational completion message explains why 1729 is special. Restart hides the answers again without reloading the page.

Reveal progression is driven by `useTaxicabGame`, which tracks only how many representations have been shown and derives completion from the puzzle’s actual representation count.

## Technology stack

- React 19
- TypeScript (strict mode)
- Vite
- pnpm
- Oxlint
- Vitest
- React Testing Library
- Plain CSS with CSS custom properties

## Getting started

### Prerequisites

- Node.js (compatible with the Vite toolchain)
- [pnpm](https://pnpm.io/) (this project pins `packageManager` to `pnpm@12.23.0`)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Domain unit tests run under Vitest’s node environment and do not require a browser.

### Production build

```bash
pnpm build
```

Preview the production build with:

```bash
pnpm preview
```

## Project status

- **PR #1** — Project Foundation & Application Shell
- **PR #2** — Taxicab Number Domain Model & Mathematical Engine
- **PR #3** — Interactive Taxicab Number Game (progressive reveal for 1729)

Further gallery, multi-puzzle discovery, and 3D visualization remain for later PRs.

## Roadmap (provisional)

- **PR #1** — Project Foundation & Application Shell
- **PR #2** — Taxicab Number Domain Model
- **PR #3** — Interactive Taxicab Number Game (progressive reveal)
- **PR #4** — Interactive Taxi Gallery / multi-puzzle selection
- **PR #5** — Number Discovery Game (player guesses)
- **PR #6** — Interactive 3D Cube Visualization

## License

Private project — rights reserved unless otherwise noted.
