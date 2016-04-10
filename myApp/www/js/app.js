// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('myApp', ['ionic', 'starter.controllers', 'ui-leaflet'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'EventController'
      }
    }
  })

  .state('app.events', {
    url: '/events',
    views: {
      'menuContent': {
        templateUrl: 'templates/events.html',
        controller: 'EventController'
      }
    }
  })

  .state('app.editEvents', {
    url: '/events/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/edit-event.html',
        controller: 'EditController as EditController'
      }
    }
  })

  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapController'
      }
    }
  })

  .state('app.user', {
    url: '/user',
    views: {
      'menuContent': {
        templateUrl: 'templates/user.html',
        controller: 'UserController'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/map');
});
