angular.module('starter.controllers', ['ui-leaflet', 'starter.factories'])

.directive('appInfo', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      info: '=' 
    }, 
    templateUrl: 'js/mapfilter.html' 
  }; 
});