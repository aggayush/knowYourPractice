/*
This is jquery script for the page
*/

var base_url = "https://api.practo.com/";
var X_CLIENT_ID = "cb361f8c-cbf3-4ea9-ac2f-76c619a59a82";
var X_API_KEY = "LXrzokVA14koHb+WKv/4BdRDIpU=";

// this method loads the cities when document is ready to be loaded
$(document).ready(function(){

var url = base_url + "meta/search/cities";
var citi_data = null;
var user_country;

// to know the country of user
$.getJSON("http://freegeoip.net/json/", function(data) {

});

// to get all the cities supported by practo
$.ajax({
      type: 'GET',
      url: url,
      dataType: "json",
      headers: {
          "X-CLIENT-ID":X_CLIENT_ID,
          "X-API-KEY":X_API_KEY
      }
    })
    .success(function(data){

    })
    .error(function(error_obj,status){
        console.log("Error calling API. Got status: " + status);
    });


});
