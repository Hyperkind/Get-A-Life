angular.module('user.controller', ['ui-leaflet', 'starter.factories'])

.controller('UserCtrl', [
  '$scope',
  'UserFact',
  function($scope, UserFactory) {
    $scope.user = [];
    UserFactory.getUser()
    .then(function(user) {
      $scope.user = user.data;
      console.log($scope.user);
    });
  }
]);