/*
This is jquery script for the page
*/

var base_url = "https://api.practo.com/";
var X_CLIENT_ID = "cb361f8c-cbf3-4ea9-ac2f-76c619a59a82";
var X_API_KEY = "LXrzokVA14koHb+WKv/4BdRDIpU=";

// to load content at page load
$(document).ready(function(){

  var url = base_url + "meta/search/cities";
  var user_country;
  var country_list = [];
  var citi_list = [];

// call to get country of user
  var geocodeCall = $.ajax({
                        type: 'GET',
                        dataType: 'jsonp',
                        url: "http://freegeoip.net/json/"
                      });

// call to get all the cities supported
  var citiCall = $.ajax({
                      type: 'GET',
                      url: url,
                      dataType: "json",
                      headers: {
                        "X-CLIENT-ID":X_CLIENT_ID,
                        "X-API-KEY":X_API_KEY
                      }
                   });


  $.when(geocodeCall,citiCall).then(function(responseCall1,responseCall2){
    onSuccess(responseCall1,responseCall2);
  },onFailure);

// to select only those cities which are in user city.
  function onSuccess(responseCall1,responseCall2){

      user_country = responseCall1[0].country_name;
    //  country_list = [];
  //    console.log(user_country);

      $.each(responseCall2[0].cities,function(index,value){

          var citiDetail = value;
          country_list.push(citiDetail.state.country.name);

          if(citiDetail.state.country.name==user_country){
              $('[name=city_select]').append($('<option>',{
                  value: citiDetail.id,
                  text: citiDetail.name
              }));
          }
      });

      $.uniqueSort(country_list);

      $.each(country_list,function(index){
          if(country_list[index]==user_country){
            $('[name=country_select]').append($('<option>',{
                value: country_list[index],
                text: country_list[index],
                selected: true
            }));
          }
          else{
              $('[name=country_select]').append($('<option>',{
                  value: country_list[index],
                  text: country_list[index]
              }));
          }
      });
  }

  var onFailure = function(){
    console.log("call failed");
  }
});

// it fills the localities options and also enable autocomplete feature
function fillNearbyArea(){

  var city_id = $('[name=city_select]').val();
  var url = base_url + "meta/search/cities/" + city_id;
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

    $('[name=nearby_select]')
            .find('option')
            .remove()
            .end()
            .append('<option label="default" value="" disabled selected>Select Nearby Area</option>')

    $.each(data.localities,function(index,value){
      $('[name=nearby_select]').append($('<option>',{
          value: value,
          text: value
      }));
    });

    $('#searchbar').autocomplete({
      source: function(request, response) {
        var results = $.ui.autocomplete.filter(data.specialties, request.term);
        response(results.slice(0, 10));
      }
    });
  });
}

function reloadPage(){

  //TODO
  // reload the page with new country

}
