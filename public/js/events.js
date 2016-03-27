var lat = '21.3096086419986';
var long = '-157.8086566532421';

tktMstrAPI(lat,long);
evntBriteAPI(lat, long);

function tktMstrAPI(lat, long) {
  $.ajax({
    method: "GET",
    url: "https://app.ticketmaster.com/discovery/v1/events.json?latlong=" + lat + "%2C" + long + "&apikey=kejQVntR3erc03OmcE6rGwHIlVV0aNG0",
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

function evntBriteAPI(lat, long) {
  $.ajax({
    method: "GET",
    url: "https://www.eventbriteapi.com/v3/events/search/?location.latitude=" + lat + "&location.longitude=" + long + "&token=BDMUJMKAWOGCYVJD7SYA",
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