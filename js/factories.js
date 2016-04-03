var app = angular.module('app');

var latValue = 21.414341;
var longValue = -157.7918479;
var radius = 25;

app.factory('EventFactory', [
  '$http',
  'myConfig',
  function($http, myConfig){
    return {
      getEvents: function() {
        return $http({
          method: 'GET',
          url: "/api/events",
        });
      },

      getEventById: function(id){
        return $http({
          method: "GET",
          url: "/api/events/" + id,
        });
      },

      getTktMstr: function() {
        return $http.get(
          'https://app.ticketmaster.com/discovery/v1/events.json?size=1000&marketId=49&apikey=' + myConfig.tktMstrKey
          // 'https://app.ticketmaster.com/discovery/v1/events.json?latlong=' + latValue + '%2C' + longValue + '&radius=' + radius + '&apikey=' + myConfig.tktMstrKey
        );
      },

      // getEvntBrite: function() {
      //   return $http.get(
      //     'https://www.eventbriteapi.com/v3/events/search/?venue.city=honolulu&token=' + myConfig.evntBriteKey
      //   );
      // },

      postEvent: function(data){
        return $http.post(
          "/api/events",
          data
        ).then(function(newEvent){
          //TODO: on controller.js create newEvent
          return newEvent;
        });
      },

      updateEvent: function(data, id){
        return $http.put(
          "/api/events/edit/" + id,
          data
          ).then(function(res){
            return res.data;
          });
      },

      deleteEvent: function(data, id){
        console.log('Deleted event id ' + id);
        return $http.delete(
          "api/events/delete/" + id,
          data
        );
      },
    };

  }
]);