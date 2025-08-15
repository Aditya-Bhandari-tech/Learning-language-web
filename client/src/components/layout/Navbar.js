import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Brand */}
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            🌍 LangSphere
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav navbar-desktop">
            {user ? (
              // Authenticated user navigation
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/lessons" 
                  className={`nav-link ${isActive('/lessons') ? 'active' : ''}`}
                >
                  Lessons
                </Link>
                <Link 
                  to="/flashcards" 
                  className={`nav-link ${isActive('/flashcards') ? 'active' : ''}`}
                >
                  Flashcards
                </Link>
                <Link 
                  to="/quiz" 
                  className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}
                >
                  Quiz
                </Link>
                <Link 
                  to="/vocabulary" 
                  className={`nav-link ${isActive('/vocabulary') ? 'active' : ''}`}
                >
                  Vocabulary
                </Link>
                <Link 
                  to="/progress" 
                  className={`nav-link ${isActive('/progress') ? 'active' : ''}`}
                >
                  Progress
                </Link>
                <Link 
                  to="/achievements" 
                  className={`nav-link ${isActive('/achievements') ? 'active' : ''}`}
                >
                  Achievements
                </Link>

                {/* User Menu */}
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-name text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <div className="user-level">
                      <span className="badge badge-primary text-xs">
                        {user.role === 'admin' ? 'Admin' : 'Learner'}
                      </span>
                      {user.learningLanguages?.[0]?.language && (
                        <span className="badge badge-secondary text-xs ml-1">
                          {user.learningLanguages[0].language}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="user-actions">
                    <Link 
                      to="/profile" 
                      className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={confirmLogout}
                      className="btn btn-outline btn-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Public navigation
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary btn-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {user ? (
              // Authenticated mobile menu
              <>
                <div className="mobile-user-info">
                  <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                    <div className="user-avatar">
                      <div className="w-10 h-10 bg-primary-color text-white rounded-full flex items-center justify-center font-semibold">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-secondary">
                        {user.email}
                      </div>
                      <div className="text-xs mt-1">
                        <span className="badge badge-primary">
                          {user.role === 'admin' ? 'Admin' : 'Learner'}
                        </span>
                        {user.learningLanguages?.[0]?.language && (
                          <span className="badge badge-secondary ml-1">
                            {user.learningLanguages[0].language}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mobile-nav-links">
                  <Link 
                    to="/dashboard" 
                    className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    📊 Dashboard
                  </Link>
                  <Link 
                    to="/lessons" 
                    className={`mobile-nav-link ${isActive('/lessons') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    📖 Lessons
                  </Link>
                  <Link 
                    to="/flashcards" 
                    className={`mobile-nav-link ${isActive('/flashcards') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    🎴 Flashcards
                  </Link>
                  <Link 
                    to="/quiz" 
                    className={`mobile-nav-link ${isActive('/quiz') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    🧠 Quiz
                  </Link>
                  <Link 
                    to="/vocabulary" 
                    className={`mobile-nav-link ${isActive('/vocabulary') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    📝 Vocabulary
                  </Link>
                  <Link 
                    to="/progress" 
                    className={`mobile-nav-link ${isActive('/progress') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    📈 Progress
                  </Link>
                  
                  <div className="mobile-nav-divider"></div>
                  
                  <Link 
                    to="/settings" 
                    className={`mobile-nav-link ${isActive('/settings') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    ⚙️ Settings
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    👤 Profile
                  </Link>
                  <button 
                    onClick={confirmLogout}
                    className="mobile-nav-link logout-btn"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              // Public mobile menu
              <div className="mobile-nav-links">
                <Link 
                  to="/login" 
                  className={`mobile-nav-link ${isActive('/login') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  🔑 Login
                </Link>
                <Link 
                  to="/register" 
                  className="mobile-nav-link register-btn"
                  onClick={closeMenu}
                >
                  🚀 Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar-desktop {
          display: flex;
          align-items: center;
          gap: var(--spacing-6);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .user-name {
          color: var(--text-primary);
        }

        .user-level {
          margin-top: var(--spacing-1);
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-2);
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          width: 24px;
          height: 18px;
          position: relative;
        }

        .hamburger span {
          display: block;
          height: 2px;
          width: 100%;
          background-color: var(--text-primary);
          margin-bottom: 4px;
          transition: all 0.3s ease;
          transform-origin: left center;
        }

        .hamburger span:last-child {
          margin-bottom: 0;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg);
        }

        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-primary);
          border-top: 1px solid var(--border-color);
          z-index: 999;
          overflow-y: auto;
        }

        .mobile-menu-content {
          padding: var(--spacing-4);
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .mobile-nav-link {
          display: block;
          padding: var(--spacing-4);
          color: var(--text-primary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          font-weight: 500;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background-color: rgba(37, 99, 235, 0.1);
          color: var(--primary-color);
        }

        .mobile-nav-link.logout-btn {
          color: var(--error-color);
          background: none;
          border: none;
          text-align: left;
          width: 100%;
          cursor: pointer;
        }

        .mobile-nav-link.register-btn {
          background-color: var(--primary-color);
          color: var(--white);
          text-align: center;
          font-weight: 600;
        }

        .mobile-nav-divider {
          height: 1px;
          background-color: var(--border-color);
          margin: var(--spacing-4) 0;
        }

        @media (max-width: 768px) {
          .navbar-desktop {
            display: none;
          }

          .mobile-menu-toggle {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }

        /* Logout Confirmation Modal */
        .logout-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .logout-modal-content {
          background-color: var(--bg-primary);
          padding: var(--spacing-6);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          max-width: 400px;
          width: 90%;
          text-align: center;
        }

        .logout-modal-title {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-4);
          color: var(--text-primary);
        }

        .logout-modal-buttons {
          display: flex;
          gap: var(--spacing-3);
          justify-content: center;
          margin-top: var(--spacing-4);
        }

        .logout-modal-btn {
          padding: var(--spacing-3) var(--spacing-6);
          border-radius: var(--radius-md);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .logout-modal-btn.cancel {
          background-color: var(--gray-100);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }

        .logout-modal-btn.confirm {
          background-color: var(--error-color);
          color: var(--white);
          border: 1px solid var(--error-color);
        }

        .logout-modal-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal" onClick={cancelLogout}>
          <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-title">Confirm Logout</div>
            <p>Are you sure you want to logout?</p>
            <div className="logout-modal-buttons">
              <button className="logout-modal-btn cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="logout-modal-btn confirm" onClick={handleLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
