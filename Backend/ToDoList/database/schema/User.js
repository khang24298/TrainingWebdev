var mongoose = require('mongoose');

var Users = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    fullname: {
      type: String
    }
});

module.exports = Users