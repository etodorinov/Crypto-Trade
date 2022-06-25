const router = require("express").Router();

const homeController = require("./controllers/homeController");
const userController = require("./controllers/userController");
const businessController = require("./controllers/businessController");

router.use("/", homeController);
router.use("/user", userController);
router.use("/business", businessController);
router.get("*", (req, res) => {
  res.render("404");
});

module.exports = router;
