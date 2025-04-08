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

function AppContent() {
  const location = useLocation(); // ✅ reactive location hook
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    setIsHome(location.pathname === "/");
  }, [location]);

  return (
    <>
      <Navbar />
      <div className={isHome ? "mainOtherContainer" : "mainContainer"}>
        <Routes>
          <Route path="/" element={<AllInventory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin/add-items"
            element={<AdminRoute element={<AddItems />} />}
          />
          <Route
            path="/admin/users"
            element={<AdminRoute element={<Users />} />}
          />
          <Route
            path="/admin/inventory"
            element={<AdminRoute element={<Inventory />} />}
          />
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
      </Router>
    </div>
  );
}

export default App;
