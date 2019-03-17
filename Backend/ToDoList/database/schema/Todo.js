var mongoose = require('mongoose');

var Todos = new mongoose.Schema({
    activity: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    status: Boolean
});

module.exports = Todos 