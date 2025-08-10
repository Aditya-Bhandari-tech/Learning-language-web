import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { updateProgress } = useLearning();
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatar: '',
    nativeLanguage: 'English',
    learningLanguages: [],
    dailyGoal: 10,
    notifications: {
      email: true,
      push: true,
      reminders: true
    },
    privacy: {
      profilePublic: false,
      showProgress: true,
      allowMessages: true
    },
    preferences: {
      theme: 'light',
      soundEnabled: true,
      autoPlay: false
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Russian', 'Japanese', 'Chinese', 'Korean',
    'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian'
  ];

  const themes = ['light', 'dark', 'auto'];
  const dailyGoals = [5, 10, 15, 20, 25, 30];

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setProfileData({
        firstName: user?.firstName || 'John',
        lastName: user?.lastName || 'Doe',
        email: user?.email || 'john.doe@example.com',
        avatar: user?.avatar || '',
        nativeLanguage: 'English',
        learningLanguages: ['French', 'Spanish'],
        dailyGoal: 10,
        notifications: {
          email: true,
          push: true,
          reminders: true
        },
        privacy: {
          profilePublic: false,
          showProgress: true,
          allowMessages: true
        },
        preferences: {
          theme: 'light',
          soundEnabled: true,
          autoPlay: false
        }
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleLanguageToggle = (language) => {
    setProfileData(prev => ({
      ...prev,
      learningLanguages: prev.learningLanguages.includes(language)
        ? prev.learningLanguages.filter(lang => lang !== language)
        : [...prev.learningLanguages, language]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(profileData);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setProfileData({
      firstName: user?.firstName || 'John',
      lastName: user?.lastName || 'Doe',
      email: user?.email || 'john.doe@example.com',
      avatar: user?.avatar || '',
      nativeLanguage: 'English',
      learningLanguages: ['French', 'Spanish'],
      dailyGoal: 10,
      notifications: {
        email: true,
        push: true,
        reminders: true
      },
      privacy: {
        profilePublic: false,
        showProgress: true,
        allowMessages: true
      },
      preferences: {
        theme: 'light',
        soundEnabled: true,
        autoPlay: false
      }
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile & Settings</h1>
        <div className="header-actions">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                onClick={handleSave}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        {/* Personal Information */}
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" />
                ) : (
                  <span>{profileData.firstName[0]}{profileData.lastName[0]}</span>
                )}
              </div>
              {isEditing && (
                <button className="avatar-upload-btn">Change Photo</button>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Native Language</label>
              <select
                value={profileData.nativeLanguage}
                onChange={(e) => handleInputChange('nativeLanguage', e.target.value)}
                disabled={!isEditing}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="profile-section">
          <h3>Learning Preferences</h3>
          
          <div className="form-group">
            <label>Learning Languages</label>
            <div className="language-grid">
              {languages.map(language => (
                <label key={language} className="language-checkbox">
                  <input
                    type="checkbox"
                    checked={profileData.learningLanguages.includes(language)}
                    onChange={() => handleLanguageToggle(language)}
                    disabled={!isEditing}
                  />
                  <span className="checkbox-label">{language}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Daily Learning Goal</label>
            <select
              value={profileData.dailyGoal}
              onChange={(e) => handleInputChange('dailyGoal', parseInt(e.target.value))}
              disabled={!isEditing}
            >
              {dailyGoals.map(goal => (
                <option key={goal} value={goal}>{goal} words per day</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="profile-section">
          <h3>Notifications</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Email Notifications</h4>
                <p>Receive updates and progress reports via email</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profileData.notifications.email}
                  onChange={(e) => handleNestedChange('notifications', 'email', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Push Notifications</h4>
                <p>Get reminders and achievements on your device</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profileData.notifications.push}
                  onChange={(e) => handleNestedChange('notifications', 'push', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Daily Reminders</h4>
                <p>Receive daily study reminders</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profileData.notifications.reminders}
                  onChange={(e) => handleNestedChange('notifications', 'reminders', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="profile-section">
          <h3>Privacy Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Public Profile</h4>
                <p>Allow other users to see your profile</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profileData.privacy.profilePublic}
                  onChange={(e) => handleNestedChange('privacy', 'profilePublic', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Show Progress</h4>
                <p>Display your learning progress to others</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profileData.privacy.showProgress}
                  onChange={(e) => handleNestedChange('privacy', 'showProgress', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Allow Messages</h4>
                <p>Receive messages from other learners</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profileData.privacy.allowMessages}
                  onChange={(e) => handleNestedChange('privacy', 'allowMessages', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="profile-section">
          <h3>App Preferences</h3>
          
          <div className="form-group">
            <label>Theme</label>
            <select
              value={profileData.preferences.theme}
              onChange={(e) => handleNestedChange('preferences', 'theme', e.target.value)}
              disabled={!isEditing}
            >
              {themes.map(theme => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Sound Effects</h4>
                <p>Play sounds for correct answers and achievements</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profileData.preferences.soundEnabled}
                  onChange={(e) => handleNestedChange('preferences', 'soundEnabled', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Auto-play Audio</h4>
                <p>Automatically play pronunciation audio</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profileData.preferences.autoPlay}
                  onChange={(e) => handleNestedChange('preferences', 'autoPlay', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="profile-section">
          <h3>Account Actions</h3>
          <div className="account-actions">
            <button className="btn btn-secondary">Export Data</button>
            <button className="btn btn-secondary">Change Password</button>
            <button className="btn btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 