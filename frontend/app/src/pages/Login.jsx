import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  function handleLogin() {
    navigate("/home");
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Welcome</h1>

        <input type="email" placeholder="Email" />

        <input type="password" placeholder="Password" />

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
