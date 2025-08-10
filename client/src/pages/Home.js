import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '🎯',
      title: 'Interactive Lessons',
      description: 'Learn through engaging, bite-sized lessons designed by language experts.'
    },
    {
      icon: '🎴',
      title: 'Smart Flashcards',
      description: 'Master vocabulary with our spaced repetition system that adapts to your learning pace.'
    },
    {
      icon: '🧠',
      title: 'Adaptive Quizzes',
      description: 'Test your knowledge with quizzes that adjust difficulty based on your progress.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and achievement badges.'
    },
    {
      icon: '🏆',
      title: 'Gamification',
      description: 'Stay motivated with streaks, levels, and friendly competition with other learners.'
    },
    {
      icon: '🌍',
      title: 'Multiple Languages',
      description: 'Choose from a variety of languages including Spanish, French, German, and more.'
    }
  ];

  const languages = [
    { name: 'Spanish', flag: '🇪🇸', learners: '2.3M' },
    { name: 'French', flag: '🇫🇷', learners: '1.8M' },
    { name: 'German', flag: '🇩🇪', learners: '1.2M' },
    { name: 'Italian', flag: '🇮🇹', learners: '890K' },
    { name: 'Portuguese', flag: '🇵🇹', learners: '750K' },
    { name: 'Japanese', flag: '🇯🇵', learners: '1.1M' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Master Any Language with
                <span className="gradient-text"> LinguaLearn</span>
              </h1>
              <p className="hero-description">
                Join millions of learners worldwide and start your language journey today. 
                Our personalized approach makes learning fun, effective, and addictive.
              </p>
              <div className="hero-actions">
                {user ? (
                  <Link to="/dashboard" className="btn btn-primary btn-lg">
                    Continue Learning
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Start Learning Free
                    </Link>
                    <Link to="/login" className="btn btn-outline btn-lg">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">5M+</span>
                  <span className="stat-label">Active Learners</span>
                </div>
                <div className="stat">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">Languages</span>
                </div>
                <div className="stat">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card">
                <div className="card-header">
                  <h3>Today's Progress</h3>
                </div>
                <div className="card-body">
                  <div className="progress-item">
                    <span>Spanish</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <span>Vocabulary</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <span>Grammar</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose LinguaLearn?</h2>
            <p className="section-description">
              Our comprehensive platform combines proven learning methods with modern technology
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="languages">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Languages</h2>
            <p className="section-description">
              Join learners from around the world studying these popular languages
            </p>
          </div>
          <div className="languages-grid">
            {languages.map((language, index) => (
              <div key={index} className="language-card">
                <div className="language-flag">{language.flag}</div>
                <h3 className="language-name">{language.name}</h3>
                <p className="language-learners">{language.learners} learners</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Language Journey?</h2>
            <p className="cta-description">
              Join millions of learners and discover how fun and effective language learning can be.
            </p>
            {!user && (
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started for Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
          padding: var(--spacing-16) 0 var(--spacing-12) 0;
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-12);
          align-items: center;
        }

        .hero-title {
          font-size: var(--text-4xl);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: var(--spacing-6);
        }

        .gradient-text {
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: var(--text-lg);
          margin-bottom: var(--spacing-8);
          opacity: 0.9;
        }

        .hero-actions {
          display: flex;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-8);
        }

        .hero-stats {
          display: flex;
          gap: var(--spacing-8);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: var(--text-2xl);
          font-weight: 700;
        }

        .stat-label {
          font-size: var(--text-sm);
          opacity: 0.8;
        }

        .hero-visual {
          display: flex;
          justify-content: center;
        }

        .hero-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          width: 100%;
          max-width: 400px;
        }

        .progress-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-4);
        }

        .progress-item span {
          flex: 1;
          font-weight: 500;
        }

        .features {
          padding: var(--spacing-16) 0;
          background-color: var(--bg-secondary);
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-12);
        }

        .section-title {
          font-size: var(--text-3xl);
          font-weight: 700;
          margin-bottom: var(--spacing-4);
        }

        .section-description {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-8);
        }

        .feature-card {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-8);
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-4);
        }

        .feature-title {
          font-size: var(--text-xl);
          font-weight: 600;
          margin-bottom: var(--spacing-3);
        }

        .feature-description {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .languages {
          padding: var(--spacing-16) 0;
        }

        .languages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-6);
        }

        .language-card {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }

        .language-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .language-flag {
          font-size: 3rem;
          margin-bottom: var(--spacing-3);
        }

        .language-name {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-2);
        }

        .language-learners {
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }

        .cta {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
          padding: var(--spacing-16) 0;
          text-align: center;
        }

        .cta-title {
          font-size: var(--text-3xl);
          font-weight: 700;
          margin-bottom: var(--spacing-4);
        }

        .cta-description {
          font-size: var(--text-lg);
          margin-bottom: var(--spacing-8);
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-8);
            text-align: center;
          }

          .hero-title {
            font-size: var(--text-2xl);
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero-stats {
            justify-content: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .languages-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
