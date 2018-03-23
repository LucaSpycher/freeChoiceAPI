var apodPrevCalled = false;

$(document).ready(function () {
    $('#pod').hide();
    $('#promptUser').hide();
    $('#neo').hide();
    $('#containerEpic').hide();
    $('#containerEarth').hide();

    var input = $('nav').find('input');
    input.on('focus', function () {
        input.animate({'width': '300px'}, 500)
    });
    input.on('blur', function () {
        input.animate({'width': '138px'})
    });

    $('#changeBackground2').on('click', function () {
        $('nav').css({'background-image': "url(original_background.jpg)"})
    });

    $('#podBtn').on('click', function () {doPod(baseUrls.APOD);});

    $('#neoBtn').on('click', function () {
        $('#promptUser').fadeIn();
    });
    $('.close').on('click', function() {
        $(this).parent().fadeOut()
    });

    $('#epicBtn').on('click', function () {
        $('#containerEpic').fadeIn();
    });
    $('#earthBtn').on('click', function () {
        $('#containerEarth').fadeIn();
    })
});

var baseUrls = {
    APOD: 'https://api.nasa.gov/planetary/apod?',
    NeoWs: 'https://api.nasa.gov/neo/rest/v1/feed?',
    EPIC: 'https://api.nasa.gov/EPIC/api/natural/date/',
    'EONET': '',
    Earth: 'https://api.nasa.gov/planetary/earth/imagery/',
    'ImgVidLbrary': '',
    'marsRoverImg': ''
};

// function getAPI(url, name) {
//     var key = $('#apiKey').val();
//     $.ajax({
//         url: url + 'api_key=' + key,
//         success: function (result) {
//             console.log('result: ' + result);
//         },
//         error: function () {
//             alert('Failed!');
//         }
//     });
// }

function setBackground(url) {
    var key = $('#apiKey').val();
    $.ajax({
        url: url + 'api_key=' + key,
        success: function (result) {
            if(result.media_type === 'image') $('nav').css({'background-image': "url('" + result.url + "')"});
            else alert("Can't non-image media-type as background. Sorry :(");
        },
        error: function () {
            alert('Make sure to enter a working API key!');
        }
    });

}

function doPod(url) {
    var key = $('#apiKey').val();
    $.ajax({
        url: url + 'api_key=' + key,
        success: function (result) {
            if (!apodPrevCalled) {
                if (result.media_type == 'video') {
                    $('#podImg').hide();
                    $('#podVid').attr('src', result.url);
                    $('#podVidUrl').attr('href', result.url);
                } else {
                    $('#podVid').hide();
                    $('#podImg').attr('src', result.url);
                    $('#podImgUrl').attr('href', result.hdurl);
                }
                $('#podDescription').text(result.explanation);
                $('#podTitle').text(result.title);
                if (!result.hasOwnProperty('copyright')) {
                    $('#imgCredits').text('Public Domain');
                }
                else {
                    $('#imgCredits').text(result.copyright);
                }
                apodPrevCalled = true;
            }
            $('#pod').slideToggle();
        },
        error: function () {
            alert('Make sure to enter a working API key!');
        }
    });
}

function searchNeo() {
    var starDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    if(starDate.length === 10 && endDate.length === 10) {
        var url = baseUrls.NeoWs + 'start_date=' + starDate + '&' + 'end_date=' + endDate + '&';
        var key = $('#apiKey').val();
        $.ajax({
            url: url + 'api_key=' + key,
            success: function (result) {
                console.log(result);
                $('#promptUser').fadeOut();
                displayNeo(result);
            },
            error: function () {
                alert('Make sure you entered valid dates and a valid API key. The end date should be within 7 days of the start date');
            }
        });
    } else {
        alert('Invalid Date')
    }
}

function displayNeo(obj) {
    var html = '<h3>Near Earth Objects (a list of asteroids based on their closest approach date to earth)</h3>' +
        '<span class="hide">hide</span>';
    for(var i in obj.near_earth_objects) {
        var currentDay = obj.near_earth_objects[i];
        console.log(currentDay);
        html += '<table class="neoDay"><th class="date" colspan="100%">DATE: '+ i +'</th>';
        html += '<tr><td>Name</td><td>Distance from Earth (km)</td><td>Estimated Diameter Min (m)</td><td>Estimated Diameter Max (m)</td><td>Is Potentially Hazardous</td></tr>';
        for(var l = 0; l < obj.near_earth_objects[i].length; l++) {
            var currentNeo = currentDay[l];
            html += '<tr  class="name"><td>'+ currentNeo.name +'</td>';
            html += '<td class="neoDescription">' + currentNeo.close_approach_data[0].miss_distance.kilometers + '</td>';
            html += '<td>' + currentNeo.estimated_diameter.meters.estimated_diameter_min + '</td>';
            html += '<td>' + currentNeo.estimated_diameter.meters.estimated_diameter_max + '</td>';
            html += '<td>' + currentNeo.is_potentially_hazardous_asteroid.toString() + '</td>';
            html += '</tr>';
        }
        html += '</table>'
    }
    $('#neo').html(html).slideDown();

    $('.hide').on('click', function () {
        $(this).parent().slideUp();
    });
    $('.name').on('click', function () {
            $(this).toggleClass('whiteBackground');
    });
}

function searchEpic() {
    var date = $('#dateEpic').val();
    if(date.length === 10) {
        var url = baseUrls.EPIC + date + '?api_key=' + $('#apiKey').val();
        $.ajax({
            url: url,
            success: function (result) {
                console.log(result);
                displayEpic(result, date);
            },
            error: function () {
                alert('Make sure to enter a valid date and API key!');
            }
        });
    } else {
        alert('Invalid Date')
    }
}

function displayEpic(arr, date) {
    $('#containerEpic').fadeOut();
    if(arr.length === 0) {
        $('#epic').html('no results.').slideDown();
    } else {
        var imgUrls = [];
        var dateArr = date.split('-');
        var finalDate = dateArr[0] + '/' + dateArr[1] + '/' + dateArr[2] + '/';
        for (var i = 0; i < arr.length; i++) {
            imgUrls[i] = 'https://epic.gsfc.nasa.gov/archive/natural/' + finalDate + 'jpg/' + arr[i].image + '.jpg';
        }
        var html = "<h4>These images were taken by NASA's EPIC camera onboard the NOAA DSCOVR spacecraft</h4>";
        html += '<span class="hide">hide</span><div id="epicImgContainer">';
        for (var l = 0; l < imgUrls.length; l++) {
            html += '<a href="' + imgUrls[l] + '" target="_blank"><img src="' + imgUrls[l] + '" class="epicImg"></a>'
        }
        html += '</div>';
        $('#epic').html(html).slideDown();
    }
    $('.hide').on('click', function () {
        $(this).parent().slideUp();
    });
}

function searchEarth() {
    if($('#dateEarth').val().length === 10) {
        var date = '&date=' + $('#dateEarth').val();
    } else {
        var date = "";
    }
    var url = baseUrls.Earth + '?lon=' +  $('#lonEarth').val() + '&' + 'lat=' + $('#latEarth').val() + date + '&cloud_score=True&api_key=' + $('#apiKey').val();
    console.log(url);
    $.ajax({
        url: url,
        success: function (result) {
            console.log(result);
            displayEarth(result);
        },
        error: function () {
            alert('Make sure to enter a valid longitude and latitude and API key!');
        }
    });
}

function displayEarth() {
    $('#containerEarth').fadeOut();
}