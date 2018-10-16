function logIn() {
    var success = false;
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getLogIn/",
        data: '{"userId":"' + $('#username').val() + '", "hash":"' + $().crypt({
        method: "md5",
        source: $('#password').val()}) + '"}',
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            // show gif here, eg:
            $('body').css('cursor', 'wait');
        },
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //errorMessage = "";
            //alert('success: ' + res);
            eraseCookie('psiuser');
            var overlay = document.createElement('div');
            if ($('permissions', res).is('*') && ($('#username').val().toUpperCase() == 'PSI')) {
                eraseCookie('psi');
                createCookie('psi', res, 1);
                createCookie('psiuser', res, 1);
                success = true;
                document.location.href = 'anywhere.html';
            } else if ($('permissions', res).is('*') && (checkforErrors(res) == 0)) {
                eraseCookie('psi');
                createCookie('psi', res, 1);
                success = true;
                document.location.href = 'anywhere.html';
            } else if (res.indexOf('609') > -1) {
                //$("#error").css("display", "block");
                //checkForErrors();
                customPasswordChange()
            } else {
                $("#error").css("opacity", "1");
                $("#error").css("display", "block");
                if ($("#error").hasClass("hippaRestriction")) {
                    $(".err").css("top", "350px");
                    $(".errortext").css("top", "-22px");
                    $(".errorpic").css("top", "0px");
                    $("#errortext").text("Password cannot match a recently used password");
                } else if ($("#error").hasClass("userInputError")) {
                    $(".err").css("top", "350px");
                    $(".errortext").css("top", "-22px");
                    $(".errorpic").css("top", "0px");
                    $("#errortext").text("Invalid username or password");
                } else if (res.indexOf('608') > -1) {
                    $("#errortext").text("This user name does not exist in demographics.");
                } else {
                    $("#errortext").text("Login unsuccessful");
                }
            }
        },
        error: function (xhr, status, error) {
            //alert(
             //   "There was a problem connecting to the database. Please click OK to continue. If the problem persists, please contact Primary Solutions." +
             //   xhr.status + '\n' + xhr.responseText);
        },
        complete: function () {
            // hide gif here, eg:
            $('body').css('cursor', 'auto');
        }
    });
    //postError("100", "This is a tricky error", "DEBUG");
}

//Shared functionality of log in for use with change password, because of the ids for username and password on the forms
function logInChangePassword() {
    var success = false;
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port + "/" + $.webServer.serviceName + "/getLogIn/",
        data: '{"userId":"' + $('#username2').val() + '", "hash":"' + $().crypt({
            method: "md5",
            source: $('#newpassword2').val()
        }) + '"}',
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            // show gif here, eg:
            $('body').css('cursor', 'wait');
        },
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //errorMessage = "";
            //alert('success: ' + res);
            eraseCookie('psiuser');
            var overlay = document.createElement('div');
            if ($('permissions', res).is('*') && ($('#username2').val().toUpperCase() == 'PSI')) {
                eraseCookie('psi');
                createCookie('psi', res, 1);
                success = true;
                createCookie('psiuser', res, 1);
                document.location.href = 'anywhere.html';
            } else if ($('permissions', res).is('*') && (checkforErrors(res) == 0)) {
                eraseCookie('psi');
                createCookie('psi', res, 1);
                success = true;
                document.location.href = 'anywhere.html';
            }
                //else if (res.indexOf('609') > -1) {
                //    $("#error").css("display", "block");
                //    checkForErrors();
                //} 
            else {
                $("#error").css("opacity", "1");
                $("#error").css("display", "block");
                if ($("#error").hasClass("hippaRestriction")) {
                    $(".err").css("top", "350px");
                    $(".errortext").css("top", "-22px");
                    $(".errorpic").css("top", "0px");
                    $("#errortext").text("Password cannot match a recently used password");
                } else if ($("#error").hasClass("userInputError")) {
                    $(".err").css("top", "350px");
                    $(".errortext").css("top", "-22px");
                    $(".errorpic").css("top", "0px");
                    $("#errortext").text("Invalid username or password");
                } else {
                    $("#errortext").text("Login unsuccessful");
                }
            }
        },
        error: function (xhr, status, error) {
            //alert(
           //     "There was a problem connecting to the database. Please click OK to continue. If the problem persists, please contact Primary Solutions." +
            //    xhr.status + '\n' + xhr.responseText);
        },
        complete: function () {
            // hide gif here, eg:
            $('body').css('cursor', 'auto');
        }
    });
    //postError("100", "This is a tricky error", "DEBUG");
}

function patchIt() {
    logIn();
    //var success = false;
    ////alert('patchIt');
    //$.ajax({
    //    type: "POST",
    //    url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
    //        "/" + $.webServer.serviceName + "/anyTime/",
    //    data: '{}',
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (response, status, xhr) {
    //        var res = JSON.stringify(response);
    //        //alert('success: ' + res);
    //    },
    //    //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    //    complete: function () {
    //        logIn();
    //    }
    //});
}

//Added to get value as to whether or not a strong password is required and the length of password required
function strongPasswordValue() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getStrongPassword/",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //Had to do this way because both fields are in database under same column name in system settings
            var passwordInfo = $("results", res);
            $.session.strongPassword = passwordInfo[0].innerText;
            $.session.passwordSpecialCharacters = passwordInfo[1].innerText;
            $.session.advancedPasswordLength = passwordInfo[2].innerText;            
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n' + xhr.responseText);
        }
    });
}

