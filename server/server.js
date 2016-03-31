var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
var isAuthenticated = require('../middleware/isAuthenticated');
var CONFIG = require('../public/config');

var app = express();

mongoose.connect('mongodb://localhost/Get_A_Life');

var eventSchema = mongoose.Schema({
  title: String,
  created_by: String,
  description: String,
  latitude: Number,
  longitude: Number,
  start_time: Date,
  posts: Array
});
var Event = mongoose.model('Event', eventSchema);

var userSchema = mongoose.Schema({
  username: String,
  password: String,
});
var User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '..','public')));
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(session({
  secret: CONFIG.session.secret
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy (
  {
    passReqToCallback: true
  },
  function (req, username, password, done) {
    return User.findOne({
      username: username
    })
    .then(function (user) {
      console.log("user test", user);
      if (user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch(function (err) {
      return done(null, false);
    });
  })
);

// passport.use(new localStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function (userId, done) {
  users.findById(userId)
    .then(function(userId) {
      if (!userId) {
        return done(null, false);
      }
      return done(null, userId);
    });
});

app.get('/events', function(req, res) {
  Event.find({}, function(err, events){
    console.log('events', events);
    if(err){
      res.send("error error");
    }
    res.json(events);
  });
});

app.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if(err){
      res.send("something broke");
    }
    res.json(users);
  });
});

app.post('/events', function(req, res){
  //TODO: ajax request POST for Ben's setContent
  var newEvent = new Event({
    title: req.body.title,
    created_by: req.body.created_by,
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    start_time: req.body.start_time,
    posts: req.body.posts
  });
  newEvent.save(function(){
    res.send('Done');
  });
});

app.get('/logintest', isAuthenticated, function(req, res) {
  document.write('did you log in?');
});

app.route('/login')
  .get(function(req, res) {
    res.redirect('/login.html');
  })
  .post(
    passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/index.html'})
  );


app.listen(3000, function() {
  console.log('server is connected');
});