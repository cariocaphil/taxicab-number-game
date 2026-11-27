# The Taxicab Number Game

An interactive educational mathematics game inspired by the famous Hardy–Ramanujan number **1729** and the broader sequence of numbers that share its remarkable property.

## Motivation

Taxicab numbers make abstract number theory tangible. By framing discovery around illustrated taxi number plates, the project aims to help learners notice patterns, form conjectures, and connect stories from mathematical history with hands-on exploration.

## The Hardy–Ramanujan story

In 1918, G. H. Hardy visited Srinivasa Ramanujan in hospital and remarked that the taxi he had taken bore the rather dull number 1729. Ramanujan replied at once that 1729 is actually remarkable: it is the smallest positive integer that can be expressed as the sum of two positive cubes in two different ways. That anecdote is the spark for this game.

## Mathematical foundation

The game explores numbers from **OEIS [A001235](https://oeis.org/A001235)**: positive integers that can be written as the sum of two positive integer cubes in **at least two** distinct ways. Classic examples include 1729, 4104, 13832, and many larger values.

This is broader than the strict **Taxicab / Ta(n)** sequence, which identifies only the *smallest* positive integer with *n* distinct representations. **1729** is Ta(2). Later catalogue entries also have two representations, but they are larger educational examples from A001235 — not further Ta(n) terms.

The project keeps the name *Taxicab Number Game* while using mathematically accurate explanations in the UI and documentation.

## Two-phase game experience

### Phase 1 — Spot the taxicab number

Players see six selectable taxis with mixed **four-, five-, and six-digit** license plates (exactly two of each length). Exactly one plate is an A001235 number from the curated catalogue. Incorrect picks give accessible feedback; a correct pick locks the fleet and offers **Continue**.

### Phase 2 — Reveal the representations

Continue unlocks the progressive reveal experience: the discovered number appears on a taxi plate with two hidden cube-sum equations. Players reveal each representation from domain data. After completion they can start a **New round** with a fresh target and distractors.

Surrounding chrome (such as the header brand) does not reveal the current target.

## Mathematical domain

The pure TypeScript domain lives in `src/domain/taxicab/` and has **no React dependency**.

### Domain model

- `CubePair` — `{ a, b }` with the normalization invariant `1 ≤ a ≤ b`
- `TaxicabPuzzle` — `{ id, target, representations }` with no gameplay state
- `TaxicabRound` — `{ puzzle, candidates }` for a selection round

### Engine

- `cube`, `sumOfCubes`, `findCubePairs` — public `number` API with **BigInt** arithmetic internally
- `validatePuzzle` — structural checks plus set-equality against `findCubePairs`
- `generateTaxicabRound` — mixed-digit round generation with injectable randomness

### Puzzle catalogue

`TAXICAB_PUZZLES` is a local, deterministic curated subset of A001235 (≥12 puzzles) covering four-, five-, and six-digit targets. Each entry for this PR has **exactly two** representations, verified against `findCubePairs`. Existing IDs such as `1729` remain stable. There is **no** runtime OEIS fetch.

### Round generation strategy

Each round:

1. Picks a catalogue puzzle at random (avoiding an immediate repeat of the previous target when alternatives exist).
2. Builds digit quotas `{4:2, 5:2, 6:2}`, consuming one slot for the target’s length.
3. Fills remaining slots with **distractors** of the required length.

Distractors are **not** assumed incorrect merely because they are absent from the catalogue. Each candidate is checked with `findCubePairs` and accepted only when it has fewer than two distinct positive cube-pair representations.

Generation uses **bounded random sampling** (128 attempts) then a **capped sequential fallback** (256 probes) so rounds always terminate — including under pathological deterministic RNG. Candidate order is shuffled with Fisher–Yates.

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
- **PR #3** — Interactive Taxicab Number Game (progressive reveal)
- **PR #4** — Spot the Taxicab Number (A001235 selection + dynamic reveal)

## Roadmap (provisional)

- **PR #1** — Project Foundation & Application Shell
- **PR #2** — Taxicab Number Domain Model
- **PR #3** — Interactive Taxicab Number Game (progressive reveal)
- **PR #4** — Spot the Taxicab Number (mixed-digit discovery + dynamic reveal)
- **PR #5** — Number Discovery Game (player guesses)
- **PR #6** — Interactive 3D Cube Visualization

## License

Private project — rights reserved unless otherwise noted.
