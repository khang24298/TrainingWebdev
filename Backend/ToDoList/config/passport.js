var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcryptjs = require('bcryptjs');
var {Users} = require('../database/schema');

module.exports = passport => {
 

  /**
   * Serialize user for session
   */
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  

  /**
   * Deserialize user from sessions
   */
  passport.deserializeUser(function(id, done) {
    Users.findById(id, function(err, user) {
      user.password = null;
      done(err, user);
    });
  });

  /**
   * Authentication.
   */
  passport.use(new LocalStrategy(
    function(username, password, done) {
      Users.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        // User not exists.
        if (!user) { return done(null, false); }
        // Compare password.
        bcryptjs.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;

          if(isMatch) {
            user.password = null;
            return done(null, user);
          }
          return done(null, false);
        });        
      });
    }
  ));  
}