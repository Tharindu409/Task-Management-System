import { useEffect, useState } from 'react';
import { FiBell, FiCheck, FiMonitor, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const Settings = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('taskflow-theme') === 'dark');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('taskflow-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <section className={`settings-shell${darkMode ? ' dark-mode' : ''}`}>
      <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((current) => !current)} title="Settings">
        <div className="settings-page">
          <div className="settings-intro"><h2>Settings</h2><p>Keep your workspace comfortable and focused.</p></div>
          <div className="settings-grid">
            <section className="settings-panel"><div className="settings-panel-heading"><div><h3>Appearance</h3><p>Choose how TaskFlow looks on this device.</p></div><FiMonitor /></div><button type="button" className="setting-row" onClick={() => setDarkMode(false)}><span className="setting-icon"><FiSun /></span><span><strong>Light mode</strong><small>Bright and clear</small></span><span className={`setting-check${!darkMode ? ' selected' : ''}`}>{!darkMode && <FiCheck />}</span></button><button type="button" className="setting-row" onClick={() => setDarkMode(true)}><span className="setting-icon"><FiMoon /></span><span><strong>Dark mode</strong><small>Easy on the eyes</small></span><span className={`setting-check${darkMode ? ' selected' : ''}`}>{darkMode && <FiCheck />}</span></button></section>
            <section className="settings-panel"><div className="settings-panel-heading"><div><h3>Notifications</h3><p>Control task activity messages.</p></div><FiBell /></div><label className="toggle-row"><span><strong>Task notifications</strong><small>Show feedback after task actions</small></span><input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} /><span className="toggle-control" aria-hidden="true" /></label></section>
            <section className="settings-panel account-panel"><div className="settings-panel-heading"><div><h3>Account</h3><p>Your current TaskFlow account.</p></div></div><div className="account-detail"><span className="account-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</span><span><strong>{user?.name || 'User'}</strong><small>{user?.email || 'No email available'}</small></span></div></section>
          </div>
        </div>
      </Navbar>
    </section>
  );
};

export default Settings;