angular.module('edit.controller', ['ui-leaflet', 'event.factories'])

.controller('EditCtrl', [
  '$scope',
  '$stateParams',
  'EventFact',
  '$location',
  function($scope, $stateParams, EventFact, $location){
    // var vm = this;
    // vm.title = null;
    // vm.created_by = null;
    // vm.description = null;
    // vm.start_date = null;

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

    $scope.closeEdit = function(){
      $ionicHistory.goBack();
    };

    $scope.editEvent = function(event){
      event.preventDefault();
      var editData = {
        title: event.target.title.value,
        // created_by: event.target,
        category: event.target.category.value,
        start_date: event.target.start_date.value,
        description: event.target.description.value
        };
      console.log('event', event);
      event.preventDefault();
      console.log('data', editData);
      EventFact.updateEvent(editData, $stateParams.id)
      .then(function(data){
        console.log('returned edited event', data);
        console.log('stateParams.id', $stateParams.id);
        $location.path('/events');
      });
    };
  }
]);