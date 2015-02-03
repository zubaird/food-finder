//#https://www.eventbriteapi.com/v3/events/search/?location.address=1080+folsom+94103&location.within=12mi&token=C77FKQUHP7G7SL7C7NA7

function loadMap(long,lat,eventIndex){
  var starting_view = new google.maps.LatLng(long,lat);

  var mapOptions = {
    zoom: 15,
    center: starting_view
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'+ eventIndex), mapOptions);

  console.log("hit");

}

function init(){

var url = "https://www.eventbriteapi.com/v3/events/search/";
var token = "&token=C77FKQUHP7G7SL7C7NA7";

$("input#submit").on("click", function(){
  var inputValue = $("input#search-events").val();
  var searchUrl  = url + "?location.address="+ inputValue.replace(/ /g, "+") + "&location.within=12mi" + token;
  $("div#events").html("");
  $("div#events").append("<div class='event' id='event-list'></div>");


  console.log(searchUrl);
  $.ajax({
    url: searchUrl,
    type: "get",
  }).done(function(data){
    console.log(data);
    for (var i = 0; i < data.events.length; i++) {

      var food = data.events[i].description.text.match(/food/g);
      var free = data.events[i].ticket_classes[0].free;
      var listItem = "<div class='listing' id='event-" + data.events[i].id + "'>" + "<span class='event-detail'><a href='" + data.events[i].url + "'>" + "<img src='" + data.events[i].logo_url + "'</img></a></span>" +  "<span class='event-description'><p>" + food + "</p></span>" + "</div>";

      // $("ul#event-list").append("<div id='map-canvas'" + i + "></div");
      // loadMap(data.events[i].venue.address.longitude,data.events[i].venue.address.latitude,i);

      if (food != null && free === true) {
        $("div#event-list").append(listItem);
      }

    }
  });

});
}

$(document).ready(init);
