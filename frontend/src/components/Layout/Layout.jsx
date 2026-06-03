import './Layout.css';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';

const Layout = () => {
  return (
    <div className="Layout-container">
      <Header />

      <div className="Layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
