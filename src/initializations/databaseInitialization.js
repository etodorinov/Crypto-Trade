const mongoose = require('mongoose');

const {DATABASE_URI} = require('../constants')

exports.databaseInitialization = () => mongoose.connect(DATABASE_URI);