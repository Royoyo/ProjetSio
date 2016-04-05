webApp.controller("ProfilController",
	function ($scope, profilService, Session) {

	    $scope.emails = {};
	    $scope.passwords = {};

	    $scope.isSavedEmail = false; 
	    $scope.isSavingEmail = false;

	    $scope.isSavingPassword = false;
	    $scope.isSavedPassword = false;

	    $scope.user = Session;

	    $scope.saveEmail = function() {
	        $scope.isSavingEmail = true;
	        profilService.changeEmail($scope.emails).then(function() {
	            $scope.isSavingEmail = false;
	            $scope.isSavedEmail = true;
	        }, function (message) {
	            $scope.isSavingEmail = false;
	            $scope.errorEmail = message;
	        });
	    };

	    $scope.savePassword = function () {
	        $scope.isSavingPassword = true;
	        profilService.changePassword($scope.passwords).then(function () {
	            $scope.isSavingPassword = false;
	            $scope.isSavedPassword = true;
	        }, function (message) {
	            $scope.isSavingPassword = false;
	            $scope.errorPassword = message;
	        });
	    }
	});