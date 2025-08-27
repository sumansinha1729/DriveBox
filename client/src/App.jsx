import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header style={styles.header}>
        <Link to="/" style={styles.brand}>
          DriveBox
        </Link>
        <nav style={styles.nav}>
          {user ? (
            <>
              <span style={styles.user}>Hi, {user.name}</span>
              <button onClick={logout} style={styles.btn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
  },
  brand: { fontWeight: 800, textDecoration: "none", color: "#111827" },
  nav: { display: "flex", alignItems: "center", gap: 12 },
  link: { textDecoration: "none", color: "#2563eb", fontWeight: 600 },
  user: { color: "#374151" },
  btn: {
    background: "#ef4444",
    color: "#fff",
    border: 0,
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
};
