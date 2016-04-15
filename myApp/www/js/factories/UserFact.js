angular.module('starter.factories', ['starter.config'])

.factory('UserFactory', [
  '$http',
  'ENDPOINT',
  function($http, ENDPOINT) {
    return {
      getUser: function(data, id) {
        return $http.get(
          ENDPOINT + "/api/users/"
        );
      }
    };
  }
]);