function getCustomLoginTextAndVersion(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/getCustomTextAndAnywhereVersion/",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            callback(res);
        },
        error: function (xhr, status, error) {
            $("#customLoginText").text("Primary Solutions, in conjunction with amazing people like you, has built a new product from the ground up that " +
                "focuses on ease of use so that you can focus on what's really important.");
            //alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n' + xhr.responseText);
        }
    });
}

function changeIt() {
    if (checkPass() == 0) return;
    var success = false;
    //alert('patchIt');
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/changeLogIn/",
        data: '{"userId":"' + $('#username2').val() + '", "hash":"' + $().crypt({
            method: "md5",
            source: $('#password2').val()
        }) + '", "newPassword":"' + $('#newpassword1').val() + '", "changingToHashPassword":"' + $().crypt({
            method: "md5",
            source: $('#newpassword1').val()
        }) + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: ' + res);
            if (res.indexOf('Error:611') > -1) {
                $("#error").addClass("hippaRestriction");
                $("#error").removeClass("userInputError");
            } else if(res.indexOf('Error:610') > -1){
                $("#error").addClass("userInputError");
                $("#error").removeClass("hippaRestriction");
            } else {
                $("#error").removeClass("hippaRestriction");
                $("#error").removeClass("userInputError");
            }
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
        complete: function () {
            $('#password').val($('#newpassword1').val());
            logInChangePassword();
        }
    });
}

function resetIt() {
    $("#resetButton").prop('disabled', true);
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/setupPasswordResetEmail/",
        data: '{"userName":"' + $('#username3').val() + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            setUpPasswordResetMessages(res);
            $("#resetButton").prop('disabled', false);
        },
        error: function (xhr, status, error) {
            //alert("Error\n-----\n" + xhr.status + '\n-----\n' + error + '\n-----\n' + xhr.responseText);
        }
    });
}

function tokenCheck() {
    var success = false;
    //alert('checking token');
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/tokenCheck/",
        data: '{"token":"' + $.session.Token + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            //alert('success: ' + res);
            if (res.indexOf('607') > -1 || res.indexOf("606") > -1) {
                document.location.href = 'login.html';
            } else {
                success = true;
            }
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}
setInterval(function () {
    //call $.ajax here
}, 5000); //5 seconds
function postError(errNum, errMsg, errLvl) {
    var d = new Date();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var strDate = d.getDate() + "-" + curr_month + "-" + d.getFullYear() + " " + d.getHours() +
        ":" + d.getMinutes();
    var dataString = 't=' + strDate + '&l=' + 'client' + '&u=' + $.session.Name + " " + $.session
        .LName + '&en=' + errNum + '&em=' + errMsg + '&s=' + errLvl;
    //$.ajax({  
    //  type: "POST",  
    //  url: http://anyerr.primarysolutions.net/Default.aspx,  //$.webServer.anyerr,  
    //  data: dataString,  
    //  success: function() {  
    //  }  
    //}); 
}

function saveDefaultLocationValueAjax(switchCase, locationId) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/saveDefaultLocationValue/",
        data: '{"token":"' + $.session.Token + '", "switchCase":"' + switchCase + '", "locationId":"' + locationId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}

function saveDefaultLocationNameAjax(switchCase, locationName) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/saveDefaultLocationName/",
        data: '{"token":"' + $.session.Token + '", "switchCase":"' + switchCase + '", "locationName":"' + locationName + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}

function updateVersionAjax() {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/updateVersion/",
        data: '{"token":"' + $.session.Token + '", "version":"' + $.session.version + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
        },
        //error: function (xhr, status, error) { alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText); },
    });
}

//Infal  login. Will look differently and possibly be moved. Putting here for functionality tests.
function checkLogin() {
    $.ajax({
        type: "POST",
        //url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
        //    "/" + $.webServer.serviceName + "/getURL/",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/ValidateLogin/",
        data: '{"id":"' + $('#userIDInfal').val() + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            var res = JSON.stringify(response);
            allowAccess(res);
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
            //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
        },
    });
}

//Going to call on login to see if a connection for Infal exists in the webconfig 
function checkInfalConnectionAjax(callback) {
    $.ajax({
        type: "POST",
        url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
            "/" + $.webServer.serviceName + "/CheckInfalConnection/",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, status, xhr) {
            if (response.CheckInfalConnectionResult == "Connection") {
                //console.log($.session)
                $.session.infalHasConnectionString = true;
            }
            if ($.session.infalOnly) {
                homeServiceLoad();
            }
        },
        error: function (xhr, status, error) {
            callback(error, null);
        },
    });    
}