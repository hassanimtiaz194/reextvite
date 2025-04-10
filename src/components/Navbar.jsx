import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import Logo from '../../public/logo.png';
import { FaHome, FaBox, FaUsers, FaPlusCircle, FaSignInAlt, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    };

    checkUser();

    window.addEventListener("storage", checkUser);
    const interval = setInterval(checkUser, 1000);

    return () => {
      window.removeEventListener("storage", checkUser);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleLinkClick = () => {
    localStorage.setItem("loading", "true");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" onClick={handleLinkClick}>
          <img
            src={Logo}
            alt="Logo"
            width="45px"
            height="45px"
            style={{ borderRadius: '10px' }}
          />
        </Link>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars size={30} />
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={handleLinkClick}>
            <div className="linkContainer">
              <div paddingTop="10px">
                <FaHome size={20} />
              </div>
              <div>Home</div>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/inventory" onClick={handleLinkClick}>
            <div className="linkContainer">
              <div paddingTop="10px">
                <FaBox size={20} />
              </div>
              <div>Inventory</div>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/users" onClick={handleLinkClick}>
            <div className="linkContainer">
              <div paddingTop="10px">
                <FaUsers size={20} />
              </div>
              <div>Users</div>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/add-items" onClick={handleLinkClick}>
            <div className="linkContainer">
              <div paddingTop="10px">
                <FaPlusCircle size={20} />
              </div>
              <div>Add Items</div>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/signup" onClick={handleLinkClick}>
            <div className="linkContainer">
              <div paddingTop="10px">
                <FaSignInAlt size={20} />
              </div>
              <div>Sign Up</div>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
