angular.module('edit.controller', ['ui-leaflet', 'event.factories'])

.controller('EditCtrl', [
  '$scope',
  '$stateParams',
  'EventFact',
  '$location',
  '$window',
  '$state',
  '$filter',
  'GOOGLE_GEOCODER',
  function($scope, $stateParams, EventFact, $location, $window, $state, $filter, GOOGLE_GEOCODER){
    EventFact.getEventById($stateParams.id)
      .then(function(res){
        var event = res.data;
        $scope.title = event.title;
        $scope.created_by = event.created_by;
        $scope.description = event.description;
        $scope.category = event.category;
        $scope.date = $filter('date')(event.start_date, 'yyyy-MM-dd');
        $scope.time = $filter('date')(event.start_date, 'hh:mm:ss');
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

    $scope.remove = function($stateparams){
      var data = {
        title: $scope.title,
        created_by: $scope.created_by,
        description: $scope.description,
        start_date: $scope.start_date,
      };
      EventFact.deleteEvent(data, $stateParams.id)
        .then(function(data){
          $window.history.back();
        });
    };

    $scope.goBack = function() {
      $window.history.back();
    };
  }
]);