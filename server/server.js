var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

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

app.get('/events', function(req, res) {
  Event.find({}, function(err, events){
    console.log('events', events);
    if(err){
      res.send("error error");
    }
    res.json(events);
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

app.listen(3000, function() {
  console.log('server is connected');
});