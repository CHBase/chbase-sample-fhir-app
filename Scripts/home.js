function getPatient() {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Authorization", "Bearer " + token);
    var init = {
        method: 'GET',
        mode: 'cors',
        dataType: 'json',
        headers: headers
    };
    var request = new Request(fhirServiceUrl + '/api/fhir/patient', init);
    fetch(request).then(function (response) {
        if (!response.ok) {
            return response.json().then(function (error) {
                errorDispalying("Error in Patient Fetch Response", JSON.stringify(error));
            })
        }
        else {
            return response.json().then(function (result) {
                console.log(result);
                populatePatientTable(result);
                var html = '<pre lang="json">';
                html = html + JSON.stringify(result, null, ' ');
                html = html + '</pre>';
                document.getElementById("PatientText").innerHTML = html;
            })
        }
    }).catch(function (error) {
        errorDispalying("Error in Patient Fetch", error);
    });
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
function populatePatientTable(patientJson)
{
   patientJson.entry.forEach(function(patient){
       var tr = document.createElement("tr");
       tr.setAttribute("onclick","window.location.href = 'PatientDetail.html?patient_id="+patient.resource.id +"'");
       var td1 = document.createElement("td");
       if (typeof (patient.resource.photo) != 'undefined') {
       td1.innerHTML = "<img src=\"data:image/png;base64," + patient.resource.photo[0].data + "\"" + " id=" + patient.resource.id + " width=\"80\" height=\"80\" >";
       }
       else
       {
           td1.innerHTML =  "<img src=\"Assets/noimage.png\"  id=" + patient.resource.id + " width=\"80\" height=\"80\" >";
       }
       tr.appendChild(td1);
       var td2 = document.createElement("td");
       td2.innerText = patient.resource.name[0].given;
       tr.appendChild(td2);
       var table = document.getElementById("patientTable");
       table.appendChild(tr);
   })
}