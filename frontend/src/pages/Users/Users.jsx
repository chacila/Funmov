import { useState } from 'react';
import api from '../../services/axios.js';
import './users.css';

function Users() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', {
          email,
          password,
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        window.location.href = '/';
      } else {
        await api.post('/auth/register', {
          email,
          username,
          password,
        });

        setIsLogin(true);
        setEmail('');
        setUsername('');
        setPassword('');

        alert('Compte créé avec succès !');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          {isLogin ? 'Welcome back 👋' : 'Create account 🚀'}
        </h1>

        <p className="auth-subtitle">
          {isLogin
            ? 'Sign in to continue'
            : 'Create your account in just a few seconds'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>

        <p className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? 'No account yet ? Create one'
            : 'Already have an account ? Login'}
        </p>
      </div>
    </div>
  );
}

export default Users;
