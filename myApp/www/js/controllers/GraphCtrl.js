angular.module('graph.controller', ['ui-leaflet', 'event.factories','nvd3'])

.controller('GraphCtrl', [
  '$scope',
  'EventFact',
  function($scope, EventFact){
    $scope.eventLists = {};
    $scope.events = [];
    EventFact.getEvents()
    .then(function(events){
      $scope.events = events.data;
      //if no category setting it to N/A
      $scope.pieData = $scope.events.map(function(event){
        return event.category || "N/A";
      })
      //after map array of objects, reduce category properties
      //creating new category if not existing and incrementing if does
      //TODO: improve optimization doing just a reduce, faster
      //label and value is nvd3's setup of data
      .reduce(function(data, category){
        console.log (category);
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

    $scope.horizontalChartData = $scope.events.map(function(event){
      return event.category || "N/A";
    })
    .reduce(function(data, category){
      console.log(category);
      var targetBar = data.find(function(bar){
      return bar.key === category;
      });
      if (!targetBar){
        data.push({
          key: category,
          color: "#0000FF",
          values:[{
            "category": category,
            "value": 1
          }]
        });
      } else{
          //reflect data structure of nvd3's $scope.data
          targetBar.values[0].value++;
        }
      console.log('data', data);
      return data;
      }, []);
    console.log($scope.horizontalChartData);

    $scope.donutData = $scope.events.map(function(event){
        return event.category || "N/A";
      })
      //after map array of objects, reduce category properties
      //creating new category if not existing and incrementing if does
      //TODO: improve optimization doing just a reduce, faster
      //label and value is nvd3' setup of data
      .reduce(function(data, category){
        console.log (category);
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

  $scope.pieChart = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showLabels: true,
                labelsOutside: false,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
            }
        };

  $scope.multiBarHorizontalChart = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 450,
                x: function(d){return d.key;},
                y: function(d){return d.value;},
                // yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
                showControls: true,
                showValues: true,
                duration: 500,
                xAxis: {
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Values',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    }
                }
            }
        };

  $scope.donutChart = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showLabels: true,

                pie: {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2; },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2; }
                },
                duration: 500,
                legend: {
                    margin: {
                        top: 5,
                        right: 70,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };
  }
]);

