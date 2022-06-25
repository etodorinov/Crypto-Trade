const express = require("express");
const cookieParser = require("cookie-parser");

const {
  expressHandlebarsInitialization,
} = require("./expressHandlebarsInitialization");
const router = require("../routes");
const { userMiddleware } = require("../middlewares/userMiddleware");

const { PORT } = require("../constants");

exports.expressInitialization = () => {
  const app = express();

  expressHandlebarsInitialization(app);

  app.use("/static", express.static("./src/static"));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(userMiddleware);
  app.use(router);

  app.listen(PORT, () => {
    console.log(`App started on port ${PORT}...`);
  });
};
