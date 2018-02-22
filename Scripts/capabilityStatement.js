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
            return response.json().then(function (error) {
                errorDispalying("Error in Capability Statement Fetch", JSON.stringify(error));
            })
        }
        else {
            return response.json().then(function (result) {
                console.log(result);
                document.getElementById("capabilityDiv").hidden = false;
                var html = '<pre lang="json">';
                html = html + JSON.stringify(result,null, ' ');
                html = html + '</pre>';
                document.getElementById("capabilityStatementText").innerHTML= html;
            })
        }
    }).catch(function (error) {
        errorDispalying("Error in Capability Statement", error);
    });


}
function errorDispalying(errorHeading, errorContent) {
    console.log("error : " + errorContent);
    document.getElementById("error").hidden = false;
    document.getElementById("ErrorHeading").textContent = errorHeading;
    document.getElementById("ErrorContent").textContent = errorContent;
}