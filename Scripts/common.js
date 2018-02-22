function errorDispalying(errorHeading, errorContent) {
    console.log("error : " + errorContent);
    document.getElementById("error").hidden = false;
    document.getElementById("ErrorHeading").textContent = errorHeading;
    document.getElementById("ErrorContent").textContent = errorContent;
}

function getQueryStrings() {
    var params = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for (var i in keyValues) {
        var key = keyValues[i].split('=');
        if (key.length > 1) {
            params[decode(key[0])] = decode(key[1]);
        }
    }

    return params;
}

$(document).ready(function () {
    $("#Back").click(function(){
        toIndex();
    });
});
function toIndex()
{
    window.location.href = 'index.html';
}