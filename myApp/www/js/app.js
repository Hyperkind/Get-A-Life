// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('myApp', [
  'ionic',
  'main.controller',
  'map.controller',
  'event.controller',
  'edit.controller',
  'tktmstr.controller',
  'user.controller',
  'graph.controller',
  'ui-leaflet',
  'angularMoment'
  ])

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

  .state('app.events', {
      url: '/events',
      views: {
        'menuContent': {
          templateUrl: 'templates/events.html',
          controller: 'EventCtrl'
        }
      }
    })

  .state('app.graph', {
    url: '/graph',
    views: {
      'menuContent': {
        templateUrl: 'templates/graph.html',
        controller: 'GraphCtrl'
      }
    }
  })

  .state('app.graphPie', {
    url: '/graph/pie',
    views: {
      'menuContent': {
        templateUrl: 'templates/pie-graph.html',
        controller: 'GraphCtrl'
      }
    }
  })

  .state('app.graphHoriz', {
    url: '/graph/horizontal',
    views: {
      'menuContent': {
        templateUrl: 'templates/horizontal-line-graph.html',
        controller: 'GraphCtrl'
      }
    }
  })

  .state('app.graphDonut', {
    url: '/graph/donut',
    views: {
      'menuContent': {
        templateUrl: 'templates/donut-chart.html',
        controller: 'GraphCtrl'
      }
    }
  })

  .state('app.editEvents', {
    url: '/events/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/edit-event.html',
        controller: 'EditCtrl'
        // EditController as EditController
      }
    }
  })

  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('app.user', {
    url: '/user',
    views: {
      'menuContent': {
        templateUrl: 'templates/user.html',
        controller: 'UserCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/map');
});
