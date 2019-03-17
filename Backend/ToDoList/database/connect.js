module.exports = {
  connect: () => {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/todolists', {useNewUrlParser: true});
  }
}