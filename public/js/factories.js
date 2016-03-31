var app = angular.module('app');

app.factory('EventFactory', [
  '$http',
  function($http){
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
          'https://app.ticketmaster.com/discovery/v1/events.json?marketId=49&apikey=kejQVntR3erc03OmcE6rGwHIlVV0aNG0'
        );
      },

      getEvntBrite: function() {
        return $http.get(
          'https://www.eventbriteapi.com/v3/events/search/?venue.city=honolulu&token=BDMUJMKAWOGCYVJD7SYA'
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