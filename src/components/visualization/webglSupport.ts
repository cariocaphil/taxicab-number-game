/**
 * WebGL capability helpers. Isolated so tests can mock without a real GPU.
 */

let cachedAvailability: boolean | undefined

/**
 * Returns whether this environment can create a WebGL context.
 * The probe result is cached so repeated mounts do not allocate throwaway contexts.
 */
export function isWebGLAvailable(): boolean {
  if (cachedAvailability !== undefined) {
    return cachedAvailability
  }

  cachedAvailability = probeWebGL()
  return cachedAvailability
}

/**
 * Clears the cached probe result. Used by tests and any future recovery path
 * that needs to re-check after a context-loss / driver change.
 */
export function resetWebGLAvailabilityCache(): void {
  cachedAvailability = undefined
}

function probeWebGL(): boolean {
  if (typeof document === 'undefined') {
    return false
  }

  try {
    const canvas = document.createElement('canvas')
    const context =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    return context !== null
  } catch {
    return false
  }
}
