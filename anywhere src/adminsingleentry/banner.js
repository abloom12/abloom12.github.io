//Employee Class
function Employee(options) {
    var employee = this;
    employee.firstName = options.firstName || "";
    employee.lastName = options.lastName || ""
    employee.fullName = [employee.firstName, employee.lastName].join(" ");
    employee.userName = options.userName || "";
    employee.status = options.status || "";
    employee.id = options.id || "";
    employee.text = employee.fullName;
    employee.directEmployees = [];
    return employee;
}

function buildAdminSingleEntryBanner() {
    return new Promise(function (fulfillTop, rejectTop) {
        $('#actionbanner').html("");
        var promises = [];

        promises.push(buildAdminPayPeriodField());
        promises.push(buildAdminSupervisorField());

        Promise.all(promises).then(function success(data) {
            var obj = {};
            data.forEach(function (datum) {
                for (var key in datum) {
                    obj[key] = datum[key];
                }
            });
            $("#actionbanner")
                .append(obj.date.button)
                .append(obj.date.box)
                .append(obj.supervisor.button)
                .append(obj.supervisor.box);
            fulfillTop(obj);
        }, function error(err) {
            console.log(err);
            rejectTop(err);
        });

    });
}

function buildAdminPayPeriodField() {
    return new Promise(function (fulfill, reject) {
        var calendarIcon = $("<button>").addClass("bannericon calendaricon").attr("id", "calendaricon"),
            dateBox = $("<dateinput>").attr("id", "datebox2").addClass("locationbox").css("width", "290px").css("color", "#FFF"),
            dateInput = $("<input>").attr("id", "datebox").addClass("datebox headertext").appendTo(dateBox).css("width", "260px");

        calendarIcon.click(function (e) {
            dateBox.trigger("click");
        });
        dateInput.click(function (e) {
            dateBox.trigger("click");
        });

        getSingleEntryPayPeriodsAdminAjax(function (err, res) {
            if (err) {
                return reject(err);
            }

            var dates = [],
                date,
                target = dateBox,
                now = null;

            $("adminpayperiod", res).each(function () {
                var startDate = $("startdate", this).text(),
                    endDate = $("enddate", this).text(),
                    startD = new Date(startDate),
                    endD = new Date(endDate),
                    startText = leftpadTime(startD.getMonth() + 1) + "/" + leftpadTime(startD.getDate()) + "/" + startD.getFullYear(),
                    endText = leftpadTime(endD.getMonth() + 1) + "/" + leftpadTime(endD.getDate()) + "/" + endD.getFullYear(),
                    str,
                    current = new Date();
                
                str = [startText, endText].join(" - ");

                var data = { startText: startText, endText: endText, text: str, startDate: startD, endDate: endD };
                dates.push(data);
                if (current >= startD && endD >= current) {
                    now = dates[dates.length - 1];
                }
            });
            if (now !== null) {
                date = now;
            }
            else date = dates[0];
            target.find("input").val(date.text);
            target.data("startDate", date.startDate)
                .data("endDate", date.endDate)
                .data("dates", dates);
                
            fulfill({ date: { button: calendarIcon, box: dateBox } });
        });
    });
}

function buildAdminSupervisorField() {
    return new Promise(function (fulfill, reject) {
        var supervisorIcon = $("<button>").addClass("billericon").attr("id", "supervisorIcon"),
            supervisorBox = $("<supervisorinput>").attr("id", "supervisorbox").addClass("locationbox").css("width", "290px").css("color", "#FFF"),
            supervisorInput = $("<input>").attr("id", "supervisorinput").addClass("datebox headertext").appendTo(supervisorBox).css("width", "260px").css("paddingLeft", "24px");

        supervisorIcon.click(function (e) {
            supervisorBox.trigger("click");
        });
        supervisorInput.click(function (e) {
            supervisorBox.trigger("click");
        });
        getEmployeeListAndCountInfoAjax($.session.PeopleId, function (err, res) {
            if (err) {
                return reject(err);
            }
            var allEmployees = [],
                target = supervisorBox,
                me = new Employee({
                    firstName: $.session.Name,
                    lastName: $.session.LName,
                    id: $.session.PeopleId,
                    userName: $.session.UserId,
                    status: "main"
                });
            //HAd to remove below, because of the way the procedure is now. The name is still being populated.
            //allEmployees.push(me);

            $('employeeobject', res).each(function () {
                var alpha = $("alpha", this);
                var employee = new Employee({
                    firstName: $("firstname", alpha).text(),
                    lastName: $("lastname", alpha).text(),
                    id: $("personid", alpha).text(),
                    userName: $("username", alpha).text(),
                    status: "alpha"
                });

                var ids = [];

                var betas = $("betas", this);
                $("beta", betas).each(function () {
                    var employeeB = new Employee({
                        firstName: $("firstname", this).text(),
                        lastName: $("lastname", this).text(),
                        id: $("personid", this).text(),
                        userName: $("username", this).text(),
                        status: "beta"
                    });
                    if(ids.indexOf($("personid", this).text()) == -1) {
                        allEmployees.push(employeeB);
                        employee.directEmployees.push(employeeB);
                        ids.push($("personid", this).text());
                    }
                    
                });
                me.directEmployees.push(employee);
                allEmployees.push(employee);
            });
            allEmployees.sort(function (a, b) {
                var nameA = a.fullName.toUpperCase(),
                    nameB = b.fullName.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            for (var i = 0; i < allEmployees.length; i++) {
                var emp = allEmployees[i];
                emp.directEmployees.sort(function (a, b) {
                    var nameA = a.text.toUpperCase(),
                        nameB = b.text.toUpperCase();

                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                emp.directEmployees.push({ text: "ALL", id: "" })
            }

            target.find("input").val(me.fullName).attr("disabled", true);
            target.data("person_id", me.id).data("supervisors", allEmployees);

            fulfill({ supervisor: { button: supervisorIcon, box: supervisorBox } });
        });
       
    });
}