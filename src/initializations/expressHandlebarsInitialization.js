// const { engine } = require("express-handlebars");
const hbs = require("express-handlebars");

exports.expressHandlebarsInitialization = (app) => {
  //   app.engine("hbs", engine({ extname: "hbs" }));
  app.engine("hbs", hbs.engine({ extname: "hbs" }));
  app.set("view engine", "hbs");
  app.set("views", "./src/views");
};
