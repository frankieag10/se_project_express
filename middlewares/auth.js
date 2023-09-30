const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-error");

const handleAuthError = (error) => {
  console.error(error);
  console.log("Unauthorized Error: 401");
  throw new UnauthorizedError("Unauthorized Error: 401");
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("Missing or invalid authorization header");
    return handleAuthError(null);
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return handleAuthError(err);
  }

  req.user = payload;
  console.log("Authenticated User:");

  return next();
};
