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

    $('#podBtn').on('click', function () {


        $('#pod').slideDown();
    });
});

var baseUrls = {
    APOD: 'https://api.nasa.gov/planetary/apod',
    NeoWs: 'https://api.nasa.gov/neo/rest/v1',
    'EPIC': '',
    'EONET': '',
    'Earth': '',
    'ImgVidLbrary': '',
    'marsRoverImg': ''
};

function getAPI(url) {
    var key = $('#apiKey').val();
    $.ajax({
        url: url + '?api_key=' + key,
        success: function (result) {
            console.log('result: ' + result);
            returnedObj = result;
            //return result;
        },
        error: function () {
            alert('Failed!');
        }
    });
}

function setBackground() {
    getAPI(baseUrls.APOD);
    if(!$.isEmptyObject(returnedObj)) {
        $('nav').css({'background-image': "url('" + returnedObj.hdurl + "')"})
    }
}
