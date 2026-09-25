import React, { useState } from 'react';
import "./Register.css";
import Header from '../Header/Header';

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let register_url = window.location.origin + "/djangoapp/register";

  const register = async (e) => {
    e.preventDefault();

    const res = await fetch(register_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName, password, firstName, lastName, email,
      }),
    });

    const json = await res.json();
    if (json.status === "Authenticated" || json.userName) {
      if (json.error) {
        setErrorMessage(json.error);
      } else {
        sessionStorage.setItem('username', json.userName);
        window.location.href = "/";
      }
    } else {
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <form name="registration" className="registration-form">
          {errorMessage && (
            <div className="error-msg">{errorMessage}</div>
          )}

          <div className="input_field">
            <span>Username </span>
            <input
              type="text"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="input_field">
            <span>First Name </span>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="input_field">
            <span>Last Name </span>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="input_field">
            <span>Email </span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input_field">
            <span>Password </span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <button className="register_button" onClick={register}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
