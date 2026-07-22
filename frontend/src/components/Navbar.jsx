import { FiCalendar, FiGrid, FiHelpCircle, FiHome, FiList, FiLogOut, FiMoon, FiPlus, FiSearch, FiSettings, FiSun, FiUsers } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ search, onSearchChange, summaryTotal, darkMode, onToggleDarkMode, onCreateTask, children }) => {
  const { logout } = useAuth();

  return (
    <>
      <aside className="sidebar">
        <div className="side-brand"><span className="brand-mark">S</span><strong>slothui</strong></div>
        <label className="side-search"><FiSearch /><input aria-label="Search tasks by title" placeholder="Search" value={search} onChange={(event) => onSearchChange(event.target.value)} /></label>
        <nav className="side-nav" aria-label="Main navigation">
          <button type="button" className="side-link active"><FiHome /> Home <span>{summaryTotal}</span></button>
          <button type="button" className="side-link"><FiList /> Tasks</button>
          <button type="button" className="side-link"><FiUsers /> Users</button>
          <button type="button" className="side-link"><FiSettings /> Settings</button>
          <button type="button" className="side-link"><FiHelpCircle /> Help &amp; Support</button>
        </nav>
        <div className="sidebar-actions">
          <button type="button" className="side-action" onClick={onCreateTask}><FiPlus /> New task</button>
          <button type="button" className="side-action side-action-logout" onClick={logout}><FiLogOut /> Log out</button>
        </div>
      </aside>

      <div className="workspace">
        <header className="workspace-header">
          <div><h1>Task Dashboard </h1></div>
          <div className="header-actions"><button type="button" className="header-icon" title="Toggle dark mode" onClick={onToggleDarkMode}>{darkMode ? <FiSun /> : <FiMoon />}</button><button type="button" className="header-icon" title="Search" onClick={() => document.querySelector('.filter-search input')?.focus()}><FiSearch /></button><button type="button" className="share-button">Share <span>⌘</span></button><button type="button" className="header-icon" title="Export">⇧</button><button type="button" className="header-icon" onClick={onCreateTask} title="Add task"><FiPlus /></button></div>
        </header>
        <div className="workspace-content">{children}</div>
      </div>
    </>
  );
};

export default Navbar;