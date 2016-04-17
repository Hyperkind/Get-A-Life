angular.module('graph.controller', ['ui-leaflet', 'starter.factories','nvd3'])

.controller('GraphCtrl', [
  '$scope',
  'EventFactory',
  function($scope, EventFactory){
    $scope.eventLists = {};
    $scope.events = [];
    EventFactory.getEvents()
    .then(function(events){
      $scope.events = events.data;
      console.log($scope.events);
      //if no category setting it to N/A
      $scope.data = $scope.events.map(function(event){
        return event.category || "N/A";
      })
      //after map array of objects, reduce categories
      //creating new category if not existing and incrementing if does
      .reduce(function(data, category){
        var targetSlice = data.find(function(slice){
          return slice.label === category;
        });
        if (!targetSlice){
          data.push({
            label: category,
            value: 1
          });
        } else{
          targetSlice.value++;
        }
        return data;
      }, []);
    });

    $scope.options = {
      chart: {
        type: 'pieChart',
        height: 500,
        x: function(d){return d.label;},
        y: function(d){return d.value;},
        showLabels: true,
        duration: 500,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        legend: {
          margin: {
            top: 5,
            right: 35,
            bottom: 5,
            left: 0
          }
        }
      }
    };
  }
]);