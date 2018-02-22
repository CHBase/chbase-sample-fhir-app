function getObservation() {
    eraseSearch();
    var queryString = getQueryStrings();
    if ('patient_id' in queryString) {
        var patientID = queryString["patient_id"];
        var init = {
            method: 'GET',
            mode: 'cors',
            dataType: 'json',
            headers: {
                "RecordID": patientID,
                "Accept": "application/json",
                "Authorization": "Bearer " + token
            }
        };
        var request = new Request(fhirServiceUrl + '/api/fhir/Observation', init);
        fetch(request).then(function (response) {
            if (!response.ok) {
                return response.json().then(function (error) {
                    errorDispalying("Error in Observation Fetch Response", JSON.stringify(error));
                })
            }
            else {
                return response.json().then(function (result) {
                    console.log(result);
                    var error = document.getElementById("error");
                    if (error.hidden == false) {
                        error.hidden = true;
                    }
                    populateObservationToTable(result);
                    var html = '<pre lang="json">';
                    html = html + JSON.stringify(result, null, ' ');
                    html = html + '</pre>';
                    document.getElementById("ObservationText").innerHTML = html;
                })
            }
        }).catch(function (error) {
            errorDispalying("Error in Observation Fetch", error);
        });
    }

}

function populateObservationToTable(Observations) {
    if (Observations.total == 0) {
        var div = document.getElementById("ObservationTableDiv");
        div.innerHTML = "No Observations";
    }
    else {
        var jsonStrings = [];
        Observations.entry.forEach(function (Observation) {
            var display = "undefined";
            var value = "undefined";
            if ("resource" in Observation) {
                var resource = Observation.resource;
                if ("code" in resource) {
                    if ("coding" in resource.code) {
                        if ("display" in resource.code.coding[0]) {
                            display = resource.code.coding[0].display;
                        }
                    }
                }
                if ("valueQuantity" in resource) {
                    value = resource.valueQuantity.value + resource.valueQuantity.unit;
                }
            }
            jsonStrings.push('{"display":"' + display + '",' +
                '"value":"' + value + '",' +
                '"effectiveDateTime":"' + Observation.resource.effectiveDateTime + '",' +
                '"issued":"' + Observation.resource.issued + '",' +
                '"id":"' + Observation.resource.id + '"}');
        });

        var jsonString = '[' + jsonStrings.join(",") + ']';
        var json = JSON.parse(jsonString);
        var div = document.getElementById("ObservationTableDiv");
        div.innerHTML = "";
        div.appendChild(createTableWithjson(json, "Observations - "+Observations.total));
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
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = '<button onclick="deleteObservation(this.id)" id="' + json[i].id + '">Delete</button>';
    }
    return table;
}
function deleteObservation(id) {
    var queryString = getQueryStrings();
    if ('patient_id' in queryString) {
        var patientID = queryString["patient_id"];
        var init = {
            method: 'DELETE',
            mode: 'cors',
            dataType: 'json',
            headers: {
                "RecordID": patientID,
                "Accept": "application/json",
                "Authorization": "Bearer " + token
            }
        };
        var request = new Request(fhirServiceUrl + '/api/fhir/Observation/' + id, init);
        fetch(request).then(function (response) {
            if (!(response.ok || response.status == 204)) {
                return response.json().then(function (error) {
                    errorDispalying("Error in Observation Delete Response", JSON.stringify(error));
                })
            }
            else {
                console.log(response);
                alert("Deletion Successful");
                getObservation();
            }
        }).catch(function (error) {
            errorDispalying("Error in Observation Delete", error);
        });
    }
}
$(document).ready(function () {
    $("#showResponse").click(function () {
        toShowOrCloseResponse();
    });

});
function toShowOrCloseResponse() {
    if (document.getElementById("showResponse").textContent == "Show Response") {
        document.getElementById("ObservationDiv").hidden = false;
        document.getElementById("showResponse").textContent = "Close Response"
    }
    else {
        document.getElementById("ObservationDiv").hidden = true;
        document.getElementById("showResponse").textContent = "Show Response"
    }
}
$(document).ready(function () {
    $("#addHeight").click(function () {
        addHeight();
    });
    $("#addWeight").click(function () {
        addWeight();
    });
    $("#Search").click(function () {
        getObservationSearch();
    });
});

