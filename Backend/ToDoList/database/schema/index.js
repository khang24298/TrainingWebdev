let mongoose = require('mongoose');
let Todos = require('./Todo');
let Users = require('./User');

module.exports = {
  Todos: mongoose.model("Todos", Todos),
  Users: mongoose.model("Users", Users)
}