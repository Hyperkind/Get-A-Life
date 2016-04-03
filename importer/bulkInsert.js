var mongoose = require('mongoose');
var events = require('./events-dataset-clean');

mongoose.connect('mongodb://localhost/Get_A_Life');

var eventSchema = mongoose.Schema({
  title: String,
  created_by: String,
  start_date: Date,
  latitude: Number,
  longitude: Number,
  address: String,
  posts: Array
});
var Event = mongoose.model('Event', eventSchema);

Event.create(events, function(err, savedEvents) {
  if (err) {
    throw err;
  }
  console.log(savedEvents);
});