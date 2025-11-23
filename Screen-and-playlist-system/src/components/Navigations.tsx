import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '10px 20px',
      borderBottom: '1px solid #dee2e6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link 
          to="/screens" 
          style={{ 
            marginRight: '20px',
            textDecoration: 'none',
            color: location.pathname === '/screens' ? '#007bff' : '#495057',
            fontWeight: location.pathname === '/screens' ? 'bold' : 'normal'
          }}
        >
          Screens
        </Link>
        <Link 
          to="/playlists" 
          style={{ 
            textDecoration: 'none',
            color: location.pathname === '/playlists' ? '#007bff' : '#495057',
            fontWeight: location.pathname === '/playlists' ? 'bold' : 'normal'
          }}
        >
          Playlists
        </Link>
      </div>
      <div>
        <span style={{ marginRight: '15px' }}>Welcome, {user?.email} ({user?.role})</span>
        <button 
          onClick={logout}
          style={{
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;