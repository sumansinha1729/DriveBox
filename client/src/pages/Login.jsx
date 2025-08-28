import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth">
      <h1>DriveBox — Login</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <div className="error">{error}</div>}
        <button>Login</button>
      </form>
      <p>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
