import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS for styling

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    };

    // Run once on mount
    checkUser();

    // Listen for login/logout changes via storage event (when logged in/out in another tab)
    window.addEventListener("storage", checkUser);

    // Optionally poll every few seconds (in same tab updates)
    const interval = setInterval(checkUser, 1000); // Poll every 1 second

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

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">MyStore</Link>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
        </li>

        {user && user.userType === "admin" && (
          <li>
            <Link to="/admin/inventory" onClick={() => setMenuOpen(false)}>
              Inventory
            </Link>
          </li>
        )}

        {!user && (
          <>
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </li>
          </>
        )}

        {user && user.userType === "admin" && (
          <>
            <li>
              <Link to="/admin/add-items" onClick={() => setMenuOpen(false)}>
                Add Items
              </Link>
            </li>
            <li>
              <Link to="/admin/users" onClick={() => setMenuOpen(false)}>
                Users
              </Link>
            </li>
          </>
        )}
        {user && (
          <li>
            <button className="signout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
