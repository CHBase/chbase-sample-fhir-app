//Config that has to be changed
var client_id = '[ApplicationID]';
var redirect_uri = 'http://[FHIR Sample App Host Name]/HandleAuthCode.html';
var authorization_Server = 'https://[CHBase Shell Host Name]';
var clientSecret = '[AppSecret]';
var homeUrl = 'http://[FHIR Sample App Host Name]/home.html';
var fhirServiceUrl = 'https://[CHBase Platform Host Name]';



var token = localStorage.getItem('access_token');
var id_token = localStorage.getItem('id_token');
var state = 'wcXbzltHCTPcateZskyf-w';
var response_type = 'code';
var auth_end_point = localStorage.getItem('auth_end_point');
var token_end_point = localStorage.getItem('token_end_point');
var grant_type = 'authorization_code';
var authHeader='Basic ' + btoa(client_id + ':' + clientSecret);
var responseFromAccessTokenRequest =  localStorage.getItem('responseForAccessToken');
var openIDConfigPoint = '/.well-known/openid-configuration';

