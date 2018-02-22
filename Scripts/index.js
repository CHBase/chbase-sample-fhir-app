var scope = "";
$(document).ready(function () {
    $("#authorize").click(function () {
        var scopes = [];
        $.each($("input[name='scopes']:checked"), function () {
            scopes.push($(this).val());
        });
        scopes.push($("input[name='scope']").val());
        scope = scopes.join(" ");
        redirect();
    });

    $("#capabilityStatement").click(function(){
        toCapabilityStatement();
    });
});

function redirect() {
    console.log(auth_end_point);
    var url =  auth_end_point + '?client_id=' +
        client_id + '&redirect_uri=' + redirect_uri + '&state=' +
        state + '&response_type=' + response_type +
        '&aud=' + fhirServiceUrl + '/&scope=' + scope;
    $(location).attr('href', url);
}
function toCapabilityStatement()
{
    window.location.href = 'CapabilityStatement.html';
}
function getCapabilityStatement()
{
    var headers = new Headers();
    headers.append("Accept", "application/json");
    var init = {
        method: 'GET',
        mode: 'cors',
        dataType: 'json',
        headers : headers
    };
    var request = new Request(fhirServiceUrl + '/api/fhir/metadata', init);
    fetch(request).then(function (response) {
        if (!response.ok) {
            document.getElementById("authorize").disabled = true;
            errorDispalying("Error in Capability Statement Fetch", JSON.stringify(error));
        }
        else {
            return response.json().then(function (result) {
                console.log(result);
                var rest = result.rest[0];
                var security = rest.security;
                var extensions = security.extension;
                var i = null;
                for (i = 0; extensions.length > i; i += 1) {
                    if (extensions[i].url == "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris") {
                        var oauthextensions = extensions[i].extension;
                        var j = null;
                        for (j = 0; oauthextensions.length > j; j += 1) {
                            if (oauthextensions[j].url == "authorize") {
                                console.log(oauthextensions[j].valueUri);

                                localStorage.setItem('auth_end_point', oauthextensions[j].valueUri);
                            }
                            if (oauthextensions[j].url == "token") {
                                console.log(oauthextensions[j].valueUri);
                                localStorage.setItem('token_end_point', oauthextensions[j].valueUri);
                            }
                        }

                    }
                }


            })
        }
    }).catch(function (error) {
        document.getElementById("authorize").disabled = true;
        errorDispalying("Error in Capability Statement", error);
    });
}