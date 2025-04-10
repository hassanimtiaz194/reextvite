import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import AddItems from "./pages/AddItems";
import AdminRoute from "./AdminRoute";
import Signup from "./pages/Signup";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import AllInventory from "./pages/AllInventory";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";

function AppContent() {
  const location = useLocation();
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    setIsHome(location.pathname === "/");
  }, [location]);

  const pathnames = ['/add-items', '/signup'];
  return (
    <>
      <div className="navBarWrapper">
        <Navbar />
      </div>
      <div className={isHome ? "mainOtherContainer" : "mainContainer"}
        style={{ justifyContent: pathnames.includes(location.pathname) ? 'center' : 'normal' }}
      >
        <Routes>
          <Route path="/" element={<AllInventory />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-items" element={<AddItems />} />
          <Route path="/users" element={<Users />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="rootContainer">
      <Router>
        <AppContent />
        <Loader />
      </Router>
    </div>
  );
}

export default App;
