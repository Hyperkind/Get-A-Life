var mongoose = require('mongoose');
var events = require('./events-dataset-clean-hawaii');

mongoose.connect('mongodb://localhost/Get_A_Life');

var eventSchema = mongoose.Schema({
  title: String,
  created_by: String,
  start_date: Date,
  category: String,
  latitude: Number,
  longitude: Number,
  location_name: String,
  venue_name: String,
  address: String,
  city: String,
  zip: Number,
  posts: Array
});
var Event = mongoose.model('Event', eventSchema);

Event.create(events, function(err, savedEvents) {
  if (err) {
    throw err;
  }
  console.log(savedEvents);
});