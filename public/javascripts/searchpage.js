/*
This is jquery script for search result page
*/


var base_url = "https://api.practo.com/";
var X_CLIENT_ID = "cb361f8c-cbf3-4ea9-ac2f-76c619a59a82";
var X_API_KEY = "LXrzokVA14koHb+WKv/4BdRDIpU=";
var citi_url = base_url + "meta/search/cities";
var user_country;
var country_list = [];
var citi_list = [];
var practice_list = [];

// call to get all the cities supported
$.ajax({
    type: 'GET',
    url: citi_url,
    dataType: "json",
    headers: {
      "X-CLIENT-ID":X_CLIENT_ID,
      "X-API-KEY":X_API_KEY
    }
 })
 .success(function(citi_response){

  user_country = params.param_country;

  $.each(citi_response.cities,function(index,city){

    var citi_detail = city;
    country_list.push(citi_detail.state.country.name);

    if(citi_detail.state.country.name==user_country){
      if(citi_detail.name == params.param_city){
        $('[name=city_select]').append($('<option>',{
            value: citi_detail.id,
            text: citi_detail.name,
            selected: true
        }));
      }
      else{
        $('[name=city_select]').append($('<option>',{
            value: citi_detail.id,
            text: citi_detail.name,
        }));
      }
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

  fillNearbyArea();

});

$('#searchbar').keypress(function(e){
    if(e.keyCode==13){
      searchButtonClick(0,true);
    }
});


// it fills the localities options and also enable autocomplete feature
function fillNearbyArea(){

  var city_id = $('[name=city_select]').val();
  var locality_url = base_url + "meta/search/cities/" + city_id;

// to get localities for a given city and specialization in that locality.
  $.ajax({
    type: 'GET',
    url: locality_url,
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

    $.each(data.localities,function(index,locality){
      sub_locality.push(locality);
    });

    $.uniqueSort(sub_locality);
    $.each(sub_locality,function(index,locality) {
      if(locality == params.param_locality){
        $('[name=nearby_select]').append($('<option>',{
            value: locality,
            text: locality,
            selected: true
          }));
      }
      else{
        $('[name=nearby_select]').append($('<option>',{
            value: locality,
            text: locality
          }));
      }
    });

    $('#searchbar').val(params.param_speciality);

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

  searchButtonClick(0,true);
}

// to reload page when country is changed
function reloadPage(){

  //TODO
  // reload the page with new country

}

// to display results when searched
function searchButtonClick(pagenumber,isFirstCall){


  $('#search_content').empty();

  var citiName = $("[name=city_select] option:selected").text().toLowerCase();
  var localityName = null;
  if($("[name=nearby_select]").val() != null){
    localityName = $("[name=nearby_select]").val().toLowerCase();
  }
  var speciality = $("#searchbar").val().toLowerCase();
  var search_url = "/sapphire-api/" + "search/";
  var totalCount;
  var itemPerPage = 10;


// call to search based on query
  $.ajax({

    type: "GET",
    dataType: "JSON",
    url: search_url,
    data: {
      city: citiName,
      locality: localityName,
      searchfor: "specialization",
      speciality: speciality,
      offset: pagenumber
    }
  })
  .success(function(data){
  //  console.log(data);
    totalCount = data.doctorsFound;
  //  console.log(totalCount);
    if(isFirstCall==true){
      paginate(totalCount,itemPerPage);
    }
    $.each(data.doctors,function(index,value){

       var practice_id= value.practice_id;
       if($.inArray(practice_id,practice_list)>=0){
         return;
       }
       else{
         practice_list.push(practice_id);
       }
    //   console.log(practice_id);
       var practice_url = "/sapphire-api/" + "practices/" + practice_id;
       
// to get practice info from the id obtained in previous query.
       $.ajax({
         type: "GET",
         dataType: "JSON",
         url: practice_url
       })
       .success(function(practice_data){
        //  console.log(practice_data);
            var new_div = $('<div>',{
               class: "cards",
               value: index,
               id: "card"+index
             });

             new_div.on('click',function(){
               $.redirect('/'+encodeURIComponent(practice_data.name),
                     { 'practiceID': practice_data.id, 'practiceName': practice_data.name }
                   );
             });
             new_div.appendTo('#search_content');
             //$('#search_content').append(new_div);

             var img_url = "./images/practice_thumb.jpg";
             if(practice_data.photos.length != 0){
                img_url = practice_data.photos[0].url;
             }

             new_div.append($('<img>',{
               class: "practice_thumb",
               src: img_url
             }));

             new_div.append($('<div>',{
               class: "pbasic_details",
               id: "card" + index + "_div1"
             }));

             new_div.append($('<div>',{
               class: "pother_details",
               id:  "card"+ index + "_div2"
             }));

             $('#card'+index+ "_div1").append($('<p>',{
               for: "practice_name",
               text: practice_data.name
             }));

             $('#card'+index+"_div1").append($('<p>',{
               for: "practice_address",
               text: practice_data.street_address
             }));

             if(practice_data.facilities_count!=0){
                   $('#card'+index+"_div2").append($('<p>',{

                     for: "practice_rating",
                     text: practice_data.facilities[0].facility.name

                   }));
             }
             else{
               $('#card'+index+"_div2").append($('<p>',{

                 for: "practice_rating",
                 text: "No facilities"

               }));
             }

             $('#card'+index+"_div2").append($('<p>',{

               for: "pracice_description",
               text: practice_data.website

             }));
        });
    });
  });
}

// for pagination
function paginate(totalCount,itemPerPage){
      $('#pagination_list').pagination({
          items: totalCount/itemPerPage-1,
          itemsonPage: itemPerPage,
          cssStyle: 'light-theme',
          displayedPages: 3,
          edges: 2,
          onPageClick: function(pageNumber) {
            console.log(pageNumber*10);
            searchButtonClick(pageNumber*10,false);
          }
        });
}

// to call practice profile page
function loadProfile(practiceID,practiceName){

    $.redirect('/'+encodeURIComponent(practiceName),
          { 'practiceID': practiceID, 'practiceName': practiceName }
        );
}

// to go to home when logo is clicked
function goToHome(){
  window.location = '/';
}
