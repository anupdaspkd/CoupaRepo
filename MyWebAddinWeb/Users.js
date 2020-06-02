(function () {
    var userlist = [];
    var userdetails = [];
    var selectedUser;
    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            angular.element(document).ready(function () {
                angular.bootstrap(document, 'coupaTestApp');
            })
        });
    };

    //Registering module and adding controller
    var app = angular.module("coupaTestApp", []);
    app.controller("UserController", function ($scope, $http) {

        //Fetching user lists
        $http({
            url: "https://reqres.in/api/users?page=2",
            method: "GET",
            headers: { 'content-type': 'application/json' },
            datatype: 'json',
        }).then(function (response) {
            if (response.status === 200) {
                var users = response.data.data;
                $scope.userList = users;
            }
        }).catch(errorHandler);

        //When a user is selected
        $scope.userClickHandled = function (user) {
            selectedUser ="";
            userdetails = [];

            //For highlighiting the selected user
            $scope.userActive = user;
            $scope.isActive = function (user) {
                return user === $scope.userActive;
            };

            //Fetch all the details for the user
            $http({
                url: "https://reqres.in/api/users/" + user.id,
                method: "GET",
                headers: { 'content-type': 'application/json' },
                datatype: 'json',
            }).then(function (response) {
                if (response.status === 200) {
                    var userdata = response.data.data;
                    angular.forEach(userdata, function (value, key) {
                        userdetails.push([key, value]);
                    })
                    var userad = response.data.ad;
                    angular.forEach(userad, function (value, key) {
                        userdetails.push([key, value]);
                    })
                    selectedUser = response.data;
                    Word.run(function (context) {
                        var body = context.document.body;
                        body.clear();
                        var userTable = body.insertTable(8, 2, Word.InsertLocation.end, userdetails);
                        context.load(userTable);
                        return context.sync().
                            then(function () {
                                var tableCC = userTable.insertContentControl();
                                tableCC.title = "userContentControl";
                                return context.sync();
                            });
                    }).catch(errorHandler);
                }
            }).catch(errorHandler);
        };

        //validate the user details
        $scope.userValidate = function () {
            var validFlag = true;
            Word.run(function (context) {
                //this instruction selected  cell of the  table within the content control named "userContentControl"
                var selectedTable = context.document.contentControls.getByTitle("userContentControl").getFirst().tables.getFirst();
                context.load(selectedTable);
                return context.sync().
                    then(function () {
                        for (var i = 0; i < selectedTable.rowCount; i++) {
                            var selectedCellkey = selectedTable._V[i][0];
                            var selectedCellVal = selectedTable._V[i][1];
                            angular.forEach(selectedUser.data, function (value, key) { //validating the data section
                                if (key === selectedCellkey) {
                                    if (value.toString() !== selectedCellVal) {
                                        validFlag = false;
                                    }
                                }
                            });
                            angular.forEach(selectedUser.ad, function (value, key) { //validating the ad section
                                if (key === selectedCellkey) {
                                    if (value.toString() !== selectedCellVal) {
                                        validFlag = false;
                                    }
                                }
                            });
                        }
                        if (validFlag) {
                            showNotification("Success", "Validation Success");
                        }
                        else {
                            showNotification("Error", "Validation Failed");
                        }
                    })
            }).catch(errorHandler);
        };

        //Navigate to logout page
        $scope.userLogout = function () {
            window.location.href = '/Logout.html';
        };
    });

    //$$(Helper function for treating errors, $loc_script_taskpane_home_js_comment34$)$$
    function errorHandler(error) {
        // $$(Always be sure to catch any accumulated errors that bubble up from the Word.run execution., $loc_script_taskpane_home_js_comment35$)$$
        showNotification("Error:", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }

    function showNotification(header, content) {
        document.getElementById("resultmessageHeading").innerHTML = header;
        document.getElementById("resultmessageContent").innerHTML = content;
        $("#result-popup").fadeIn(300);
        $("#result-popup").fadeOut(3000);
        
    }
})();