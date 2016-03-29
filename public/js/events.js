var lat = '21.3096086419986';
var lng = '-157.8086566532421';

tktMstrAPI(lat,lng);
evntBriteAPI(lat, lng);

function tktMstrAPI(lat, lng) {
  $.ajax({
    method: "GET",
    url: "https://app.ticketmaster.com/discovery/v1/events.json?latlong=" + lat + "%2C" + lng + "&apikey=kejQVntR3erc03OmcE6rGwHIlVV0aNG0",
    async: true,
    dataType: "json",
    success: function(data) {
      console.log(data);
    },
    error: function(err) {
      console.log('tktMstr messed up');
    }
  });
}

function evntBriteAPI(lat, lng) {
  $.ajax({
    method: "GET",
    url: "https://www.eventbriteapi.com/v3/events/search/?location.latitude=" + lat + "&location.longitude=" + lng + "&token=BDMUJMKAWOGCYVJD7SYA",
    async: true,
    dataType: "json",
    success: function(data) {
      console.log(data);
    },
    error: function(err) {
      console.log('evntBrite messed up');
    }
  });
}