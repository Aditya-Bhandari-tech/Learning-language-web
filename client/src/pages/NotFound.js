import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-illustration">
            <div className="error-number">404</div>
            <div className="error-icon">🔍</div>
          </div>
          
          <div className="error-text">
            <h1>Page Not Found</h1>
            <p>
              Oops! The page you're looking for seems to have wandered off. 
              Don't worry, even the best language learners get lost sometimes!
            </p>
          </div>
          
          <div className="error-actions">
            <button onClick={goBack} className="btn btn-outline">
              Go Back
            </button>
            
            <Link to={user ? "/dashboard" : "/"} className="btn btn-primary">
              {user ? "Go to Dashboard" : "Go Home"}
            </Link>
          </div>
          
          {user && (
            <div className="quick-links">
              <p>Or try one of these popular sections:</p>
              <div className="links-grid">
                <Link to="/lessons" className="quick-link">
                  📖 Lessons
                </Link>
                <Link to="/flashcards" className="quick-link">
                  🎴 Flashcards
                </Link>
                <Link to="/vocabulary" className="quick-link">
                  📝 Vocabulary
                </Link>
                <Link to="/progress" className="quick-link">
                  📊 Progress
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .not-found-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 80px);
          padding: var(--spacing-8) 0;
          text-align: center;
        }

        .not-found-content {
          max-width: 600px;
          width: 100%;
        }

        .error-illustration {
          position: relative;
          margin-bottom: var(--spacing-8);
        }

        .error-number {
          font-size: 8rem;
          font-weight: 900;
          color: var(--primary-color);
          opacity: 0.2;
          line-height: 1;
          margin-bottom: var(--spacing-4);
        }

        .error-icon {
          font-size: 4rem;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }

        .error-text {
          margin-bottom: var(--spacing-8);
        }

        .error-text h1 {
          font-size: var(--text-3xl);
          font-weight: 700;
          margin-bottom: var(--spacing-4);
          color: var(--text-primary);
        }

        .error-text p {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-6);
        }

        .error-actions {
          display: flex;
          gap: var(--spacing-4);
          justify-content: center;
          margin-bottom: var(--spacing-8);
        }

        .quick-links {
          margin-top: var(--spacing-8);
          padding-top: var(--spacing-8);
          border-top: 1px solid var(--border-color);
        }

        .quick-links p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-4);
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: var(--spacing-3);
          max-width: 400px;
          margin: 0 auto;
        }

        .quick-link {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          text-decoration: none;
          color: var(--text-primary);
          font-size: var(--text-sm);
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .quick-link:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .error-number {
            font-size: 6rem;
          }

          .error-icon {
            font-size: 3rem;
          }

          .error-text h1 {
            font-size: var(--text-2xl);
          }

          .error-text p {
            font-size: var(--text-base);
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .links-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
