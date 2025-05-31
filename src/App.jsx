import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
  const [appState, setAppState] = useState('login');

  return (
    <div className="min-h-screen bg-gray-100">
      {appState === 'login' ? (
        <Login setAppState={setAppState} />
      ) : (
        <Signup setAppState={setAppState} />
      )}
    </div>
  );
}

export default App;