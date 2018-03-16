var apodPrevCalled = false;

$(document).ready(function () {
    $('#pod').hide();
    $('#promptUser').hide();
    $('#neo').hide();

    var input = $('nav').find('input');
    input.on('focus', function () {
        input.animate({'width': '300px'}, 500)
    });
    input.on('blur', function () {
        input.animate({'width': '138px'})
    });

    $('#changeBackground2').on('click', function () {
        $('nav').css({'background-image': "url('http://thewallpaper.co/wp-content/uploads/2016/03/nasa-wide-high-definition-wallpaper-for-desktop-background-download-nasa-photos-free-hd-cool-monitor-1920x1200-768x480.jpg')"})
    });

    $('#podBtn').on('click', function () {doPod(baseUrls.APOD);});

    $('#neoBtn').on('click', function () {
        $('#promptUser').fadeIn();
    });
    $('#close').on('click', function() {
        $('#promptUser').fadeOut()
    });



});

var baseUrls = {
    APOD: 'https://api.nasa.gov/planetary/apod?',
    NeoWs: 'https://api.nasa.gov/neo/rest/v1/feed?',
    'EPIC': '',
    'EONET': '',
    'Earth': '',
    'ImgVidLbrary': '',
    'marsRoverImg': ''
};

// function getAPI(url, name) {
//     var key = $('#apiKey').val();
//     $.ajax({
//         url: url + 'api_key=' + key,
//         success: function (result) {
//             console.log('result: ' + result);
//             returnedObj = result;
//             returnedObjName = name;
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
    if(starDate.length == 10 && endDate.length == 10) {
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
    $('#pod').slideUp();
    var html = '<h4>&nbsp;&nbsp;&nbsp;Near Earth Objects (a list of asteroids based on their closest approach date to earth)</h4>' +
        '<span id="hide">hide</span>';
    for(var i in obj.near_earth_objects) {
        var currentDay = obj.near_earth_objects[i];
        console.log(currentDay);
        html += '<div class="neoDay"><h4 class="date">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; date: '+ i +'</h4>';
        for(var l = 0; l < obj.near_earth_objects[i].length; l++) {
            var currentNeo = currentDay[l];
            html += '<div><p class="name">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ currentNeo.name +'</p>';
            html += '<div class="neoDescription" style="display: none"> This asteroid is will be '+ currentNeo.close_approach_data[0].miss_distance.kilometers +'km away from' +
                ' the earth on this date</div>';

            html += '</div>';
        }
        html += '</div>'
    }
    $('#neo').html(html).slideDown();

    $('#hide').on('click', function () {
        $('#neo').slideUp();
    });
    $('.name').on({
        click: function () {
            $(this).parent().toggleClass('whiteBackground').find('div').slideToggle();
        },
        mouseenter: function () {
            $(this).animate({backgroundColor: 'white'}, 100)
        },
        mouseleave: function () {
            $(this).animate({backgroundColor: 'inherit'}, 100)
        }
    });
}