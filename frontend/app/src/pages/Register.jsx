import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useSyncExternalStore } from "react";
import { API_URL } from "../api/api";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
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

  async function handleRegister() {
    setMessage("");
    setMessageType("");

    if (!email || !password || !username) {
      showMessage("Please enter username, email and password.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.detail, "error");
        return;
      }

      localStorage.setItem("token", data.access_token);

      showMessage("Account created successfully!", "success");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error(error);
      showMessage("Unable to connect to the server.", "error");
    }
  }

  return (
    <div className="register-page">
      <div className="register-box">
        <h1>Create Account</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <button onClick={handleRegister}>Sign Up</button>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
