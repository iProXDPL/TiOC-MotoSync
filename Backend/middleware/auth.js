const requireAuth = (req, res, next) => {
  const isAuthPresent = !!req.headers.authorization;
  const mockId = req.headers['x-mock-user-id'];
  
  // W nowszych wersjach @clerk/express req.auth może być funkcją zwracającą stan autoryzacji
  let authState = {};
  try {
    authState = typeof req.auth === 'function' ? req.auth() : (req.auth || {});
  } catch (err) {
    console.error("Error reading Clerk auth state:", err);
  }

  // Dla ułatwienia testów w Postmanie, dodajemy obsługę nagłówka x-mock-user-id i x-mock-role
  const userId = authState.userId || mockId;
  
  if (!userId) {
    console.error(`[Auth Middleware] Brak autoryzacji: Authorization Header: ${isAuthPresent ? 'Obecny' : 'Brak'}, Mock ID: ${mockId ? 'Obecny' : 'Brak'}`);
    console.error(`[Auth Middleware] authState contents:`, authState);
    return res.status(401).json({ error: 'Brak autoryzacji (Zaloguj się lub podaj x-mock-user-id w nagłówkach dla testów)' });
  }

  req.userId = userId;
  
  // Pobranie roli z tokenu Clerk (jeśli skonfigurowane w JWT template) LUB z nagłówka testowego
  // Oczekujemy, że rola to string (np. 'mechanic', 'admin')
  const userRole = authState.sessionClaims?.role || req.headers['x-mock-role'] || 'user';
  req.userRole = userRole;

  next();
};

/**
 * Middleware chroniący endpoint dla określonej roli.
 * Zastosowanie w rutach: router.post('/', requireAuth, requireRole('mechanic'), controller);
 */
const requireRole = (allowedRole) => {
  return (req, res, next) => {
    if (req.userRole !== allowedRole) {
      return res.status(403).json({ 
        error: `Brak uprawnień. Zalogowany jako: ${req.userRole}, Wymagane: ${allowedRole}` 
      });
    }
    next();
  };
};

module.exports = { requireAuth, requireRole };
