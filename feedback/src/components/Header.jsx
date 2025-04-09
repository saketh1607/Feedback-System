// src/components/Header.jsx
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = auth.currentUser;

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className={`app-header ${theme}-theme ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-wrapper">
          {/* Logo and brand */}
          <div className="brand-section">
            <Link to="/" className="brand-logo">
              <span className="logo-icon">📝</span>
              <span className="brand-name">Feedback Collector</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="desktop-nav">
              <Link to="/" className="nav-link">
                <span className="nav-icon">🏠</span>
                <span>Home</span>
              </Link>
              {user && (
                <Link to="/admin" className="nav-link">
                  <span className="nav-icon">📊</span>
                  <span>Dashboard</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right side controls */}
          <div className="header-controls">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
              <span className="toggle-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {/* Auth Section */}
            <div className="auth-controls">
              {user ? (
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-avatar">{user.email?.charAt(0).toUpperCase() || '👤'}</span>
                    <span className="user-name hide-mobile">{user.displayName || user.email?.split('@')[0] || 'User'}</span>
                  </div>
                  <button onClick={handleLogout} className="logout-btn">
                    <span className="btn-icon">🚪</span>
                    <span className="btn-text">Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="login-btn">
                  <span className="btn-icon">🔑</span>
                  <span className="btn-text">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="mobile-menu-btn"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </Link>
            {user && (
              <Link to="/admin" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}