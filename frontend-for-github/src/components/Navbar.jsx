import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          🏠 <span>PG</span>Bangalore
        </Link>

        <nav className="nav-links">
          <Link to="/pgs?gender=boys">Boys PG</Link>
          <Link to="/pgs?gender=girls">Girls PG</Link>
          <Link to="/pgs">All Listings</Link>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              {(user.role === 'owner' || user.role === 'admin') && (
                <Link to="/dashboard" className="btn btn-ghost">
                  Dashboard
                </Link>
              )}
              <Link to="/my-enquiries" className="btn btn-ghost">
                My Enquiries
              </Link>
              <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
