var tktMstr = require('../tktMstrData');
var mongoose = require('mongoose');
var CONFIG = require('../server/config');
var moment = require('moment');

var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
  apiKey: CONFIG.GOOGLE_GEOCODER.apiKey,
  formatter:null
};
var fs = require('fs');

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

var singleEvent;
var title;
var created_by;
var eventDate;
var start_time;
var start_date;
var date;
var time;
var start_date;
var latitude;
var longitude;
var address;
var city;
var zip;
var category;
var eventObjArr = [];

// var date = moment(start_date + ' ' + start_time).toDate();

  // console.log(tktMstr[0].dates.start.localTime);


for (var i = 0; i < tktMstr.length; i++) {
  var venue = tktMstr[i]._embedded.venue;
  title = tktMstr[i].name;
  created_by = 'TicketMaster';
  category = tktMstr[i]._embedded.categories[0].name;
  date = tktMstr[i].dates.start.localDate;
  time = tktMstr[i].dates.start.localTime;
  start_date = moment(date + ' ' + time).toDate();
  latitude = venue[0].location.latitude;
  longitude = venue[0].location.longitude;
  address = venue[0].address.line1;
  city = venue[0].city.name;
  zip = venue[0].postalCode;

  eventObjArr.push(fetchGeoCodeLocation(title, created_by, category, start_date, latitude, longitude, address, city, zip, i));

}
console.log(eventObjArr);

Promise.all(eventObjArr)
  .then(function(events) {
    // console.log(events);
    events = events.filter(function(event) {
      return event;
    });
    console.log('thing', events[56]);
    fs.writeFile('events-dataset-clean.json', JSON.stringify(events), function(err) {
      if (err) {
        console.log(err);
      }
      console.log('events-dataset-clean.json');
    });
  });

// var tktMstrEvents = '777 ward ave honolulu';
// geocoder.geocode(tktMstrEvents)
//     .then(function(res) {
//         console.log(res);
//     })
//     .catch(function(err) {
//         console.log(err);
//     });

function fetchGeoCodeLocation (title, created_by, category, start_date, latitude, longitude, address, city, zip, i) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      geocoder.geocode(address + ' Hawaii',
        function(err, res) {
          if (err) {
            return resolve(null);
          }

          var eventObj;
          // console.log(title);

          if (res[0].administrativeLevels.level1short !== 'HI') {
            eventObj = {
              title: title,
              created_by: created_by,
              category: category,
              start_date: start_date,
              address: address,
              city: city,
              zip: zip,
              latitude: null,
              longitude: null
            };
          } else {
            eventObj = {
              title: title,
              created_by: created_by,
              category: category,
              start_date: start_date,
              address: address,
              city: city,
              zip: zip,
              latitude: res[0].latitude,
              longitude: res[0].longitude
            };
          }
          // console.log('test', title);
          return resolve(eventObj);
        });
    }, 200 * i);
  });
}