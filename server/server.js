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
var CONFIG = require('./config');
var moment = require('moment');

var app = express();

mongoose.connect('mongodb://localhost/Get_A_Life');

var eventSchema = mongoose.Schema({
  title: String,
  created_by: String,
  category: String,
  start_date: Date,
  latitude: Number,
  longitude: Number,
  venue_name: String,
  address: String,
  city: String,
  zip: Number,
  description: String,
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
  secret: 'placeholder'
}));
app.use(passport.initialize());
app.use(passport.session());
//CORS cross origin between server (localhost:3000 and 8100)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

passport.use(new localStrategy (
  {
    passReqToCallback: true
  },
  function (req, username, password, done) {
    console.log('searching...');
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

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(userId, done) {
  User.findById(userId)
    .then(function(userId) {
      if (!userId) {
        return done(null, false);
      }
      return done(null, userId);
    });
});

app.route('/api/events')
  .get(function(req, res) {
    Event.find({}, function(err, events){
      if(err){
        res.send("error error");
      }
      res.json(events);
      console.log(req.query);
    });
  })
  .post(function(req, res){
    var newEvent = new Event({
      title: req.body.title,
      created_by: req.body.created_by,
      category: req.body.category,
      latitude: req.body.lat,
      longitude: req.body.long,
      start_date: moment(moment(req.body.date).format('YYYY-MM-DD') + ' ' + moment(req.body.time).format('HH:mm:ss')).toDate(),
      venue_name: req.body.venue_name,
      address: req.body.address,
      city: req.body.city,
      zip: req.body.zip,
      description: req.body.description,
      posts: req.body.posts
    });
    console.log(newEvent);
    newEvent.save(function(err, event){
      var eventId = newEvent._id;
      res.json(event);
    });
  });

app.route('/api/events/:id')
  .get(function(req, res) {
    var eventId = req.params.id;
    Event.findById(eventId, function(err, event) {
      if (err) {
        console.log(eventId + ' is not a valid ID');
        throw err;
      }
    })
      .then(function(event) {
        res.json(event);
      });
  })
  .put(function(req, res) {
    var eventUpdates = req.body;
    var eventId = req.params._id;
    Event.update({id: eventId}, eventUpdates, function(err, eventUpdates) {
      if (!err) {
        res.json("okay");
      } else {
        res.write("fail");
      }
    });
  })
  .delete(function(req, res) {
    var eventId = req.params.id;
    console.log('eventId', eventId);
    Event.findByIdAndRemove({
      _id: eventId
    }).then(function(event){
      res.send("This event " + eventId + " has been deleted");
    });
  });

app.get('/api/users', isAuthenticated, function(req, res) {
  User.find({}, function(err, users) {
    if(err){
      res.send("something broke");
    }
    res.json(users);
  });
});

app.get('/api/users/:id', function(req, res) {
  var userId = req.params.id;
  User.findById(userId, function(err, user) {
    if(err) {
      console.log(userId + ' is not a valid ID');
      throw err;
    }
  })
  .then(function(user) {
    res.json(user);
  });
});

app.post('/register', function(req, res) {
  var newUser = new User ({
    username: req.body.username,
    password: req.body.password
  });
  console.log(newUser);
  newUser.save(function(err, event){
    var userId = newUser._id;
    res.json(event);
  });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
  if (err) {
    return next(err);
  }
  if (!user) {
    return res.status(401).json({
      err: info
    });
  }
  req.logIn(user, function(err) {
    if (err) {
      return res.status(500).json({
        err: 'Could not log in user'
      });
    }
    res.send({key: CONFIG.session.AUTH});
  });
  })(req, res, next);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

app.listen(3000, function() {
  console.log('server is connected');
});