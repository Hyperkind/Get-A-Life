var app = angular.module('app');

app.factory('EventFactory', [
  '$http',
  function($http){
    return {
      getEvents: function() {
        return $http({
          method: 'GET',
          url: "api/events",
        });
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