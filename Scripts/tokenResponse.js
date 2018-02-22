function populateResponse()
{
    var html = '<pre lang="json">';
    html = html + responseFromAccessTokenRequest;
    html = html + '</pre>';
    console.log(responseFromAccessTokenRequest);
    document.getElementById("accessTokenResponseText").innerHTML= html;
    var jsonResponse = JSON.parse(responseFromAccessTokenRequest);
    addTokenDecodeTo("accessTokenText",token);
    if('id_token' in jsonResponse)
    {
        document.getElementById("validateIDToken").disabled = false;
        addTokenDecodeTo("iDTokenText",id_token);
    }
    else
    {
        document.getElementById("validateIDToken").disabled = true;
        document.getElementById("iDTokenText").textContent = "No Id Token in the Response";
    }
    
}
function addTokenDecodeTo(elementID,token)
{
    var token_parts = token.split(".");
    var token_html =  '<pre lang="json">';
    token_html = token_html + JSON.stringify(JSON.parse(atob(token_parts[0])),null,' ');
    token_html = token_html + '</pre>';
    token_html = token_html + '.';
    token_html = token_html +'<pre lang="json">';
    token_html = token_html + JSON.stringify(JSON.parse(atob(token_parts[1])),null,' ');
    token_html = token_html + '</pre>';
    token_html = token_html + '.<br />';
    token_html = token_html + token_parts[2];
    console.log(token_html);
    document.getElementById(elementID).innerHTML= token_html;
}
$(document).ready(function () {
    $("#validateIDToken").click(function () {
        toValidationOfIDToken();
    });
    $("#done").click(function () {
        toHomePage();
    });
});

function toHomePage()
{
    window.location.href = 'Home.html';
}
function toValidationOfIDToken(){
  window.location.href = 'IDTokenValidation.html';
}
