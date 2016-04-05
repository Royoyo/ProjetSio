webApp.controller("periodeModal",
    function($scope, indispo, $uibModalInstance) {

        $scope.indispo = indispo;
        if (!indispo.isNew) {
            $scope.indispo.start = moment($scope.indispo.start).startOf("day").toDate();
            $scope.indispo.end = moment($scope.indispo.end).startOf("day").toDate();
        }

        $scope.pickerDateDebut = {
            opened: false
        }
        $scope.pickerDateFin = {
            opened: false
        }

        $scope.openPickerDebut = function () {
            $scope.pickerDateDebut.opened = true;
        };
        $scope.openPickerFin = function () {
            $scope.pickerDateFin.opened = true;
        };

        $scope.save = function () {
            //TO Do revoir construction de la date
            $scope.indispo.start = moment($scope.indispo.start).hour(8).format("YYYY-MM-DD HH:mm:ss");;
            $scope.indispo.end = moment($scope.indispo.end).hour(17).minutes(30).format("YYYY-MM-DD HH:mm:ss");;
            $scope.indispo.toSave = true;
            $uibModalInstance.close($scope.indispo);
        };

        $scope.delete = function () {
            $scope.indispo.toSave = false;
            $uibModalInstance.close($scope.indispo);
        };

        $scope.dismiss = function () {
            $uibModalInstance.dimiss("cancel");
        };
    });