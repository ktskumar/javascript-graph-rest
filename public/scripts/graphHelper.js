var myapp = new Msal.UserAgentApplication(APPLICATION_CONFIG.clientID, null, authCallback);
var graphScopes = APPLICATION_CONFIG.graphScopes;
function authCallback(errorDesc, token, error, tokenType) {
    if (token) {
    }
    else {
        log(error + ":" + errorDesc);
    }
}


function signin() {
    myapp.loginPopup(graphScopes).then(function (idToken) {
        //Login Success
        myapp.acquireTokenSilent(graphScopes).then(function (accessToken) {
            //AcquireTokenSilent Success
            this.localStorage.token = accessToken;
            getUserInfo();
        }, function (error) {
            //AcquireTokenSilent Failure, send an interactive request.
            myapp.acquireTokenPopup(graphScopes).then(function (accessToken) {
                this.localStorage.token = accessToken;
                getUserInfo();
            }, function (error) {
                console.log(error);
            });
        })
    }, function (error) {
        console.log(error);
    });
}


function signout() {

    myapp.logout();
    delete localStorage.token;
    delete localStorage.user;
    document.getElementById("userinfo").innerHTML = "";
    document.getElementById("btnSignin").style.display = "block";
    document.getElementById("container").style.display = "none";

}

function getUserInfo() {
    var theUrl = APPLICATION_CONFIG.graphEndpoint;
    var accessToken = localStorage.token;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("userinfo").innerHTML = JSON.parse(this.responseText).displayName;
            document.getElementById("btnSignin").style.display = "none";
            document.getElementById("container").style.display = "block";
            updateUI(JSON.parse(this.responseText));
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xmlHttp.send();
}

function btnGetAllFiles() {
    var theUrl = "https://graph.microsoft.com/v1.0/me/drive/root/children";
    var accessToken = localStorage.token;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
            updateUI(JSON.parse(this.responseText));
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xmlHttp.send();
}


function btnCreateFolder(){
    var theUrl ="https://graph.microsoft.com/v1.0/me/drive/root/children";    
    var accessToken = localStorage.token;  

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 200 || this.status == 201)){
            updateUI(JSON.parse(this.responseText));        
        }        
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({
        "name": "DemoFolder6",
        "folder": {}
      }));
    
}

function updateUI(data) {
    document.getElementById("json").innerHTML = JSON.stringify(data,null,2);

}
