angular.module('main.controller', ['ui-leaflet'])

.controller('AppCtrl', [
  '$scope',
  '$filter',
  '$ionicModal',
  '$timeout',
  '$http',
  'ENDPOINT',
  'leafletData',
  function($scope, $filter, $ionicModal, $timeout, $http, ENDPOINT, leafletData) {
  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(loginModal) {
    $scope.loginModal = loginModal;
  });

  $scope.login = function() {
    $scope.loginModal.show();
  };

  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  $scope.isLoggedIn = {};
  $scope.doLogin = function() {
    console.log("LOGIN - user: " + $scope.loginData.username + " - PW: " + $scope.loginData.password);
    $http.post(ENDPOINT + '/login', $scope.loginData)
      .success(function(data) {
        $scope.loginData = {};
        $scope.todos = $scope.loginData;
        $scope.isLoggedIn = data;
        StorageService.add(data);
        console.log(data);
        console.log('login successful');
        StorageService.getAll();
      })
      .error(function(data) {
        console.log('Error: ' + $scope.loginData);
      });
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.registerData = {};
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(registerModal) {
    $scope.registerModal = registerModal;
  });

  $scope.register = function() {
    $scope.registerModal.show();
  };

  $scope.closeRegister = function() {
    $scope.registerModal.hide();
  };

  $scope.newUser = function() {
    console.log("REGISTER - user: " + $scope.registerData.username + " - PW: " + $scope.registerData.password);
    $http.post(ENDPOINT + '/register', $scope.registerData)
      .success(function(data) {
        $scope.userData = {};
        $scope.todos = $scope.userData;
        console.log('new user created');
      })
      .error(function(data) {
        console.log('Error: ' + $scope.userData);
      });
    $timeout(function() {
      $scope.closeRegister();
    }, 1000);
  };

  $ionicModal.fromTemplateUrl('templates/add-popup.html', {
    scope: $scope
  }).then(function(eventModal) {
    $scope.addEventModal = eventModal;
  });

  $scope.addEvent = function(lat, lng) {
    $scope.passedLat = lat;
    $scope.passedLng = lng;
    $scope.addEventModal.show(lat, lng);
  };

  $scope.closeEvent = function() {
    $scope.addEventModal.hide();
  };

  $scope.newEvent = {};
  $scope.doEvent = function() {
    var date = event.target.start_date.value;
    var time = event.target.start_time.value;
    console.log($scope.passedLat);
    $scope.newEvent = {
         // title: event.target.title.value,
         // created_by: 'me',
         // category: event.target.category.value,
         // description: event.target.description.value,
         // lat: $scope.passedLat,
         // lng: $scope.passedLng,
        // start_date: moment(date + ' ' + time).toDate()
         //
        title: event.target.title.value,
        created_by: 'me',
        category: event.target.category.value,
        venue_name: event.target.venue_name.value,
        address: event.target.address.value,
        city: event.target.city.value,
        zip: event.target.zip.value,
        description: event.target.description.value,
        start_date: moment(date + ' ' + time).toDate(),
        latitude: $scope.passedLat,
        longitude: $scope.passedLng,
        // location_name: String,
        // address: String,
        // city: String,
        // zip: Number,
        // posts: Array
         //
        };
    $http.post(ENDPOINT + '/api/events', $scope.newEvent)
    .success(function(data) {
      $scope.newEvent = {};
    })
    .error(function(data) {
      console.log('Error: ' + $scope.newEvent);
    });
    $timeout(function(data) {
      $scope.closeEvent();
    }, 1000);
  };
}]);