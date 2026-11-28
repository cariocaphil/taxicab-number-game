/**
 * WebGL capability helpers. Isolated so tests can mock without a real GPU.
 */

export function isWebGLAvailable(): boolean {
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
