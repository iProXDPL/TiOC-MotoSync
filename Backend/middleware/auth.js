const requireAuth = (req, res, next) => {
  // Dla ułatwienia testów w Postmanie, dodajemy obsługę nagłówka x-mock-user-id
  // Zostanie użyty, jeśli req.auth.userId od Clerka będzie puste
  const userId = req.auth?.userId || req.headers['x-mock-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Brak autoryzacji (Zaloguj się lub podaj x-mock-user-id w nagłówkach dla testów)' });
  }
  req.userId = userId;
  next();
};

module.exports = requireAuth;
