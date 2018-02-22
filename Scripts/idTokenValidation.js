var jwk_keys;
function PopulateJWKandOpenIdConfig() {

    var init = {
        method: 'GET',
        mode: 'cors',
        dataType: 'json'
    };
    var request = new Request(authorization_Server + openIDConfigPoint, init);
    fetch(request).then(function (response) {
        if (!response.ok) {
            return response.json().then(function (error) {
                errorDispalying("Error in OpenID Config Fetch", JSON.stringify(error));
            })
        }
        else {
            return response.json().then(function (result) {
                console.log(result);
                document.getElementById("openIDText").innerHTML = display(result);
                var jwkuri = result['jwks_uri'];
                getJwks(jwkuri);
            })
        }
    }).catch(function (error) {
        errorDispalying("Error in OpenIDConfig and Jwk", error);
    });
}
function getJwks(jwkuri) {
    fetch(jwkuri)
        .then((resp) => resp.json())
        .then(function (jwk) {
            document.getElementById("jwksText").innerHTML = display(jwk);
            jwk_keys = jwk['keys'];
            document.getElementById("ValidationResult").hidden = false;
        }).catch(function (error) {
            errorDispalying("Error in Jwk", error);
        });
}
$(document).ready(function () {
    $("#validate").click(function () {
        validateIDToken();
    });
});

function validateIDToken() {
    console.log(jwk_keys);
    jwk_keys.forEach(function (key) {
        var pubkey = KEYUTIL.getKey(key);
        console.log("key =", pubkey);
        console.log("id token =", id_token);
        var isValid = KJUR.jws.JWS.verify(id_token, pubkey, ["RS256"]);
        console.log("is valid = " + isValid);
        if (isValid) {
            document.getElementById("validImage").hidden = false;
            document.getElementById("validImage").src = "Assets/valid.jpg";

        }
    })
    if (document.getElementById("validImage").hidden) {
        document.getElementById("validImage").hidden = false;
        document.getElementById("validImage").src = "Assets/invalid.png";
    }

}
function display(json) {
    var html = '<pre lang="json">';
    html = html + JSON.stringify(json, null, ' ');
    html = html + '</pre>';
    return html;
}