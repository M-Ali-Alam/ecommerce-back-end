import { createError } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.body.token;
  console.log("token");
  console.log(token);
  if (!token) {
    return next(createError(401, "You are not authenticated"));
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, "Token is invalid"));
    }
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized"));
    }
  });
};

export const verifyAdmin = async (req, res, next) => {
  console.log("req.headers.token");
  console.log(req);
  const data = await jwt.verify(req.headers.token, process.env.JWT);
  console.log("data");
  console.log(data);
  if (data.isAdmin) {
    next();
  } else {
    return next(createError(404, "You are not authorized"));
  }
};
