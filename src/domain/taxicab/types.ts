/**
 * A pair of positive integers whose cubes sum to a target.
 * Invariant: 1 <= a <= b (order-normalized; (a, b) and (b, a) are the same solution).
 */
export interface CubePair {
  readonly a: number
  readonly b: number
}

/**
 * A static educational puzzle: a target with at least two distinct cube-sum representations.
 * Does not include gameplay state.
 */
export interface TaxicabPuzzle {
  readonly id: string
  readonly target: number
  readonly representations: readonly CubePair[]
}

export type PuzzleValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly errors: readonly string[] }

/** Session phases for the two-part discovery experience. */
export type GamePhase = 'selecting' | 'revealing'
