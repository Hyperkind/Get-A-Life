angular.module('event.factories', ['starter.config'])

.factory('EventFact', [
  '$http',
  'myConfig',
  'ENDPOINT',
  function ($http, myConfig, ENDPOINT){
    return {
      getEvents: function() {
        return $http({
          method: 'GET',
          url: ENDPOINT + "/api/events",
        });
      },

      getEventById: function(id){
        return $http({
          method: "GET",
          url: ENDPOINT + "/api/events/" + id,
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
          ENDPOINT + "/api/events",
          data
        ).then(function(newEvent){
          //TODO: create newEvent on map
          return newEvent;
        });
      },

      updateEvent: function(data, id){
        return $http.put(
          ENDPOINT + "/api/events/" + id,
          data
          ).then(function(res){
            return res.data;
          });
      },

      deleteEvent: function(data, id){
        console.log('Deleted event id ' + id);
        return $http.delete(
          ENDPOINT + "/api/events/" + id,
          data
        );
      },
    };
  }
]);