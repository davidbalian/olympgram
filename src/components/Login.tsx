import firebase from "firebase/compat/app";
import { FormEvent, useState } from "react";
import "firebase/compat/auth";
import { Link, useNavigate } from "react-router-dom";
import logo from "../logo.svg";
import GoogleLogin from "./GoogleLogin";

const Login = () => {
  //eslint-disable-next-line
  const [email, setEmail] = useState("");
  //eslint-disable-next-line
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="login">
      <img src={logo} alt="olympgram logo" className="logo" />
      <form onSubmit={handleSubmit}>
        {/* <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn">
          Login
        </button>
        <div className="login-divider">
          <hr />
          <p>or</p>
          <hr />
        </div> */}
        <GoogleLogin />
        <div className="login-divider">
          <hr />
          <p>or</p>
          <hr />
        </div>
        <Link to="/guest" className="btn">
          Continue as Guest
        </Link>
      </form>
      {error && <p>{error}</p>}
      {/* <p className="small">
        No account? <Link to="/signup">Register here.</Link>
      </p> */}
    </div>
  );
};

export default Login;
