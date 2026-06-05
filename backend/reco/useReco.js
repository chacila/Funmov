/**
 * hooks/useRecommendations.js  (version backend)
 *
 * Remplace l'ancienne version JSON-local.
 * Appelle l'API Express pour noter les films et récupérer les recommandations.
 * Le calcul Pearson est entièrement côté serveur.
 *
 * Usage :
 *   const { recommendations, userRatings, rateMovie, isLoading, error }
 *     = useRecommendations();
 */

import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

/**
 * Wrapper fetch avec le token JWT stocké (adapte selon ton système d'auth).
 */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token'); // adapte si tu utilises un autre stockage

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Erreur ${res.status}`);
  }

  return res.json();
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [userRatings, setUserRatings]         = useState([]);
  const [isLoading, setIsLoading]             = useState(true);
  const [error, setError]                     = useState(null);

  // Charge les notes et recommandations de l'utilisateur connecté
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [recs, ratings] = await Promise.all([
        apiFetch('/recommendations'),
        apiFetch('/ratings'),
      ]);
      setRecommendations(Array.isArray(recs) ? recs : recs.recommendations ?? []);
      setUserRatings(ratings);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Note un film, puis recharge les recommandations.
   * @param {number} movieId  ID TMDB du film
   * @param {number} score    Note entre 1 et 10
   */
  const rateMovie = useCallback(async (movieId, score) => {
    setError(null);
    try {
      await apiFetch('/ratings', {
        method: 'POST',
        body: JSON.stringify({ movieId, score }),
      });
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }, [refresh]);

  /**
   * Supprime la note d'un film, puis recharge les recommandations.
   * @param {number} movieId
   */
  const removeRating = useCallback(async (movieId) => {
    setError(null);
    try {
      await apiFetch(`/ratings/${movieId}`, { method: 'DELETE' });
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }, [refresh]);

  return {
    recommendations, // [{ movieId, title, predictedScore }]
    userRatings,     // [{ movieId, title, score }]
    rateMovie,       // (movieId, score) => Promise<void>
    removeRating,    // (movieId) => Promise<void>
    isLoading,
    error,
    refresh,
  };
}