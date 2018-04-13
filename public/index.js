console.log('hallo')

// =====================================

let allClasses

// =====================================



getAllMarksFromSingleStudent()

let responseData

let currentClassID = -1

getAllData()

showAllClassDropdown()

// ============ GET-Methoden ===========

function getAllData(){      // Vorest einmal alle Daten vom Server abrufen
    var httpReq = new XMLHttpRequest();
    httpReq.open("GET", "/notenmanagement/getKlasse/5AHELS");
    httpReq.onload = function () {
        if (this.status == 200) {
            responseData = JSON.parse(this.responseText)
            // showResponse(responseData)
            console.log(responseData)
        } else {
            console.log('Response code ' + this.status)
        }
    };
    httpReq.onerror = function () {
        console.log("Error ")
    };
    httpReq.send()
}

function getAllMarksFromSingleStudent(){      // Vorest einmal alle Daten vom Server abrufen
    var httpReq = new XMLHttpRequest();
    httpReq.open("GET", "/notenmanagement/getSchueler/Florian Schachermair");
    httpReq.onload = function () {
        if (this.status == 200) {
            responseData = JSON.parse(this.responseText)
            // showResponse(responseData)
            console.log(responseData)
        } else {
            console.log('Response code ' + this.status)
        }
    };
    httpReq.onerror = function () {
        console.log("Error ")
    };
    httpReq.send()
}

function getAllClasses(){
    
}

// ======================================

function showResponse(responseObj){

    console.log(responseObj)

    /*
    let htmlStr = ''
    htmlStr += '<table> <tr> <th>Name</th> <th>Alter</th> </tr>'

    for (let i = 0; i < personList.length; i++) {
        htmlStr += '<tr>' +
            '<td>' + persons[i].personname + '</td>' +
            '<td>' + persons[i].personage + '</td>' +
            '<td>' + '<button onclick="deletePerson(' + persons[i].id + ')">Löschen</button>' + '</td>' +
            '<td>' + '<button onclick="doChange(this, ' + persons[i].id + ')">Ändern</button>' + '</td>' +
            '</tr>'
    */

/*
    getClass({year: 5, label: 'AHELS'})

    function getClass(searchClass){
        let httpReq = new XMLHttpRequest()
        httpReq.open('GET', '/notenmanagement/getKlasse/' + searchClass.year + searchClass.label)
        httpReq.onload = function(){
            let responseData = this.response
            console.log(responseData)
        }
        httpReq.send()
    */
}

function showAllClassDropdown(){
    var httpReq = new XMLHttpRequest();
    httpReq.open("GET", "/notenmanagement/getKlassen");
    httpReq.onload = function () {
        if (this.status == 200) {
            allClasses = JSON.parse(this.responseText)

            console.log(allClasses)

            let htmlStr = '<select name="select_class" onChange="classDropdownClicked(this)">'
            htmlStr += '<option value="none">(Klasse wählen)</option>'
            for(i=0; i < allClasses.length; i++){
                htmlStr += '<option value="'+allClasses[i].KID+'">'+allClasses[i].Jahrgang+allClasses[i].Bezeichnung+'</option>'
            }
            htmlStr += '</select>'
            
            document.getElementById('home_page_1').innerHTML = htmlStr
        } else {
            console.log('Response code ' + this.status)
        }
    };
    httpReq.onerror = function () {
        console.log("Error ")
    };
    httpReq.send()  
}

function classDropdownClicked(el){
    if(el.value == 'none'){
        let htmlStr = ''
        document.getElementById('home_page_2').innerHTML = htmlStr
        document.getElementById('home_page_3').innerHTML = htmlStr
        return
    }

    let classId = el.value
    console.log('ClassID ' + classId + ' selected from dropdown')
    currentClassID = classId
    showClass(classId)
}

function showClass(classId){
    if(classId < 0){
        return
    }
    var httpReq = new XMLHttpRequest();
    httpReq.open("GET", "/notenmanagement/getKlasse/"+classId);
    httpReq.onload = function () {
        if (this.status == 200) {
            wholeClass = JSON.parse(this.responseText)
            console.log('showClass with ID '+classId+':\n')
            console.log(wholeClass)

            let htmlStr

            if(wholeClass.length == 0){
                htmlStr = '<p><i>In dieser Klasse sind keine Schüler vorhanden<\i></p>'
            } else {
                htmlStr = '<p>Schüler auswählen:</p>'
                htmlStr += '<table> <tr> <th>Vorname</th> <th>Nachname</th> </tr>'

                for (let i = 0; i < wholeClass.length; i++) {
                    htmlStr += '<tr class="tablerow" onclick="onClick('+wholeClass[i].SID+')">' +
                        '<td>' + wholeClass[i].Vorname + '</td>' +
                        '<td>' + wholeClass[i].Nachname + '</td>' +
                        '</tr>'
                }
                htmlStr += '</table>'
            }
            document.getElementById('home_page_2').innerHTML = htmlStr

            htmlStr = '<button onclick="addClicked(this)">Schüler zu dieser Klasse hinzufügen</button>'

            document.getElementById('home_page_3').innerHTML = htmlStr
        } else {
            console.log('Response code ' + this.status)
        }
    };
    httpReq.onerror = function () {
        console.log("Error ")
    };
    httpReq.send() 
}

function onClick(sid){
    console.log('onClick on SID '+sid)

    window.open('student_page.html?sid='+sid,'_self')
}

function addClicked(el){
    console.log('ADD clicked on ClassID: '+currentClassID)

    let htmlStr = '<form onsubmit="addSubmited(this); return false;">'
        htmlStr += 'Vorname:<br>'
        htmlStr += '<input type="text" name="firstname" value=""><br> Nachname:<br>'
        htmlStr += '<input type="text" name="lastname" value=""><br><br>'
        htmlStr += '<input type="submit" value="OK">'
        htmlStr += '</form>'

     document.getElementById('home_page_3').innerHTML = htmlStr
}

function addSubmited(formEl){
    let newFirstname = formEl.elements.firstname.value
    let newLastname = formEl.elements.lastname.value

    console.log(newFirstname + ' ' + newLastname)

    let newStudent = {
        firstname: newFirstname,
        lastname: newLastname,
        KID: currentClassID
    }

    postStudent(newStudent)
}

function postStudent(student){
    var httpReq = new XMLHttpRequest();
    httpReq.open("POST", "/notenmanagement/addSchueler");
    httpReq.setRequestHeader("Content-Type", "application/json");

    httpReq.onload = function () {
        if(this.status==200) {
            let response = JSON.parse(this.responseText)
            console.log('postStudent response:')
            console.log(response)
            showClass(currentClassID)
        } else {
            console.log('Response code '+ this.status)
        }
    };

    httpReq.onerror = function () {
        console.log("Error ")
    };

    httpReq.send(JSON.stringify(student))
}