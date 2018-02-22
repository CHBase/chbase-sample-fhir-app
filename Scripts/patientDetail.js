function getPatientDetail() {
    var queryString = getQueryStrings();
    if ('patient_id' in queryString) {
        var patientID = queryString["patient_id"];
        var headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Authorization", "Bearer " + token);
        var init = {
            method: 'GET',
            mode: 'cors',
            dataType: 'json',
            headers: headers
        };
        var query = getNewQueryString();
        var request = new Request(fhirServiceUrl + '/api/fhir/patient/' + patientID + query, init);
        fetch(request).then(function (response) {
            if (!response.ok) {
                return response.json().then(function (error) {
                    errorDispalying("Error in Patient Detail Fetch Response", JSON.stringify(error));
                })
            }
            else {
                return response.json().then(function (result) {
                    console.log(result);
                    populatePatientDetailTable(result);
                    var html = '<pre lang="json">';
                    html = html + JSON.stringify(result, null, ' ');
                    html = html + '</pre>';
                    document.getElementById("PatientText").innerHTML = html;
                })
            }
        }).catch(function (error) {
            errorDispalying("Error in Patient Detail Fetch", error);
        });
    }
}
$(document).ready(function () {
    $("#get").click(function () {
        getPatientDetail();
    });
    $("#observation").click(function () {
        toObservationPage();
    });
});
function toObservationPage()
{
    window.location.href = 'Observation.html?'+location.search.substring(1);
}
function populatePatientDetailTable(patient) {
    var div = document.getElementById("patientDetailTableDiv");
    div.innerHTML = "";
    if (patient.name != undefined) {
        div.appendChild(createTableWithjson(patient.name, "Names"));
    }
    if (patient.address != undefined) {
        var json = patient.address;
        json.forEach(function (element) {
            delete element.extension; 
        });
        div.appendChild(createTableWithjson(json , "Addresses"));
    }
    if (patient.contact != undefined) {
        var contacts = patient.contact;
        var jsontext = '[';
        contacts.forEach(function (contact) {
            var telecom = "";
            if (contact.telecom != undefined) {
                contact.telecom.forEach(function (telecomObject) {
                    telecom = telecom + telecomObject.system + "=" + telecomObject.value + " ";
                });
            }
            jsontext = jsontext + '{"Name":"' + contact.name.given[0] + '",' +
                '"Country":"' + contact.address.country + '",' +
                '"District":"' + contact.address.district + '",' +
                '"Line":"' + contact.address.line[0] + '",' +
                '"PostalCode":"' + contact.address.postalCode + '",' +
                '"State":"' + contact.address.state + '",' +
                '"Telecom":"' + telecom + '"}';
        });
        jsontext = jsontext + ']';

        var json = JSON.parse(jsontext);
        div.appendChild(createTableWithjson(json, "Contacts"));
    }

    if (patient.birthDate != undefined) {
        var jsontext = '[{ "Birth Date":"' + patient.birthDate + '"}]';
        var json = JSON.parse(jsontext);
        div.appendChild(createTableWithjson(json, "BirthDate"));
    }
    if (patient.gender != undefined) {
        var jsontext = '[{ "Gender":"' + patient.gender + '"}]';
        var json = JSON.parse(jsontext);
        div.appendChild(createTableWithjson(json, "Gender"));
    }
    if (patient.telecom != undefined) {
        var json = patient.telecom;
        json.forEach(function (element) {
            delete element.extension; 
        });
        div.appendChild(createTableWithjson(json, "Telecoms"));
    }
    if (patient.photo != undefined) {
        var x = document.createElement("IMG");
        x.setAttribute("src", "data:image/png;base64," + patient.photo[0].data);
        x.setAttribute("width", "100");
        x.setAttribute("height", "100");
        div.appendChild(x);
    }
    else {
        var x = document.createElement("IMG");
        x.setAttribute("src", "Assets/noimage.png");
        x.setAttribute("width", "100");
        x.setAttribute("height", "100");
        div.appendChild(x);
    }
}
function createTableWithjson(json, tableHeading) {
    var col = [];
    for (var i = 0; i < json.length; i++) {
        for (var key in json[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    var caption = document.createElement("caption");
    caption.textContent = tableHeading;
    table.appendChild(caption);

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < json.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json[i][col[j]];
        }
    }
    return table;
}
function getNewQueryString() {
    var queryStrings = [];
    var queryString = "?"
    var includes = [];
    $.each($("input[name='include']:checked"), function () {
        includes.push($(this).val());
    });
    includes.forEach(function (include) {
        queryStrings.push("_include=" + include);
    });
    queryString = queryString + queryStrings.join("&");
    return queryString;
}
$(document).ready(function () {
    $("#showResponse").click(function () {
        toShowOrCloseResponse();
    });

});
function toShowOrCloseResponse() {
    if (document.getElementById("showResponse").textContent == "Show Response") {
        document.getElementById("PatientDiv").hidden = false;
        document.getElementById("showResponse").textContent = "Close Response"
    }
    else {
        document.getElementById("PatientDiv").hidden = true;
        document.getElementById("showResponse").textContent = "Show Response"
    }
}

