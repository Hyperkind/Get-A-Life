angular.module('user.controller', ['ui-leaflet', 'user.factories'])

.controller('UserCtrl', [
  '$scope',
  'UserFact',
  function($scope, UserFact) {
    $scope.user = [];
    UserFactory.getUser()
    .then(function(user) {
      $scope.user = user.data;
      console.log($scope.user);
    });
  }
]);