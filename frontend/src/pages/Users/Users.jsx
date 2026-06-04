import { useState } from 'react';
import api from '../../services/axios.js';

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

        alert('Compte créé avec succès !');

        setIsLogin(true);

        setPassword('');
      }
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? 'Connexion' : 'Inscription'}</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!isLogin && (
          <input
            type="text"
            placeholder="Pseudo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">{isLogin ? 'Se connecter' : "S'inscrire"}</button>
      </form>

      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
        {isLogin ? 'Créer un compte' : 'Déjà inscrit ?'}
      </p>
    </div>
  );
}

export default Users;
