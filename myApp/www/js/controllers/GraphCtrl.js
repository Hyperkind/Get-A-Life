angular.module('graph.controller', ['ui-leaflet', 'event.factories','nvd3', 'angularMoment'])

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
        // console.log (category);
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
      // console.log(category);
      var targetBar = data.find(function(bar){
      return bar.key === category;
      });
      if (!targetBar){
        data.push({
          key: category,
          color: "#0000FF",
          //look to make into an object? and then update
          values:[{
            "category": category,
            "value": 1
          }]
        });
      } else{
          //reflect data structure of nvd3's $scope.data
          targetBar.values[0].value++;
        }
      return data;
      }, []);
    // console.log($scope.horizontalChartData);

    $scope.donutData = $scope.events.map(function(event){
        return event.category || "N/A";
      })
      //after map array of objects, reduce category properties
      //creating new category if not existing and incrementing if does
      //TODO: improve optimization doing just a reduce, faster
      //label and value is nvd3' setup of data
      .reduce(function(data, category){
        // console.log (category);
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

    $scope.stckedEventData = $scope.events.map(function(event){

      return {
        category: event.category || "N/A",
        //changing from a string to time value
        date: new Date(event.start_date).getTime(),
      };
    })
    //event has to have a date
    .filter(function(event){
      return event.date;
    })
    .reduce(function(data, event){
      var targetLine = data.find(function(line){
        return line.key === event.category;
      });
      //reformating our data to nvd3's StackedChart format
      var defaultDay = [event.date, 1];
      if (!targetLine){
        data.push({
          //matching to key got categories to appear
          key: event.category,
          values: [defaultDay]
        });
      } else{
        var targetDay = targetLine.values.find(function(day){
        //day[0] = since first thing in defaultDay is a date
          return day[0] === event.date;
        });
        if(targetDay){
          targetDay[1]++;
        } else{
          targetLine.values.push(defaultDay);
        }
      }
      return data;
    }, []);
    //timeSpan combines all the lines with different dates into one array
    var timeSpan = $scope.stckedEventData.reduce(function(timeSpan, line){
      line.values.forEach(function(day){
        if(timeSpan.indexOf(day[0]) === -1){
          timeSpan.push(day[0]);
        }
      });
      return timeSpan;
    }, []);
    // console.log(timeSpan);
    $scope.stckedEventData.forEach(function(line){
      timeSpan.forEach(function(timeStamp){
        var targetDay = line.values.find(function(day){
          return day[0] === timeStamp;
        });
        if(!targetDay){
          line.values.push([
            timeStamp, 0
          ]);
        }
      });
      line.values = line.values.sort(function(a, b){
        return a[0] - b[0];
      })
      .slice(0, 30);
    });
    console.log(timeStamp);
    console.log($scope.stckedEventData);
    var test = $scope.stckedEventData.every(function(line){
      return line.values.every(function(day){
        return day[0];
      });
    });
    console.log('test', test);
  });
  /******************CHARTS*****************/
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

  $scope.stckedEventChart = {
            chart: {
                type: 'stackedAreaChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                useVoronoi: false,
                clipEdge: true,
                duration: 100,
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function(d) {
                        return d3.time.format('%B')(new Date(d));
                    }
                },
                yAxis: {
                    tickFormat: function(d){
                        return d3.format(',.0f')(d);
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

  }
]);

