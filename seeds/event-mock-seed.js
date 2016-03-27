var mongoose = require('mongoose');
var moment = require('moment');
var faker = require('faker');

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

var events = [];

for(var i=0; i < 10; i++) {
  events.push({
    title: faker.lorem.words(),
    created_by: faker.internet.userName(),
    description: faker.lorem.sentence(),
    latitude:((Math.random() * 0.001) - 0.0005) + 21.309112400000004,
    longitude:((Math.random() * 0.001) - 0.0005) - 157.80858849999998,
    start_time: moment().add(Math.ceil(Math.random() * 5), 'days').toDate(),
    posts: mockPosts(5)
  });
}

Event.create(events, function(err, savedEvents) {
  if (err) {
    throw err;
  }
  console.log(savedEvents);
});

function mockPosts(num) {
  num = num || 10;
  var rndPost = Math.ceil(Math.random() * num);

  var result = [];

  for(var i=0; i < rndPost; i++) {
    result.push({
      username: faker.internet.userName(),
      post: faker.lorem.sentence(),
      created_at: moment().toDate()
    });
  }
  return result;
}