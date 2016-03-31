var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
// var CONFIG = require('../config.json');

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
//need to get from server dir to public so '..'
app.use(express.static(path.resolve(__dirname, '..','public')));

app.use(morgan('dev'));
app.use(methodOverride('_method'));

app.get('/api/events', function(req, res) {
  Event.find({}, function(err, events){
    if(err){
      res.send("error error");
    }
    res.json(events);
  });
});

//QUESTION: why showing a GET 404? Is it b/c goes right to a PUT?
app.get('api/events/:id', function(req, res){
  var eventId = req.params.id;
  Event.findById(eventId, function(err, events){
    if(err){
      console.log(eventId + ' is not a valid ID');
    }
  })
  .then(function(event){
    res.json(event);
  });
});

app.post('/api/events', function(req, res){
  console.log('req.body', req.body);
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
   newEvent.save(function(err, event){
    var eventId = newEvent._id;
    res.json(event);
  });
});

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
    event.start_time = req.body.start_time;
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

app.listen(3000, function() {
  console.log('server is connected');
});