import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useSyncExternalStore } from "react";
import { API_URL } from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 2000);
  }

  async function handleLogin() {
    setMessage("");
    setMessageType("");

    if (!email || !password) {
      showMessage("Please enter both email and password.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.detail, "error");
        return;
      }

      showMessage("Login successful!", "success");

      setTimeout(() => {
        navigate("/home/recipes");
      }, 1000);
    } catch (error) {
      console.error(error);

      showMessage("Unable to connect to the server.", "error");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Welcome</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && <p className={`login-message ${messageType}`}>{message}</p>}

        <button onClick={handleLogin}>Sign in</button>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
