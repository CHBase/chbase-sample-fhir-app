function submitAuthCode() {
    var queryString = getQueryStrings();
    if ('error' in queryString) {
        var error = queryString["error"];
        errorDispalying("Error Before AuthCode Generation", error);
    }
    if ('code' in queryString) {
        var authCode = queryString["code"];
        document.getElementById("authCodeDiv").hidden = false;
        document.getElementById("authCodeText").textContent = authCode;
        var data = "grant_type=" + grant_type +
            "&code=" + authCode +
            "&redirect_uri=" + redirect_uri;
        var init = {
            method: 'POST',
            headers: {
                'Authorization': authHeader
            },
            mode: 'cors',
            dataType: 'json',
            body: data
        };
        var request = new Request(token_end_point, init);
        fetch(request).then(function (response) {
            if (!response.ok) {
                return response.json().then(function (error) {
                    errorDispalying("Error in Token Fetch", JSON.stringify(error));
                })
            }
            else {
                return response.json().then(function (result) {
                    console.log(result);
                    localStorage.setItem('access_token', result['access_token']);
                    if ('id_token' in result) {
                        localStorage.setItem('id_token', result['id_token']);
                    }
                    localStorage.setItem('responseForAccessToken',JSON.stringify(result,null,' '));
                    redirectToTokenPage();
                })
            }
        }).catch(function (error) {
            errorDispalying("Error in AuthCode Submission", error);
        });
    }
}
function redirectToTokenPage() {
    var url = "TokenResponse.html";
    $(location).attr('href', url);
}


