import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';  // Add this
import { getProfile, updateProfile, updatePassword, deleteAccount } from '../utils/api';
import useAuth from '../context/useAuth';
import Navbar from '../components/Navbar';

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    avgCycleLength: 28,
    avgPeriodLength: 5,
    emailReminders: false,
    reminderDaysBefore: 2,
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      const data = response.data;
      
      setProfileData({
        name: data.name || '',
        email: data.email || '',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        avgCycleLength: data.avgCycleLength || 28,
        avgPeriodLength: data.avgPeriodLength || 5,
        emailReminders: data.emailReminders || false,
        reminderDaysBefore: data.reminderDaysBefore || 2,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const loadingToast = toast.loading('Saving profile...');

    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully', { id: loadingToast });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading('Updating password...');

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully', { id: loadingToast });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!window.confirm('All your cycle data will be permanently deleted. Are you absolutely sure?')) {
      return;
    }

    const loadingToast = toast.loading('Deleting account...');

    try {
      await deleteAccount();
      toast.success('Account deleted successfully', { id: loadingToast });
      logout();
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account', { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ fontSize: '24px', color: '#9b59b6' }}>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <h1 style={{ color: '#6c3483', marginBottom: '10px' }}>Settings</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Manage your account and preferences</p>

          {/* Profile Settings */}
          <div className="card">
            <h3 style={{ color: '#9b59b6', marginBottom: '20px' }}>Profile Information</h3>
            <form onSubmit={handleProfileSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                  className="input-field"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  className="input-field"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleProfileChange}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
                    Average Cycle Length (days)
                  </label>
                  <input
                    type="number"
                    name="avgCycleLength"
                    value={profileData.avgCycleLength}
                    onChange={handleProfileChange}
                    min="21"
                    max="45"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
                    Average Period Length (days)
                  </label>
                  <input
                    type="number"
                    name="avgPeriodLength"
                    value={profileData.avgPeriodLength}
                    onChange={handleProfileChange}
                    min="2"
                    max="10"
                    className="input-field"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Email Reminders */}
          <div className="card">
            <h3 style={{ color: '#9b59b6', marginBottom: '20px' }}>Email Reminders</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
              Get notified before your predicted period starts. Reminders are sent daily at 9:00 AM based on your cycle predictions.
            </p>
            <form onSubmit={handleProfileSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="emailReminders"
                    checked={profileData.emailReminders}
                    onChange={handleProfileChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ color: '#666', fontWeight: '600' }}>
                    Send me email reminders before my predicted period
                  </span>
                </label>
              </div>

              {profileData.emailReminders && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
                    Remind me (days before)
                  </label>
                  <select
                    name="reminderDaysBefore"
                    value={profileData.reminderDaysBefore}
                    onChange={handleProfileChange}
                    className="input-field"
                  >
                    <option value="1">1 day before</option>
                    <option value="2">2 days before</option>
                    <option value="3">3 days before</option>
                    <option value="5">5 days before</option>
                    <option value="7">7 days before</option>
                  </select>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Reminder Settings'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="card">
            <h3 style={{ color: '#9b59b6', marginBottom: '20px' }}>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="input-field"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="input-field"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="card" style={{ borderColor: '#dc3545', borderWidth: '2px' }}>
            <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>Delete Account</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              Once you delete your account, there is no going back. All your data will be permanently deleted.
            </p>
            <button
              onClick={handleDeleteAccount}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Settings;