const jwt = require("jsonwebtoken");

const { COOKIE_ONE, SECRET } = require("../constants");

exports.userMiddleware = async (req, res, next) => {
  if (req.cookies[COOKIE_ONE]) {
    const decodedToken = new Promise((resolve, reject) =>
      jwt.verify(req.cookies[COOKIE_ONE], SECRET, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      })
    );

    req.user = await decodedToken;
    res.locals.user = await decodedToken;
  }

  next();
};

exports.isAuthorized = (req, res, next) => {
  if (req.user) {
    return res.redirect("/");
  }

  next();
};

exports.isNotAuthorized = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/user/login");
  }

  next();
};
