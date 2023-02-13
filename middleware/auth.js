const passport = require("passport");
const passportJWT = require("passport-jwt");
const service = require("../service/users.js");
const { JWT_SECRET, URI_DB, PORT } = require("./../config");

const extractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await service.getUserById(payload.id);
      return user ? done(null, user) : done(new Error("User not found"));
    } catch (err) {
      return done(err);
    }
  })
);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const token = req.headers.authorization.slice(7);
    if (token !== user.token || !user || err) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const isValid = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    next();
  };
};

module.exports = { auth, isValid };
