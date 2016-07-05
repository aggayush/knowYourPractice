/*
This is jquery script for the home page
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

    $('#searchbar').keypress(function(e){
        if(e.keyCode==13){
          searchButtonClick(0,true);
        }
    });
});


// it fills the localities options and also enable autocomplete feature
function fillNearbyArea(){

  var city_id = $('[name=city_select]').val();
  var url = base_url + "meta/search/cities/" + city_id;

// to get localities for a given city and specialization in that locality.
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

    var sub_locality = [];

    $('[name=nearby_select]')
            .find('option')
            .remove()
            .end()
            .append('<option label="Select Locality" value="" disabled selected>Select Nearby Area</option>')

    $.each(data.localities,function(index,value){
      sub_locality.push(value);
    });

    $.uniqueSort(sub_locality);
    $.each(sub_locality,function(index,value) {
      $('[name=nearby_select]').append($('<option>',{
          value: value,
          text: value
      }));
    });

    $('#searchbar').autocomplete({
      source: function(request, response) {
        var results = $.ui.autocomplete.filter(data.specialties, request.term);
        response(results.slice(0, 10));
      },
      minlength: 0
    })
    .focus(function(){
        $(this).autocomplete("search");
    });
  });
}

// to reload page when country is changed
function reloadPage(){

  //TODO
  // reload the page with new country

}


// to display results when searched
function searchButtonClick(){

  var country = $('[name=country_select]').val();
  var city = $('[name=city_select] option:selected').text();
  var locality = $('[name=nearby_select]').val();
  var speciality = $('#searchbar').val();

  var params = {
    country: country,
    city: city,
    locality: locality,
    speciality: speciality
  };

  var url = '/search?' + $.param(params);

  window.location = url;

}

// to go to home when logo is clicked
function goToHome(){
  location.reload();
}
