//NOTE: created service - values.js so Coordinate can be accessed throughout app and multi-controllers
var app = angular.module('app');

app.value('Coordinate',
  {
    lat: null,
    lng: null,
    draggable: true,
  }
);