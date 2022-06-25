const {
  databaseInitialization,
} = require("./initializations/databaseInitialization");
const {
  expressInitialization,
} = require("./initializations/expressInitialization");

databaseInitialization().then(expressInitialization());
