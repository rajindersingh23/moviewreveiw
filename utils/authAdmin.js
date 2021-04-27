const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.admin = decoded;
    if(!req.admin.adminId){
        return res.status(401).send("Access Denied");
      }
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = auth;
