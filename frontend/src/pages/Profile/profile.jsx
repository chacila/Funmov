import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import AddMovie from '../AddMovie/AddMovie';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [showAddMovie, setShowAddMovie] = useState(false);

  if (!user) {
    return <Navigate to="/users" replace />;
  }

  return (
    <div className="profile-page" style={{ padding: '20px' }}>
      {/* HEADER PROFILE */}
      <div style={{ marginBottom: '30px' }}>
        <h1>🎬 Bienvenue {user.username}</h1>
        <p style={{ color: '#666' }}>{user.email}</p>
      </div>

      {/* FAVORIS */}
      <section style={{ marginBottom: '40px' }}>
        <h2>⭐ Mes films favoris</h2>

        <p style={{ opacity: 0.7 }}>
          Tu n’as pas encore ajouté de films favoris (ou pas encore connecté à
          cette feature 😉)
        </p>
      </section>

      <hr />

      {/* ADD MOVIE TOGGLE */}
      <section style={{ marginTop: '30px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2>➕ Ajouter un film</h2>

          <button
            onClick={() => setShowAddMovie(!showAddMovie)}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: '#f5f5f5',
            }}
          >
            {showAddMovie ? 'Masquer' : 'Ajouter'}
          </button>
        </div>

        {showAddMovie && (
          <div style={{ marginTop: '20px' }}>
            <AddMovie />
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
