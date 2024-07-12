import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<
  any,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary: ', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <FallbackLayout />
    }

    return this.props.children
  }
}

const FallbackLayout = () => {
  return (
    <div>
      <h1>Something went wrong.</h1>
      {/* Additional UI or recovery options */}
    </div>
  )
}
