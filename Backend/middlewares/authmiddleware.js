const jwt = require("jsonwebtoken");

const authMiddleware = async(req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId and role available
    // console.log(`request object: ${JSON.stringify(req.user,null,2)}`)
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" })
  }
}
module.exports = authMiddleware