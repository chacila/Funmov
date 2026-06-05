/**
 * Hook React pour le système de recommandation.
 * Lit le token JWT stocké dans localStorage après le login,
 * et l'envoie dans chaque requête vers le backend.
 */

import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:8000/api';

/**
 * Wrapper axios-like avec le token JWT.
 * Lit automatiquement le token stocké au moment du login :
 *   localStorage.setItem('token', data.token)
 */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Token JWT envoyé dans chaque requête — lu par authMiddleware côté Express
      // qui le vérifie et injecte req.user = { id, email }
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Erreur ${res.status}`);
  }

  return res.json();
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [userRatings, setUserRatings]         = useState([]);
  const [isLoading, setIsLoading]             = useState(true);
  const [error, setError]                     = useState(null);

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
    // Ne charge que si l'utilisateur est connecté (token présent)
    if (localStorage.getItem('token')) {
      refresh();
    } else {
      setIsLoading(false);
    }
  }, [refresh]);

  /**
   * Note un film et recharge les recommandations.
   * @param {number} movieId  ID du film dans ta BDD (pas le tmdb_id)
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
   * Supprime la note d'un film et recharge les recommandations.
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
    userRatings,     // [{ movieId, title, score, posterPath }]
    rateMovie,       // (movieId, score) => Promise<void>
    removeRating,    // (movieId) => Promise<void>
    isLoading,
    error,
    refresh,
  };
}