import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { signup } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nameRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const n = name.trim();
    const em = email.trim();
    const pw = password;

    if (!n || !em || !pw) return setError("All fields are required.");
    if (pw.length < 6)
      return setError("Password must be at least 6 characters.");

    try {
      setBusy(true);
      await signup(n, em, pw);
      nav("/");
    } catch (e) {
      const status = e?.response?.status;
      const msg =
        status === 409
          ? "Email already registered."
          : e?.response?.data?.message || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <h1>DriveBox — Register</h1>
      <form onSubmit={onSubmit}>
        <input
          ref={nameRef}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
        />
        <input
          type="password"
          placeholder="Password (min 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {error && <div className="error">{error}</div>}
        <button disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
