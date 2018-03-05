var returnedObj = {};
var returnedObjName = '';

$(document).ready(function () {
    $('#pod').hide();

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

    $('#podBtn').on('click', function () {
        getAPI(baseUrls.APOD, 'APOD');
        if(returnedObjName === 'APOD') {
            $('#podImg').attr('src', returnedObj.url);
            $('#podDescription').text(returnedObj.explanation);
            $('#podTitle').text(returnedObj.title);
            $('#imgCredits').text(returnedObj.copyright);
            $('#pod').slideToggle();
        }
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

function getAPI(url, name) {
    var key = $('#apiKey').val();
    $.ajax({
        url: url + 'api_key=' + key,
        success: function (result) {
            console.log('result: ' + result);
            returnedObj = result;
            returnedObjName = name;
        },
        error: function () {
            alert('Failed!');
        }
    });
}

function setBackground() {
    getAPI(baseUrls.APOD, 'APOD');
    if(returnedObjName === 'APOD') {
        $('nav').css({'background-image': "url('" + returnedObj.url + "')"})
    }
}
