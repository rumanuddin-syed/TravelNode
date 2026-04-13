import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies.accessToken || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader);

  if (!token) {
    console.warn("Auth Failed: No token provided");
    return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.id;
    req.role = decoded.role;
    console.log("Token Verified:", { id: req.id, role: req.role });
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
  }
};

const verifyUser = (req, res, next) => {
  const userId = req.id;
  const paramsId = req.params.id;
  const role = req.role;

  if (paramsId === userId || role === 'admin') {
    next();
  } else {
    console.warn("Unauthorized User Attempt:", { userId, role, target: paramsId });
    res.status(401).json({ success: false, message: "You're not Authorized" });
  }
};

const verifyAdmin = (req, res, next) => {
  const role = req.role;
  const userId = req.id;

  if (role === "admin") {
    next();
  } else {
    console.warn("Unauthorized Admin Attempt:", { userId, role });
    res.status(401).json({ success: false, message: "You're not Authorized - Admin only" });
  }
};

export  {verifyToken, verifyAdmin, verifyUser};
