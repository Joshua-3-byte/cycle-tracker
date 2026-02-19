import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast'; // ✅ Added this
import useAuth from '../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');  // ✅ Added toast
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #9b59b6 0%, #ff69b4 100%)',
      padding: '15px 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        
        {/* Logo */}
        <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>🌸 Cycle Tracker</h2>
        
        {/* Desktop Menu */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          alignItems: 'center',
        }} className="desktop-menu">

          <Link
            to="/dashboard"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              background: isActive('/dashboard') ? 'rgba(255,255,255,0.3)' : 'transparent',
              fontWeight: isActive('/dashboard') ? 'bold' : 'normal',
              transition: 'background 0.2s',
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/calendar"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              background: isActive('/calendar') ? 'rgba(255,255,255,0.3)' : 'transparent',
              fontWeight: isActive('/calendar') ? 'bold' : 'normal',
              transition: 'background 0.2s',
            }}
          >
            Calendar
          </Link>

          {/* Settings Desktop */}
          <Link
            to="/settings"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              background: isActive('/settings') ? 'rgba(255,255,255,0.3)' : 'transparent',
              fontWeight: isActive('/settings') ? 'bold' : 'normal',
              transition: 'background 0.2s',
            }}
          >
            Settings
          </Link>

          <span style={{ color: 'white', marginLeft: '10px' }}>Hi, {user?.name}!</span>
          
          <button
            onClick={handleLogout}
            style={{
              background: 'white',
              color: '#9b59b6',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          display: 'none',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid rgba(255,255,255,0.3)',
        }}>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '6px',
              background: isActive('/dashboard') ? 'rgba(255,255,255,0.3)' : 'transparent',
              fontWeight: isActive('/dashboard') ? 'bold' : 'normal',
            }}
          >
            Dashboard
          </Link>
          
          <Link
            to="/calendar"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '6px',
              background: isActive('/calendar') ? 'rgba(255,255,255,0.3)' : 'transparent',
              fontWeight: isActive('/calendar') ? 'bold' : 'normal',
            }}
          >
            Calendar
          </Link>

          {/* Settings Mobile */}
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '6px',
              background: isActive('/settings') ? 'rgba(255,255,255,0.3)' : 'transparent',
              fontWeight: isActive('/settings') ? 'bold' : 'normal',
            }}
          >
            Settings
          </Link>

          <div style={{ color: 'white', padding: '10px' }}>
            Hi, {user?.name}!
          </div>
          
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            style={{
              background: 'white',
              color: '#9b59b6',
              border: 'none',
              padding: '10px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* CSS for responsive behavior */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: block !important;
          }
          
          .mobile-menu {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
