

var practice_profile_url = '/sapphire-api/practices/' + practice_id;
$('document').ready(function(){
  specificSelect(1);
})

$.ajax({
  url: practice_profile_url,
  type: 'GET',
  dataType: 'JSON',
  data: {
    with_doctors: true
  }
})
.success(function(response){

  console.log(response);
  if(response.photos.length==0){
    $('.thumb_image').attr("src",'/images/practice_thumb.jpg');
  }
  else{
    $('.thumb_image').attr("src",response.photos[0].url);
    $.each(response.photos,function(index,photo){
        if(photo.logo){
          $('.thumb_image').attr("src",response.photos[index].url);
        }
    });
  }

  $('.basic_info1 h3').text(response.name);


  $('.info_address').append($('<p>',{
    text: response.street_address
  }));


  if(!response.hasOwnProperty('website')){
    $('.info_email').append($('<p>',{
      text: 'No website available'
    }));
  }
  else{
    $('.info_email').append($('<a>',{
      text: response.website,
      href: 'http://'+response.website,
      target: '_blank'
    }));
  }

  $('.info_summary').append($('<p>',{
    text: response.summary
  }));

  $('.info_summary p').shorten();

  if(response.hasOwnProperty('clinic_score')){
    $('.star-ratings-css-top').css(
      'width', (response.clinic_score.clinic_score * 2 * 10)+'%'
    );
  }
  else{
    $('.star-ratings-css').css(
      'display', 'none'
    );
    $('.star-not-rated').css(
      'display', 'block'
    );
  }
  for(var i=0;i< (20<response.facilities.length ? 20 : response.facilities.length);++i){
    //console.log(facility.facility.name);
    $('.facility_specific').append('<li>'+ response.facilities[i].facility.name +'</li>');
  }

  $('.specific2')
        .find('div')
        .remove()
        .end();


  for(var i=1;i<=7;++i){
    $('.specific2').append($('<div>',{
      class: 'days',
      id: 'day'+i
    }));
  }
  var days = ['monday','tuesday','wednesday','thursday','friday', 'saturday', 'sunday'];

  for(var i=1;i<=7;++i){
    $('#day'+i).append($('<h3>',{
      text: days[i-1]
    }));
    var ttable = $('<table>',{
      class: 'timings_table',
    });
    var ttable_row = $('<tr>');
    ttable_row.append($('<th>',{
      text: 'Start-Time'
    }));

    ttable_row.append($('<th>',{
      text: 'End-Time',
    }));

    ttable.append(ttable_row);
    $('#day'+i).append(ttable);
  }

  $.each(response.timings,function(key,day_value){

    var day_id = $.inArray(key,days)+1;
    for(var i=1;i<=2;++i){
      var day_row = $('<tr>');
      day_row.append($('<td>',{
        text: day_value['session'+i+'_start_time']
      }));
      day_row.append($('<td>',{
        text: day_value['session'+i+'_end_time']
      }));
      $('#day'+day_id+' table').append(day_row);
    }


  });

  if(response.hasOwnProperty('relations')){
    for(var i=0;i< (4 < response.relations.length ? 4 : response.relations.length);++i){

      var doc_div = $('<div>',{
                      class: 'doc_div'
                    });

      doc_div.append($('<img>',{
        src: response.relations[i].doctor.photos[response.relations[i].doctor.photos.length - 1].photo_url,
        class: 'doc_pic'
      }));

      var doc_div_info = $('<div>',{
                          class: 'doc_div_info'
                        });
      doc_div_info.append($('<p>',{
        text: response.relations[i].doctor.name
      }));

      doc_div.append(doc_div_info);
      $('.specific3').append(doc_div);
    }

  }

});



function specificSelect(tab_number){

  for(var i=1;i<=3;++i){
    $('#specific_select_'+i).css(
      'background-color','#fff',
      'opacity','0.85'
    );

    $('.specific'+i).hide();
  }

  $('#specific_select_'+tab_number).css(
    'background-color','#49b1d1'
  );
  $('.specific'+tab_number).show();

}

// to go to previous page
function goBack(){
  window.history.back();
}

// to go to home when logo is clicked
function goToHome(){
  window.location = '/';
}
