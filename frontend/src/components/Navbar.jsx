import { FiCheckSquare, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand"><FiCheckSquare /> <span>TaskFlow</span></div>
        {user && (
          <div className="account-actions">
            <span className="account-name"><FiUser /> {user.name || 'User'}</span>
            <button type="button" className="button button-ghost" onClick={logout} title="Sign out">
              <FiLogOut /> <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;