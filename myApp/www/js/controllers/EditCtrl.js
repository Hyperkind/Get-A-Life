angular.module('edit.controller', ['ui-leaflet', 'event.factories'])

.controller('EditCtrl', [
  '$scope',
  '$stateParams',
  'EventFact',
  '$location',
  '$window',
  '$state',
  function($scope, $stateParams, EventFact, $location, $window, $state){
    EventFact.getEventById($stateParams.id)
      .then(function(res){
        var event = res.data;
        $scope.title = event.title;
        $scope.created_by = event.created_by;
        $scope.description = event.description;
        $scope.start_date = event.start_date;
        $scope.category = event.category;
      });
    console.log('$stateParams', $stateParams);

    $scope.$on('$ionicView.enter', function() {
    // code to run each time view is entered
    });

    $scope.editEvent = function(event){
      event.preventDefault();
      var editData = {
        title: event.target.title.value,
        category: event.target.category.value,
        start_date: event.target.start_date.value,
        description: event.target.description.value
        };
      event.preventDefault();
      EventFact.updateEvent(editData, $stateParams.id)
      .then(function(data){
        $window.history.back();
      });
    };
  }
]);