function addHeight() {
    var queryString = getQueryStrings();
    if ('patient_id' in queryString) {
        var patientID = queryString["patient_id"];
        var dateCreated = new Date();
        dateCreated.setDate(getRandomInt(1, 28));
        var heightData = {
            "resourceType": "Observation",
            "status": "final",
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://hl7.org/fhir/observation-category",
                            "code": "vital-signs",
                            "display": "Vital Signs"
                        }
                    ],
                    "text": "Vital Signs"
                }
            ],
            "code": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "8302-2",
                        "display": "Body height"
                    }
                ],
                "text": "height"
            },
            "effectiveDateTime": dateCreated.toJSON().slice(0, 10),
            "valueQuantity": {
                "value": getRandomInt(150, 187),
                "unit": "cm",
                "system": "http://unitsofmeasure.org",
                "code": "cm"
            }
        };
        var init = {
            method: 'POST',
            mode: 'cors',
            dataType: 'json',
            headers: {
                "RecordID": patientID,
                "Accept": "application/json",
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(heightData)
        };
        var request = new Request(fhirServiceUrl + '/api/fhir/Observation', init);
        fetch(request).then(function (response) {
            if (!response.ok) {
                return response.json().then(function (error) {
                    errorDispalying("Error in Height Post Response", JSON.stringify(error));
                })
            }
            else {
                return response.json().then(function (result) {
                    console.log(result);
                    alert("Creation Successful");
                    getObservation();
                })
            }
        }).catch(function (error) {
            errorDispalying("Error in Height Post Fetch", error);
        });
    }
}

function addWeight() {
    var queryString = getQueryStrings();
    if ('patient_id' in queryString) {
        var patientID = queryString["patient_id"];
        var dateCreated = new Date();
        dateCreated.setDate(getRandomInt(1, 28));
        var weightData = {
            "resourceType": "Observation",
            "status": "final",
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://hl7.org/fhir/observation-category",
                            "code": "vital-signs",
                            "display": "Vital Signs"
                        }
                    ],
                    "text": "Vital Signs"
                }
            ],
            "code": {
                "coding": [
                    {
                        "system": "http://healthvault.com/fhir/stu3/ValueSet/wc/vital-statistics",
                        "code": "wgt",
                        "display": "Body Weight"
                    }
                ],
                "text": "height"
            },
            "effectiveDateTime": dateCreated.toJSON().slice(0, 10),
            "valueQuantity": {
                "value": getRandomInt(50, 100),
                "unit": "kg",
                "system": "http://unitsofmeasure.org",
                "code": "kg"
            }
        };
        var init = {
            method: 'POST',
            mode: 'cors',
            dataType: 'json',
            headers: {
                "RecordID": patientID,
                "Accept": "application/json",
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(weightData)
        };
        var request = new Request(fhirServiceUrl + '/api/fhir/Observation', init);
        fetch(request).then(function (response) {
            if (!response.ok) {
                return response.json().then(function (error) {
                    errorDispalying("Error in Weight Post Response", JSON.stringify(error));
                })
            }
            else {
                return response.json().then(function (result) {
                    console.log(result);
                    alert("Creation Successful");
                    getObservation();
                })
            }
        }).catch(function (error) {
            errorDispalying("Error in Weight Post Fetch", error);
        });
    }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
function eraseSearch()
{
    document.getElementById("DateSearch").value="";
    document.getElementById("LastUpdatedSearch").value="";
    document.getElementById("CodeSearch").value="";
}

function getObservationSearch() {
    var queryString = getQueryStrings();
    if ('patient_id' in queryString) {
        var patientID = queryString["patient_id"];
        var date = "";
        var lastUpdated = "";
        var code = "";
        if( document.getElementById("DateSearch").value != null)
        {
            date = document.getElementById("DateSearch").value;
        }
        if( document.getElementById("LastUpdatedSearch").value != null)
        {
            lastUpdated = document.getElementById("LastUpdatedSearch").value;
        }
        if( document.getElementById("CodeSearch").value != null)
        {
            code = document.getElementById("CodeSearch").value;
        }
        
        var init = {
            method: 'GET',
            mode: 'cors',
            dataType: 'json',
            headers: {
                "RecordID": patientID,
                "Accept": "application/json",
                "Authorization": "Bearer " + token
            }
        };
        var request = new Request(fhirServiceUrl + 
            '/api/fhir/Observation?date='+date
            +'&_lastupdated='+lastUpdated
            +'&code='+code, init);
        fetch(request).then(function (response) {
            if (!response.ok) {
                return response.json().then(function (error) {
                    errorDispalying("Error in Observation Fetch Response", JSON.stringify(error));
                })
            }
            else {
                return response.json().then(function (result) {
                    console.log(result);
                    var error = document.getElementById("error");
                    if (error.hidden == false) {
                        error.hidden = true;
                    }
                    populateObservationToTable(result);
                    var html = '<pre lang="json">';
                    html = html + JSON.stringify(result, null, ' ');
                    html = html + '</pre>';
                    document.getElementById("ObservationText").innerHTML = html;
                })
            }
        }).catch(function (error) {
            errorDispalying("Error in Observation Fetch", error);
        });
    }

}
$(document).ready(function () {
    $("#Info").click(function () {
        toShowOrCloseInfo();
    });

});
function toShowOrCloseInfo() {
    if (document.getElementById("infoDiv").hidden == true) {
        document.getElementById("infoDiv").hidden = false;
    }
    else {
        document.getElementById("infoDiv").hidden = true;
    }
}
