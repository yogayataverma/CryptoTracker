import React from 'react';
import CryptoTable from './components/CryptoTable';

function App() {
  return (
    <div className="min-vh-100 bg-dark" style={{ background: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }}>
      <header className="py-4 mb-4">
        <h1
          className="display-4 fw-bold text-center mb-0"
          style={{
            background: 'linear-gradient(90deg, #f8fafc 0%, #a5b4fc 50%, #f3e8ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 8px rgba(0,0,0,0.25)',
            letterSpacing: '2px',
          }}
        >
          Crypto Tracker
        </h1>
      </header>
      <main>
        <CryptoTable />
      </main>
    </div>
  );
}

export default App; 