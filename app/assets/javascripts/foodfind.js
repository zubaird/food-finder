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



$("div#signup").on("click", function(){
  var inputUsername = $("input#username").val();
  var inputEmail = $("input#email").val();
  var inputPassword = $("input#password").val();
  var inputPasswordConfirm = $("input#password_confirm").val();

  $.ajax({
    url: "users",
    type: "post",
    data: {
      users:{
        username:inputUsername,
        email: inputEmail,
        password: inputPassword,
        password_confirmation: inputPasswordConfirm
      }
    }
  }).done(function(data){
    console.log(data);
  });
});

$("div#signin").on("click", function(){
  var inputUsername = $("input#username_signin").val();
  var inputPassword = $("input#password_signin").val();

  $.ajax({
    url: "signin", //session controller
    type: "post", //new session
    data: {
      users:{
        username: inputUsername,
        password: inputPassword,
      }
    }
  }).done(function(data){
    console.log(data);
    $('.ui.modal').modal("hide");
    $("h1#signin").html("");
    $("h1#signin").append(" Welcome " + data.username + " | ");
    $("h1#signin").append("<a href='#' id='signoutlink' data-id='"+ data.id + "'> Sign Out</a>");
    var userDetails = $("div#user-details");
    addNewEventFormTo(userDetails);
  });
});


function addNewEventFormTo(element){
   var newEventForm = "\
  <div class='left floated right aligned six wide column'>\
    <div class='ui form six wide column'>\
      <div class='ui left aligned segment'>\
        <label>Event Name</label>\
        <input type='text' id='userEventName'>\
        <label>Venue</label>\
        <input type='text' id='userEventVenue'>\
        <label>Start Date/Time</label>\
        <input type='text' id='userEventTime'>\
        <label>Image URL</label>\
        <input type='text' id='userEventImageUrl'>\
        <label>Event Link</label>\
        <input type='text' id='userEventLink'>\
        <div class='ui submit button' id='signup'>Add new event</div>\
      </div>\
    </div>\
  </div>\
  ";
  element.append(newEventForm);
  return newEventForm;
}


$("h1#signin").on("click", "a#signoutlink",function(){
  $.ajax({
    url: "/signout",
    type: "delete",
    data: {
      users:{
        id: $(this).data("id")
      }
    }
  }).done(function(data){
    $("h1#signin").html("");
    $("h1#signin").append("<h4 class='fourteen wide column' id='signin'><a href='#' id='signinlink'>(log in)</a></h4>");
  });
});


var url = "https://www.eventbriteapi.com/v3/events/search/";
var token = "&token=C77FKQUHP7G7SL7C7NA7";

$('.dropdown').dropdown({
  transition: 'drop'
});

$("a#signinlink").on("click", function(){
  $('.ui.modal').modal("show");
});

$("input#submit").on("click", function(){
  var inputValue = $("input#search-events").val();
  var inputRadius = $('.dropdown .text').text();
  var searchUrl  = url + "?location.address="+ inputValue.replace(/ /g, "+") + "&location.within=" + inputRadius + "mi" + token;
  var foodCheck = /(food|chocolate)/;
  var noFoodCheck = /(no food)|(no free food)|(No free food)/;
  //food/g
  $("div#events").html("");
  $("div#events").append("<div class='event ui cards' id='event-list'></div>");

  console.log(searchUrl);
  $.ajax({
    url: searchUrl,
    type: "get",
  }).done(function(data){
    console.log(data);
    for (var i = 0; i < data.events.length; i++) {

      if (data.events[i].description !== null ) {
        if (data.events[i].description.text != null) {
          var food = data.events[i].description.text.match(foodCheck);
          var noFood = data.events[i].description.text.match(noFoodCheck);
          var eventDescription = data.events[i].description.text;
        }else{
          var food = null;
          var eventDescription = "no description";
        }
        if (data.events[i].ticket_classes[0] != null) {
          var free = data.events[i].ticket_classes[0].free;
        }else{
          var free = false;
        }

      }

      console.log(data.events[i].url);

      if (data.events[i] != null && data.events[i].logo_url != null) {
        var eventImage = data.events[i].logo_url;
      }else{
        var eventImage = "http://lorempixel.com/output/cats-h-c-198-256-9.jpg";
      }

      jsonDate = data.events[i].start.local;
      if (jsonDate != null) {
        // 2015-08-10T07:00:00
        eventDate = jsonDate;
      }else{
        eventDate = "no start date found";
      }

      if (data.events[i].name.text != null) {
        var eventName = data.events[i].name.text;
      }else{
        var eventName = "Event Name not found";
      }
      var listItem =     '<div class="ui fluid card">\
                            <a href="' + data.events[i].url + '">\
                              <div class="image">\
                                <img src="' + eventImage + '">\
                              </div>\
                              <div class="content">\
                              <a class="header">' + eventName + '</a>\
                                <div class="meta">\
                                <span class="date"> Starts: ' + eventDate + '</span>\
                                </div>\
                                <div class="description">\
                                ' + eventDescription + '\
                                </div>\
                                </div>\
                              <div class="extra content">\
                              </div>\
                            </a>\
                          </div>';

      // $("ul#event-list").append("<div id='map-canvas'" + i + "></div");
      // loadMap(data.events[i].venue.address.longitude,data.events[i].venue.address.latitude,i);

      if (food != null && free === true && noFood == null) {
        $("div#event-list").append(listItem);
      }
    }
    if ($("div#event-list").children().size() == 0 ) {
      $("div#event-list").append("<h1>No results</h1>");
    }
  });
});
}

$(document).ready(init);


// <div class="image">
// <img src="' + data.events[i].logo_url + '>
// </div>
