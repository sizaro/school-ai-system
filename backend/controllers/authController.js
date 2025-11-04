import passport from "passport";

// LOGIN
export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      const { password, ...userSafe } = user;    
      console.log("user in login auth cont:", user.data)    
      console.log("usersafe in login auth cont:", userSafe)                                                                                                                                                                                                                                                                                                                                                                              
      res.json({ user: userSafe });
    });
  })(req, res, next);
};

// LOGOUT
export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.status(200).json({ message: "Logged out successfully" });
  });
};

// CHECK AUTH
export const checkAuth = (req, res) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Not authenticated" });

  const { password, ...userSafe } = req.user;
  res.json({ user: userSafe });
};

// Role-protect backend routes
export const ensureRole = (role) => (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === role) return next();
  return res.status(401).json({ message: "Unauthorized" });
};
