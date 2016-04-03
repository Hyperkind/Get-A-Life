var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');
var isAuthenticated = require('../middleware/isAuthenticated');
var CONFIG = require('../config');

var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
  apiKey: CONFIG.GOOGLE_GEOCODER.apiKey,
  formatter:null
};

var app = express();

mongoose.connect('mongodb://localhost/Get_A_Life');

var eventSchema = mongoose.Schema({
  title: String,
  created_by: String,
  description: String,
  latitude: Number,
  longitude: Number,
  start_date: Date,
  posts: Array
});
var Event = mongoose.model('Event', eventSchema);

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  oauthID: Number,
  name: String,
  created: Date
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
//CORS cross origin between server (localhost:3000 and 8100)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

passport.use(new FacebookStrategy({
  clientID: CONFIG.FACEBOOK.APP_ID,
  clientSecret: CONFIG.FACEBOOK.SECRET,
  callbackURL: CONFIG.FACEBOOK.CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ oauthID: profile.id }, function(err, user) {
      if(err) {
        console.log(err);
      }
      if(!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          oauthID: profile.id,
          name: profile.displayName,
          created: Date.now()
        });
        user.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log('saving user ...');
            done(null, user);
          }
        });
      }
    });
  }
));

passport.use(new TwitterStrategy({
  consumerKey: CONFIG.TWITTER.CONSUMER_KEY,
  consumerSecret: CONFIG.TWITTER.CONSUMER_SECRET,
  callbackURL: CONFIG.TWITTER.CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ oauthID: profile.id }, function(err, user) {
      if(err) {
        console.log(err);
      }
      if(!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          oauthID: profile.id,
          name: profile.displayName,
          created: Date.now()
        });
        user.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log('saving user...');
            done(null, user);
          }
        });
      }
    });
  }
));

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function (userId, done) {
  User.findById(userId)
    .then(function(userId) {
      if (!userId) {
        return done(null, false);
      }
      return done(null, userId);
    });
});


app.get('/api/events', function(req, res) {
  Event.find({}, function(err, events){
    if(err){
      res.send("error error");
    }
    res.json(events);
    console.log(req.query);
  });
});

app.get('/api/events/:id', function(req, res){
  console.log('hello');
  var eventId = req.params.id;
  Event.findById(eventId, function(err, event){
    if(err){
      console.log(eventId + ' is not a valid ID');
      throw err;
    }
  })
  .then(function(event){
    res.json(event);
  });
});

app.post('/api/events', function(req, res){
  console.log('req.body', req.body);
  var newEvent = new Event({
    title: req.body.title,
    created_by: req.body.created_by,
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    start_date: req.body.start_date,
    posts: req.body.posts
  });
  newEvent.save(function(err, event){
    var eventId = newEvent._id;
    res.json(event);
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

//TODO: ajax request POST for Ben's setContent

//RESEARCH: edit date, how to retain original date
app.put('/api/events/edit/:id', function(req, res){
  var eventId = req.params.id;
  console.log('eventId in PUT', eventId);
  Event.findOne({ _id: eventId })
  .then(function(event){
    event.title = req.body.title;
    event.created_by = req.body.created_by;
    event.description = req.body.description;
    event.latitude = req.body.latitude;
    event.longitude = req.body.longitude;
    event.start_date = req.body.start_date;
    event.posts = req.body.posts;

    return event.save();
  })
  .then(function(){
    res.send("This card " + eventId + " has been updated");
  });
});

app.delete('/api/events/delete/:id', function(req, res){
  var eventId = req.params.id;
  console.log('eventId', eventId);
  Event.findByIdAndRemove({
    _id: eventId
  }).then(function(event){
    res.send("This event " + eventId + " has been deleted");
  });
});

app.route('/login')
  .get(function(req, res) {
    res.redirect('login.html');
  })
  .post(
    passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/index.html'})
  );

app.route('/register')
  .get(function(req, res) {
    res.redirect('register.html');
  })
  .post(function(req, res) {
    User.create(req.body)
      .then(function() {
        res.redirect('login.html');
      });
  });

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res) {});

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res) {});

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.listen(3000, function() {
  console.log('server is connected');
});