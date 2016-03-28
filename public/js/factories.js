var app = angular.module('app');

app.factory('Events', [
  '$http',
  function($http){
    return {
      getEvents: function() {
        return $http({
          method: 'GET',
          url: "api/events",
        });
      },

      getTktMstr: function() {
        return $http.get(
          'https://app.ticketmaster.com/discovery/v1/events.json?marketId=49&apikey=kejQVntR3erc03OmcE6rGwHIlVV0aNG0'
        );
      },

      postEvent: function(data){
        return $http.post(
          "/api/events",
          data
        ).then(function(newEvent){
          //TODO: on controller.js create newEvent
          return newEvent;
        });
      },
    };

  }
]);

app.factory('TktMstrFactory', [
  '$http',
]);