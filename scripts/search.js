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

  $('#searchbar').keypress(function(e){
      if(e.keyCode==13){
        searchButtonClick();
      }
  });

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

    var sub_locality = [];

    $('[name=nearby_select]')
            .find('option')
            .remove()
            .end()
            .append('<option label="default" value="" disabled selected>Select Nearby Area</option>')

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
      }
    });
  });
}

function reloadPage(){

  //TODO
  // reload the page with new country

}


// to display results when searched
function searchButtonClick(){

  $('#header').css({
    'height':'50px'
  });
  $('#header h1').css('float','left');
  $('.search_bar').css({
      "margin-top": "0px",
      "margin-bottom": "0px"
  });
  $('#search_content').css({
    "width": "100%",
    "heigh": "100%"
  });

  $('#search_content').empty();

// All this code is to be used when api works
/*
  var citiName = $("[name=city_select] option:selected").text().toLowerCase();

  var localityName = null;
  if($("[name=nearby_select]").val() != null)
    localityName = $("[name=nearby_select]").val().toLowerCase();

  var speciality = $("#searchbar").val().toLowerCase();

  var url = base_url + "search/";


  $.ajax({

    type: "GET",
    dataType: "JSON",
    url: url,
    data: {
      city: citiName,
      locality: localityName,
      searchfor: "specialization",
      speciality: speciality,
      q: speciality,
      offset: 10
    //  near: null
    },
    headers: {
      "X-CLIENT-ID":X_CLIENT_ID,
      "X-API-KEY":X_API_KEY
    }
  })
  .success(function(data){

     $.each(data.doctors,function(index,value){

      var new_div = $('<div>',{
        class: "cards",
        value: value.practice_id
      });

      new_div.append($('img',{
        class: "practice_profile",
        src: value.practice_photos.url
      }));

      new_div.append($('label',{
        for: "practice_name",
        text: value.practice_name
      }));

      new_div.append($('label',{
        for: "practice_address",
        text: value.practice_addres

      }));

      new_div.appendTo('#search_content');
      //$('#search_content').append(new_div);

//    });

  });
*/

// dummy results code
  var totalCount = 50;
  var currentOffset = 0;
  var itemPerPage = 10;
  var img_url = "./images/practice_thumb.jpg";
  var practiceName = "Practice";
  var practiceAddress = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  var charges = "Rs abc";
  var practiceDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\
                            Duis aute irure dolor in reprehenderit in voluptate velit esse \
                            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \
                            sunt in culpa qui officia deserunt mollit anim id est laborum.";

  for(var i=1; i<=totalCount; ++i){

    var new_div = $('<div>',{
      class: "cards",
      value: i,
      id: "card"+i
    });

    new_div.appendTo('#search_content');
    //$('#search_content').append(new_div);

    new_div.append($('<img>',{
      class: "practice_thumb",
      src: img_url
    }));

    new_div.append($('<div>',{
      class: "pbasic_details",
      id: "card" + i + "_div1"
    }));

    new_div.append($('<div>',{
      class: "pother_details",
      id:  "card"+ i + "_div2"
    }));

    $('#card'+i + "_div1").append($('<p>',{
      for: "practice_name",
      text: practiceName
    }));

    $('#card'+i+"_div1").append($('<p>',{
      for: "practice_address",
      text: practiceAddress

    }));

    $('#card'+i+"_div2").append($('<p>',{

      for: "practice_charge",
      text: charges

    }));

    $('#card'+i+"_div2").append($('<p>',{

      for: "pracice_description",
      text: practiceDescription

    }));

  }

// for pagination
  $('#pagination_list').pagination({
      items: totalCount/itemPerPage,
      itemsonPage: itemPerPage,
      cssStyle: 'light-theme',
      onPageClick: function(pageNumber) {
        var initNumber = (pageNumber - 1)*itemPerPage;
        $('.cards').hide();
        for(var i = initNumber + 1; i <= initNumber+itemPerPage; ++i){
          $('#card'+ i).show();
        }
      },
      onInit: function(){
        $('.cards').hide();
        for(var i = 1;i<=itemPerPage;++i){
          $('#card'+ i).show();
        }
      }
  });


}
