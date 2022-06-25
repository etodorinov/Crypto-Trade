const router = require("express").Router();

const userService = require("../services/userService");

const {
  isAuthorized,
  isNotAuthorized,
} = require("../middlewares/userMiddleware");

const { COOKIE_ONE } = require("../constants");

router.get("/register", isAuthorized, (req, res) => {
  res.render("register");
});

router.get("/login", isAuthorized, (req, res) => {
  res.render("login");
});

router.get("/logout", isNotAuthorized, (req, res) => {
  res.clearCookie(COOKIE_ONE);

  res.redirect("/");
});

router.post("/register", isAuthorized, async (req, res) => {
  try {
    const token = await userService.register(req.body);

    res.cookie(COOKIE_ONE, token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    res.render("register", { error, information: req.body });
  }
});

router.post("/login", isAuthorized, async (req, res) => {
  try {
    const token = await userService.login(req.body);

    res.cookie(COOKIE_ONE, token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    res.render("login", { error, information: req.body });
  }
});

module.exports = router;
