tktMstrAPI();
evntBriteAPI(honolulu);

function tktMstrAPI() {
  $.ajax({
    method: "GET",
    url: "https://app.ticketmaster.com/discovery/v1/events.json?radius=20&size=5&marketId=49&apikey=kejQVntR3erc03OmcE6rGwHIlVV0aNG0",
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

function evntBriteAPI(cityName) {
  $.ajax({
    method: "GET",
    url: "https://www.eventbriteapi.com/v3/events/search/?venue.city=" + cityName + "&token=BDMUJMKAWOGCYVJD7SYA",
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