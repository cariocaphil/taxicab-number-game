import { Component, type ErrorInfo, type ReactNode } from 'react'

interface SceneErrorBoundaryProps {
  readonly onError: () => void
  readonly children: ReactNode
}

interface SceneErrorBoundaryState {
  readonly hasError: boolean
}

/**
 * Notifies the parent on failure only. The parent owns fallback UI so Explore
 * controls and the static diagram stay in one place (no dual fallback path).
 */
export class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  public state: SceneErrorBoundaryState = { hasError: false }

  public static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(_error: Error, _info: ErrorInfo): void {
    this.props.onError()
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}
