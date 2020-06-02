(function () {
    var app = angular.module("coupaTestAppUser", []);
    app.controller("UserController", function ($scope, $http) {
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
            else {
            }
        });

        $scope.userClickHandled = function (userid) {
            $http({
                url: "https://reqres.in/api/users/" + userid,
                method: "GET",
                headers: { 'content-type': 'application/json' },
                datatype: 'json',
            }).then(function (response) {
                if (response.status === 200) {
                    var userdata = response.data.data;
                    angular.forEach(userdata,function (value, key) {
                        var v = value;
                        var k = key;
                        userdetails.push([key, value]);
                    })
                }
                else {
                }
            });
        }
    });
})();