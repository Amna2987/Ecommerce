const tokenService = require("../services/token.service");
const { AppError } = require("../utils/errors");

function authenticate(req, res, next) {
  const header = req.headers["authorization"];
  console.log("header auth", header);

  if (!header) return res.status(401).json({ error: "no_token" });

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ error: "invalid_header" });

  const token = parts[1];
  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ error: "token_expired" });
    return res.status(401).json({ error: "invalid_token" });
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {

    console.log('authorize middleware is running');
    console.log(req.user, req.user.role, 'authorize middleware user');
    

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return AppError('Only admin access')
    }

    next()
  };
}

module.exports = { authenticate, authorize };
