var app = angular.module('app');

app.factory('EventFactory', [
  '$http',
  'myConfig',
  function($http, myConfig){
    return {
      getEvents: function() {
        return $http({
          method: 'GET',
          url: "api/events",
        });
      },

      getTktMstr: function() {
        return $http.get(
          'https://app.ticketmaster.com/discovery/v1/events.json?marketId=49&apikey=' + myConfig.tktMstrKey
        );
      },

      getEvntBrite: function() {
        return $http.get(
          'https://www.eventbriteapi.com/v3/events/search/?venue.city=honolulu&token=' + myConfig.evntBriteKey
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