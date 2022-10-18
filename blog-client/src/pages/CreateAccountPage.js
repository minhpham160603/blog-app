import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const createAccount = async () => {
    try {
      if (password !== confirmPassword) {
        setError("Confirm password doesnt match");
        return;
      }
      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate("/articles");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>Create Account</h1>
      {error && <p className="error">{error}</p>}
      <input
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <input
        type="password"
        placeholder="Re-enter Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      ></input>
      <button onClick={createAccount}>Sign up</button>
      <Link to="/login">Already had an account? Login here</Link>
    </div>
  );
}
