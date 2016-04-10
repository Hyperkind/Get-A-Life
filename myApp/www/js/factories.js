angular.module('starter.factories', ['starter.config'])

.factory('EventFactory', [
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
          ENDPOINT + "/api/events/edit/" + id,
          data
          ).then(function(res){
            return res.data;
          });
      },

      deleteEvent: function(data, id){
        console.log('Deleted event id ' + id);
        return $http.delete(
          ENDPOINT + "/api/events/delete/" + id,
          data
        );
      },

    };
  }
])

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
])

// .factory('localStorage', [
//   '$window',
//   '$localStorage',
//   '$q',
//   function($window, $localStorage, $q) {
//     return {
//       set: function(key, value) {
//         var deferred = $q.defer();
//         $window.localStorage[key] = value;
//         deferred.resolve(1);
//         return deferred.promise;
//       },
//       get: function(key, defaultValue) {
//         return $window.localStorage[key] || defaultValue;
//       },
//       setObject: function(key, value) {
//         $window.localStorage[key] = JSON.stringify(value);
//       },
//       getObject: function(key) {
//         return JSON.parse($window.localStorage[key] || '{}');
//       }
//     };
//   }
// ]);

.factory('AuthService', [
  '$q',
  '$timeout',
  '$http',
  'ENDPOINT',
  function ($q, $timeout, $http, ENDPOINT) {

  // create user variable
  var user = null;

  // return available functions for use in the controllers
  return ({
    isLoggedIn: isLoggedIn,
    getUserStatus: getUserStatus,
    login: login,
    logout: logout,
    register: register
  });

  function isLoggedIn() {
    if(user) {
      return true;
    } else {
      return false;
    }
  }

  function getUserStatus() {
    return user;
  }

  function login(username, password) {

  var deferred = $q.defer();

  $http.post(ENDPOINT + '/login',
    {username: username, password: password})
    .success(function (data, status) {
      console.log('login successful');
      if(status === 200 && data.status){
        user = true;
        deferred.resolve();
      } else {
        user = false;
        deferred.reject();
      }
    })
    .error(function (data) {
      user = false;
      deferred.reject();
    });
    return deferred.promise;

  }

  function logout() {

  var deferred = $q.defer();

  $http.get(ENDPOINT + '/logout')
    .success(function (data) {
      console.log('logged out');
      user = false;
      deferred.resolve();
    })
    .error(function (data) {
      user = false;
      deferred.reject();
    });
  return deferred.promise;
  }

  function register(username, password) {

  var deferred = $q.defer();

  $http.post(ENDPOINT + '/register',
    {username: username, password: password})
    .success(function (data, status) {
      if(status === 200 && data.status){
        deferred.resolve();
      } else {
        deferred.reject();
      }
    })
    .error(function (data) {
      deferred.reject();
    });
  return deferred.promise;
}

}]);
