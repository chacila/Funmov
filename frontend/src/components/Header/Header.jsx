import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="Header-container">
      <div className="Header-left">
        😂 <span className="logo">Funmov</span>
      </div>

      <div className="header-right">
        <Link className="Link" to="/">
          Home
        </Link>
        <Link className="Link" to="/find">
          Find
        </Link>
        <Link className="Link" to="/about">
          About
        </Link>
        {!user ? (
          <Link className="Link" to="/users">
            Login / Register
          </Link>
        ) : (
          <>
            <Link className="Link" to="/profile">
              👤 {user.username}
            </Link>

            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
            >
              unlogin
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
