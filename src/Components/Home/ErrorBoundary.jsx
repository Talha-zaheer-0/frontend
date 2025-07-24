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
        <div style={{ fontSize: '4rem', animation: 'bounce 1s infinite' }}>😵</div>
        <p className="text-danger fw-semibold mt-3">
          Oops! Something went wrong.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '10px 20px',
            border: 'none',
            backgroundColor: '#fda085',
            color: '#fff',
            borderRadius: '999px',
            cursor: 'pointer',
          }}
        >
          Reload Page
        </button>
        <style>
          {`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}
        </style>
      </div>
    );
  }
  return this.props.children;
}

}

export default ErrorBoundary;