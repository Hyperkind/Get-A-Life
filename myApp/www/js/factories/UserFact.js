angular.module('user.factories', ['starter.config'])

.factory('UserFact', [
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