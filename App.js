// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ClientForm from './ClientForm'; // Import ClientForm
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/clients" element={<ClientForm />} /> {/* Add ClientForm route */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
