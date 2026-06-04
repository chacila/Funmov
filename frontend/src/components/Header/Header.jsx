import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="Header-container">
      <div className="Header-left">
        😂 <span className="logo">Funmov</span>
      </div>

      <nav className="Header-nav">
        <Link className="Link" to="/">
          Home
        </Link>
        <Link className="Link" to="/find">
          Find
        </Link>
        <Link className="Link" to="/add-movie">
          Ajouter un film
        </Link>
        <Link className="Link" to="/users">
          Users
        </Link>
        <Link className="Link" to="/about">
          About
        </Link>
      </nav>
    </header>
  );
};

export default Header;
