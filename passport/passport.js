/**
 * Created by mohist on 9/5/15.
 */
var passport = require("passport");
var LocalStrategy   = require('passport-local').Strategy;
var User = require("../models/User");
var bCrypt = require('bcrypt-nodejs');

passport.serializeUser(function(user, done) {
  //console.log('serializing user: ');
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    //console.log('deserializing user:',user);
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    console.log("function called");
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username },
      function(err, user) {
        console.log("user found");
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log the error and redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, {'message': 'User Not found.'});
        }
        // User exists but wrong password, log the error
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, {'message': 'Invalid Password'}); // redirect back to login page
        }
        // User and password both match, return user from done method
        // which will be treated like success
        return done(null, user);
      }
    );
  })
);

var isValidPassword = function(user, password){
  return user.password === password || bCrypt.compareSync(password, user.password);
};

module.exports = passport;