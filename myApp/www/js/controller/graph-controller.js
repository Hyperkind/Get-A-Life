angular.module('graph.controllers', ['ui-leaflet', 'starter.factories','nvd3'])

.controller('GraphController', [
  '$scope',
  'EventFactory',
  function($scope, EventFactory){
    $scope.eventLists = {};
    $scope.events = [];
    // var categories = [];
    EventFactory.getEvents()
    .then(function(events){
      $scope.events = events.data;
      console.log($scope.events);
      $scope.data = $scope.events.map(function(event){
        return event.category || "N/A";
      })
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
        //TODO get reduce showing up here

    }
    ]);