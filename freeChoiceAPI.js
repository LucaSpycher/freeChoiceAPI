var apodPrevCalled = false;

$(document).ready(function () {
    $('#pod').hide();
    $('#promptUser').hide();

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
            alert('Failed!');
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
                    $('#podImgUrl').attr('href', result.url);
                }
                $('#podDescription').text(result.explanation);
                $('#podTitle').text(result.title);
                $('#imgCredits').text(result.copyright);
                apodPrevCalled = true;
            }
            $('#pod').slideToggle();
        },
        error: function () {
            alert('Failed!');
        }
    });
}

function doNeo(url) {
    var key = $('#apiKey').val();
    $.ajax({
        url: url + 'api_key=' + key,
        success: function (result) {

        },
        error: function () {
            alert('Failed!');
        }
    });
}