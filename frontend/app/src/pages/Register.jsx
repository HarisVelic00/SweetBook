import "../styles/Register.css";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="register-page">
      <div className="register-box">
        <h1>Create Account</h1>

        <input type="text" placeholder="Username" />

        <input type="email" placeholder="Email" />

        <input type="password" placeholder="Password" />

        <button>Sign Up</button>

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
