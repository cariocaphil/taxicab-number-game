# The Taxicab Number Game

An interactive educational mathematics game inspired by the famous Hardy–Ramanujan number **1729**.

Players explore numbers that can be written as the sum of two positive integer cubes in more than one way. The classic example is:

**1729 = 1³ + 12³ = 9³ + 10³**

## Motivation

Taxicab numbers make abstract number theory tangible. By framing discovery around illustrated taxi number plates, the project aims to help learners notice patterns, form conjectures, and connect stories from mathematical history with hands-on exploration.

## The Hardy–Ramanujan story

In 1918, G. H. Hardy visited Srinivasa Ramanujan in hospital and remarked that the taxi he had taken bore the rather dull number 1729. Ramanujan replied at once that 1729 is actually remarkable: it is the smallest positive integer that can be expressed as the sum of two positive cubes in two different ways. That anecdote is the spark for this game.

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

### Production build

```bash
pnpm build
```

Preview the production build with:

```bash
pnpm preview
```

## Project status

This repository currently ships **PR #1 — Project Foundation & Application Shell**: a responsive landing page with branding, a mathematically accurate introduction to 1729, and illustrative (non-interactive) taxi plate placeholders. Game mechanics are intentionally out of scope for this PR.

## Roadmap (provisional)

- **PR #1** — Project Foundation & Application Shell
- **PR #2** — Taxicab Number Domain Model
- **PR #3** — Interactive Taxi Gallery
- **PR #4** — Number Discovery Game
- **PR #5** — Progressive Cube Revelation
- **PR #6** — Interactive 3D Cube Visualization

## License

Private project — rights reserved unless otherwise noted.
