import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiCheckSquare, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-nav">
      <div className="nav-container">
        <div className="nav-logo">
          <FiCheckSquare className="logo-icon" />
          <span className="logo-text">TaskFlow</span>
        </div>

        {user && (
          <div className="nav-content">
            <div className="user-badge">
              <div className="avatar">
                <FiUser className="avatar-icon" />
              </div>
              <span className="user-name">{user.name || 'User'}</span>
            </div>
            <button onClick={logout} className="btn-logout" title="Sign Out">
              <FiLogOut className="logout-icon" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
