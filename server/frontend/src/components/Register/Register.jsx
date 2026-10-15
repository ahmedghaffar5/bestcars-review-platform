import React, { useState } from 'react';
import './Register.css';
import Header from '../Header/Header';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();
    const res = await fetch(`${window.location.origin}/djangoapp/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName,
        firstName,
        lastName,
        email,
        password,
      }),
    });

    const json = await res.json();
    if (res.ok) {
      sessionStorage.setItem('username', json.userName);
      sessionStorage.setItem('firstname', json.firstName || '');
      sessionStorage.setItem('lastname', json.lastName || '');
      window.location.href = '/';
      return;
    }

    alert(json.message || 'Registration failed.');
  };

  return (
    <div>
      <Header />
      <div className='register_container'>
        <h1 className='header'>Register</h1>
        <form className='submit_panel' onSubmit={register}>
          <div className='inputs'>
            <div className='input'>
              <span className='input_field'>Username</span>
              <input className='input_field' type='text' value={userName} onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div className='input'>
              <span className='input_field'>First Name</span>
              <input className='input_field' type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className='input'>
              <span className='input_field'>Last Name</span>
              <input className='input_field' type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className='input'>
              <span className='input_field'>Email</span>
              <input className='input_field' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='input'>
              <span className='input_field'>Password</span>
              <input className='input_field' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button className='submit' type='submit'>Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
