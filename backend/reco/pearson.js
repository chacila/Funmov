/**
 *
 * Moteur de recommandation item-item basé sur la similarité de Pearson.
 * Logique identique à l'exercice  de l'annale sur édunao:
 *   1. Centrage par film : r_c(u,i) = r(u,i) − r̄_i
 *   2. sim(i,j) = Σ_u r_c(u,i)·r_c(u,j) / √(Σr_c²(u,i) · Σr_c²(u,j))
 *      calculée uniquement sur les utilisateurs ayant noté les deux films
 *   3. r̂(u,i) = r̄_i + Σ_j∈N sim(i,j)·r_c(u,j) / Σ_j |sim(i,j)|
 *
 * Ce module prend des tableaux JS en entrée
 * et retourne des nombres. Les requêtes SQL se font dans les routes.
 */

/**
 * Calcule la moyenne d'un tableau en ignorant null/undefined.
 * @param {(number|null)[]} values
 * @returns {number}
 */
function mean(values) {
  const valid = values.filter((v) => v != null);
  if (valid.length === 0) {
    return 0;
  }

  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

/**
 * Calcule la similarité de Pearson entre deux films.
 * Retourne null si moins de 2 utilisateurs ont noté les deux films.
 *
 * @param {(number|null)[]} vecA  Notes du film A (indexées par utilisateur)
 * @param {(number|null)[]} vecB  Notes du film B (indexées par utilisateur)
 * @returns {number|null}
 */
function pearsonSimilarity(vecA, vecB) {
  const sharedIdx = vecA.reduce((acc, v, i) => {
    if (v != null && vecB[i] != null) {
      acc.push(i);
    }

    return acc;
  }, []);

  if (sharedIdx.length < 2) {
    return null;
  }

  const meanA = mean(sharedIdx.map((i) => vecA[i]));
  const meanB = mean(sharedIdx.map((i) => vecB[i]));

  let numerator = 0,
    denomA = 0,
    denomB = 0;
  for (const i of sharedIdx) {
    const ca = vecA[i] - meanA;
    const cb = vecB[i] - meanB;
    numerator += ca * cb;
    denomA += ca * ca;
    denomB += cb * cb;
  }

  if (denomA === 0 || denomB === 0) {
    return null;
  }

  return numerator / Math.sqrt(denomA * denomB);
}

/**
 * Convertit les lignes SQL en matrice { movieId: { userId: score } }.
 *
 * @param {{ user_id: number, movie_id: number, score: number }[]} rows
 * @returns {{ [movieId: string]: { [userId: string]: number } }}
 */
function buildMatrix(rows) {
  const matrix = {};
  for (const { user_id, movie_id, score } of rows) {
    const mid = String(movie_id);
    const uid = String(user_id);
    if (!matrix[mid]) {
      matrix[mid] = {};
    }
    matrix[mid][uid] = score;
  }

  return matrix;
}

/**
 * Calcule les recommandations pour un utilisateur donné.
 *
 * @param {number} userId          ID de l'utilisateur cible
 * @param {{ user_id, movie_id, score }[]} allRatings   Toutes les notes (SELECT * FROM ratings)
 * @param {{ id, title }[]} allMovies                   Tous les films   (SELECT id, title FROM movies)
 * @param {number} [topN=10]       Nombre de recommandations à retourner
 *
 * @returns {{
 *   movieId:        number,
 *   title:          string,
 *   predictedScore: number,
 * }[]}  Films non notés, triés par score prédit décroissant
 */
function getRecommendations(userId, allRatings, allMovies, topN = 10) {
  const uid = String(userId);
  const movieIds = allMovies.map((m) => String(m.id));

  // Tous les utilisateurs présents dans les notes
  const allUsers = [...new Set(allRatings.map((r) => String(r.user_id)))];

  // Matrice { movieId: { userId: score } }
  const matrix = buildMatrix(allRatings);

  // Vecteur par film : tableau ordonné par allUsers
  const vectors = {};
  for (const mid of movieIds) {
    vectors[mid] = allUsers.map((u) => matrix[mid]?.[u] ?? null);
  }

  // Films déjà notés / non notés par l'utilisateur cible
  const userRatings = matrix; // accès via matrix[mid][uid]
  const ratedMovieIds = movieIds.filter((mid) => matrix[mid]?.[uid] != null);
  const unratedMovieIds = movieIds.filter((mid) => matrix[mid]?.[uid] == null);

  if (ratedMovieIds.length === 0) {
    return [];
  }

  const predictions = [];

  for (const targetId of unratedMovieIds) {
    const targetVec = vectors[targetId];
    const targetMean = mean(targetVec.filter((v) => v != null));

    let numerator = 0,
      denominator = 0;

    for (const neighborId of ratedMovieIds) {
      const sim = pearsonSimilarity(targetVec, vectors[neighborId]);
      if (sim == null) {
        continue;
      }

      const neighborMean = mean(vectors[neighborId].filter((v) => v != null));
      const userScoreOnNeighbor = matrix[neighborId]?.[uid];
      if (userScoreOnNeighbor == null) {
        continue;
      }

      const centeredNeighborScore = userScoreOnNeighbor - neighborMean;
      numerator += sim * centeredNeighborScore;
      denominator += Math.abs(sim);
    }

    if (denominator === 0) {
      continue;
    }

    const predicted = Math.min(
      10,
      Math.max(1, targetMean + numerator / denominator)
    );
    const movie = allMovies.find((m) => String(m.id) === targetId);
    if (!movie) {
      continue;
    }

    predictions.push({
      movieId: movie.id,
      title: movie.title,
      predictedScore: Math.round(predicted * 100) / 100,
    });
  }

  return predictions
    .sort((a, b) => b.predictedScore - a.predictedScore)
    .slice(0, topN);
}

export { getRecommendations, pearsonSimilarity, buildMatrix };
