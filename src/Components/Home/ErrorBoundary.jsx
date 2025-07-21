import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center my-5">
          <p className="text-danger fw-semibold">
            Something went wrong. Please try again later.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;