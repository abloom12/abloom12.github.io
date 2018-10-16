var app = angular.module("app", []);

app.run(function ($window, $controller, $rootScope, $compile) {
    /*
        Don't touch this area.

        Since we're working with a mixture of AngularJS and Vanilla JavaScript,
        this means we have to kinda hack it to work together.

        This means the below is working just fine.

        You can do whatever you want to the controller, to the factory, even the directive
        or the HTML file itself.

        Just don't touch this.

        Thanks,

        J.D. Lowe
        04/22/2016
    */
    $window.adminSingleEntryLoad = function () {
        var template = "<div ng-controller='adminController'><admin-single-entry-page /></div>";
        var main = angular.element(document.getElementById('actioncenter'));

        //Although it's a new scope, it'll actually be the adminController scope in a moment
        var $scope = $rootScope.$new();
        
        //Bam! It's now the adminController; it does its work through reference instead of value.
        $controller("adminController", { $scope: $scope });
        
        //Take the HTML and compile it. This is what preps it for data binding.
        var temp = $compile(template);

        //Now bind the compiled data to the aforementioned scope.
        var progress = temp($scope);

        //And finally, append the generated HTML to the page.
        main.append(progress);
        $scope.reset();
        $scope.$apply();
        $scope.getData();
    }
});

app.controller("adminController", function ($scope, $compile, adminSingleEntryService) {
    //We bind the data to the service itself, this way it'll update much easier.
    $scope.data = adminSingleEntryService;
    $scope.waitwhat = adminSingleEntryService.waitwhat;
    $scope.reset = adminSingleEntryService.reset;
    $scope.getData = adminSingleEntryService.getData;
});

app.factory("adminSingleEntryService", function ($q) {
    var service = {};
    service.text1 = "This is text 1.";
    service.text2 = "This is text 2.";
    service.count = 0;
    service.names = [];

    service.waitwhat = function () {
        service.count++;
    }
    service.reset = function () {
        service.count = 0;
        service.names = [];
    }

    service.getData = function () {
        $q(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: $.webServer.protocol + "://" + $.webServer.address + ":" + $.webServer.port +
                    "/" + $.webServer.serviceName + "/getSystemMessages/",
                data: '{"token":"' + $.session.Token + '"}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response, status, xhr) {
                    var res = JSON.stringify(response);
                    //loadApp('singleentry');
                },
                error: function (xhr, status, error) {
                    //alert("Error\n-----\n" + xhr.status + '\n' + xhr.responseText);
                },
                complete: function (data) {
                    resolve("hello");
                }
            });
        }).then(function (data) {
            var names = ["Mike", "J.D.", "Dennis", "Brian", "Cody", "Liz", "Bonita"];
            function rand(arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }
            for (var i = 0; i < 1000; i++) {
                var name = rand(names);
                if (service.names.indexOf(name) == -1) service.names.push(name);
            }
            //$scope.$apply();
        });
    }

    return service;
});

app.directive("adminSingleEntryPage", function () {
    var URL = "singleentry/adminFilterTable.html?a=" + +(new Date());
    return {
        restrict: "E",
        replace: true,
        templateUrl: URL
    }
});