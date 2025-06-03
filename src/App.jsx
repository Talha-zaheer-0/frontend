import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductsPage from './components/ProductsPage';
import CartPage from './components/CartPage';

function App() {
  const [appState, setAppState] = useState('landing');

  return (
    <div> 
      {appState === 'landing' && (
        <ErrorBoundary>
          <LandingPage setAppState={setAppState} />
        </ErrorBoundary>
      )}
      {appState === 'login' && (
        <ErrorBoundary>
          <Login setAppState={setAppState} />
        </ErrorBoundary>
      )}
      {appState === 'signup' && (
        <ErrorBoundary>
          <Signup setAppState={setAppState} />
        </ErrorBoundary>
      )}
      {appState === 'products' && (
        <ErrorBoundary>
          <ProductsPage setAppState={setAppState} />
        </ErrorBoundary>
      )}
      {appState === 'cart' && (
        <ErrorBoundary>
          <CartPage setAppState={setAppState} />
        </ErrorBoundary>
      )}
    </div>
  );
}

export default App;