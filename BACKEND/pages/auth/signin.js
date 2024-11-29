// pages/auth/signin.js
'use client';

import Spinner from '@/components/Spinner';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Attempt to sign in using credentials
      const result = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (!result.error) {
        // Successful sign-in
        router.push('/');
      } else {
        // Handle sign-in error
        setError('Invalid email or password');
        setTimeout(() => {
          setError('');
        }, 4000);
      }
    } catch (error) {
      setError('Sign in failed, Please try again.');
      setTimeout(() => {
        setError('');
      }, 4000);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError('');
      }, 4000);
    }

  };

  return (

    <div className="flex flex-center full-h">
      <div className="loginform">
        <div className="heading">Sign-In Admin</div>
        {loading ? <div className='flex flex-center w-100 flex-col'><Spinner /></div> : <>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter email address"
              className="input"
            />
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className="input"
            />
            <button className="login-button" type="submit">
              Sign Up
            </button>
            {error && <p className='redcolor'>{error}</p>}
          </form>

          <span className='agreement'><a target='_blank' href="https://www.instagram.com/l_a_k_i_nim/">learn Admin Licence Agreement</a></span>
        </>}
      </div>
    </div>

  );
}

