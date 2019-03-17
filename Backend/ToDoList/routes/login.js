var express = require('express');
var router = express.Router();
var passport = require('passport')

router.get('/login', (req, res, next) => {
  let error = req.query.error || null;
  if(error) {
    return res.render('login', {message: "Kiểm tra lại username và password"});
  }
  res.render('login');
});

router.post('/login', passport.authenticate(
    'local', { 
    successRedirect: '/',
    failureRedirect: '/auth/login?error=true' }
));

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/auth/login');
});

module.exports = router;