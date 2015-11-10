Parse.initialize("8LiZGBvExsCRqQIlwP8GB1q1yh7ShdmxIMYB882g", "FmLeLaAltBlxJSyFPy7sOHzyqQCxLrz2zA1l3Goy");
var BandData = Parse.Object.extend('BandData');

var lastFmBase = "http://ws.audioscrobbler.com/2.0/";
var googleMapBase = "https://maps.googleapis.com/maps/api/geocode/json";
var musicBrainzBase = "http://musicbrainz.org/ws/2/artist/";
var lastFmKey = "ef2f18ff332a62f72ad46c4820bdb11b";
var googleKey = "AIzaSyBIFJX-BioTGbdc5g80uSqKCM8EtUdyuqs";

var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query='
var myApp = angular.module('myApp', [])
var holder = new Array();

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  
  $scope.iterator = [];
  $scope.bands = [];
  $scope.locations = [];
  
  $scope.audioObject = {};

  $scope.saveLocation = function(text, index){
      var json = JSON.parse(text);
      var artists = json.artists[0];
      var address = "";
      var currentBand = new BandData;
      currentBand.set("band", $scope.bands[index]);
      if(artists == undefined || artists['begin-area'] == undefined || artists.area == undefined){
        address = "unknown";
      }else{
        address = artists['begin-area'].name + ", " + artists.area.name;
      }
      currentBand.set("address", address);

      
      currentBand.save();


  };

  $scope.ajaxRequest = function(sync, destination, currentUrl, index){

    $.ajax({
      url : currentUrl,
      data : { param : "value" },
      dataType : 'text',
      async: sync,
      type : 'get',
      success : function(text) {
        // called after the ajax has returned successful response
        destination(text, index); // alerts the response
      },
      error : function(){
        var currentBand = new BandData;
        currentBand.set("band", $scope.bands[index]);
        currentBand.set("address", "unknown");
        currentBand.save();
      }
    });
  }

  var getLocations = function(){
    
    for(var j = 0; j < $scope.bands.length; j++){
      (function(j){
        var query = new Parse.Query(BandData);
        query.equalTo("band", $scope.bands[j]);

        query.find({
            success:function(results){
              if(results.length == 0){

                $scope.ajaxRequest("false", $scope.saveLocation, musicBrainzBase + "?query=artist:" + $scope.bands[j] +"&fmt=json", j);

              }else{
                $scope.locations[j] = results[0].get("address");
              }
            },
            error:function(error){
              alert("An error occurred");

            }
        })
                
        
      })(j);

    }
    
  };

  var loadLocations = function(){
    
    for(var i = 0; i < $scope.bands.length; i++){

      (function(i){

        query.equalTo("band", $scope.bands[i]);
        query.find({
            success:function(results){
                console.log(results[0].get("address"));
            }
        })
      })(i);
    }
  }

  $scope.getArtists = function(){
    $scope.iterator = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    $http.get(lastFmBase + "?user=" + $scope.user + "&method=user.gettopartists&api_key=ef2f18ff332a62f72ad46c4820bdb11b&format=json").then(function(response){
      
      var artists = response.data.topartists.artist;
      for(var i = 0; i < 10; i++){
        
        $scope.bandsdartists[i].name;
        //ajaxRequest('false', display, musicBrainzBase + "?query=artist:" + artists[i].name +"&fmt=json");

      }
      getLocations();
      
    })
      
      
    
    console.log($scope.bands)
    loadLocations();
  };

})

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
/*
window.onload = function(){
  $('#search').submit(function(){
    $("#location").html("");
    var username = $("#input").val();
    ajaxRequest('true', displayLast, lastFmBase + "?user="+ username + "&method=user.gettopartists&api_key=" + lastFmKey +"&format=json");
    });
  
}

function ajaxRequest(sync, destination, currentUrl){
  $.ajax({
    url : currentUrl,
    data : { param : "value" },
    dataType : 'text',
    async: sync,
    type : 'get',
    success : function(text) {
      // called after the ajax has returned successful response
      destination(text); // alerts the response
    },
    error : function(){
      alert("a band was not found");
    }
  });
}

function displayLast(text){
  var json = JSON.parse(text);
  var artists = json.topartists.artist;
  for(var i = 0; i < 10; i++){
    $scope.bands[i] = artists[i].name;
    ajaxRequest('false', display, musicBrainzBase + "?query=artist:" + artists[i].name +"&fmt=json");

  }
}

function getCoordinates(city, country){
  $.ajax({
    url : googleMapBase + "?address=" + city + ",+" + country + "&key=" + googleKey,
    data : { param : "value" },
    dataType : 'text',
    type : 'get',
    async: 'false',
    success : function(text) {
      // called after the ajax has returned successful response
      displayCoordinates(text); // alerts the response
    }
  });
}

function displayCoordinates(text){
  console.log(text);
  var json = JSON.parse(text);

  var lat = json.results[0].geometry.location.lat;
  var lng = json.results[0].geometry.location.lng;
  console.log(lat + " " + lng);

  $("#location").append("<br>lattitude: " + lat + "<br>" + "longitude: " + lng );
}

function display(text){
  var json = JSON.parse(text);
  var country = json.artists[0].area.name;

  var city = json.artists[0]["begin-area"].name;
  console.log(city + " " + country);

  $("#location").append(city + ", " + country + "<br>");

  getCoordinates(city, country);
}*/
