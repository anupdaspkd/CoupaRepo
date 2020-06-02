//Registering the modeule and adding controller
var app = angular.module("coupaTestApp", []);
app.controller("LoginController", function ($scope, $http) {
    $scope.Login = function () {
        var data = {
            'email': $scope.userid,
            'password': $scope.password
        }

        //authenticating user
        $http({
            url: "https://reqres.in/api/login",
            method: "POST",
            headers: { 'content-type': 'application/json' },
            datatype: 'json',
            data: data
        }).then(function (response) {
            if (response.status === 200) {
                document.getElementById("result-popup").style.display = "none";
                window.location.href = '/Users.html';
            }
            else if (response.status === 400) {
                showNotification(response.data.error);
            }
            else {
                showNotification("Login Failed..!!");
            }
        }).catch(showNotification);
    };
});

function showNotification(error) {
    document.getElementById("result-popup").style.display = "block";
    document.getElementById("resultmessage").innerHTML = error.data.error;
}