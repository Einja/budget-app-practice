import React, { useState } from 'react';
import api from './services/api'; // Import the api configuration

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      console.log(response.data); // This should log the JWT token from the backend
    } 
    catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="App">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default App;
