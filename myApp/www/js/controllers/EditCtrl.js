angular.module('edit.controller', ['ui-leaflet', 'event.factories', 'angularMoment'])

.controller('EditCtrl', [
  '$scope',
  '$stateParams',
  'EventFact',
  '$location',
  '$window',
  '$state',
  '$filter',
  function($scope, $stateParams, EventFact, $location, $window, $state, $filter){
    EventFact.getEventById($stateParams.id)
      .then(function(res){
        var event = res.data;
        $scope.title = event.title;
        $scope.created_by = event.created_by;
        $scope.description = event.description;
        $scope.category = event.category;
        $scope.date = $filter('date')(event.start_date, 'yyyy-MM-dd');
        $scope.time = $filter('date')(event.start_date, 'hh:mm:ss');
        console.log($scope.date);
        console.log($scope.time);
      });

    $scope.editEvent = function(event){
      event.preventDefault();
      var date = event.target.edit_date.value;
      var time = event.target.edit_time.value;
      var editData = {
        title: event.target.title.value,
        category: event.target.category.value,
        start_date: moment(date + ' ' + time).toDate(),
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