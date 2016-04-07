webApp.factory("matieresService",
    function($q, notifService, Restangular) {

        var list = [];

        function updateList() {
            return $q(function(resolve, reject) {
                //TO DO Lancer toastr chargement
                Restangular.all("plan/matiere").getList().then(function(data) {
                    list = [].concat(data);
                    //TO DO SUCCESS TOASTR
                    resolve();
                }, function() {
                    //TO DO ERROR TOASTR
                    reject();
                });
            });
        };

        function getList() {
            return $q(function(resolve, reject) {
                if (list) {
                    resolve(list);
                } else {
                    updateList().then(function() {
                        resolve(list);
                    });
                }
            });
        };

        function getOne(id) {
            return $q(function(resolve, reject) {
                //TO DO Lancer toastr chargement
                Restangular.one("plan/matiere", id).get().then(function(data) {
                    //TO DO SUCCESS TOASTR
                    resolve(data);
                }, function() {
                    //TO DO ERROR TOASTR
                    reject();
                });
            });
        };

        function getNew() {
            return Restangular.one("plan/matiere");
        };

        function save(matiere) {
            return $q(function(resolve, reject) {
                notifService.saving();
                matiere.save().then(function() {
                    notifService.saved();
                    resolve();
                }, function(response) {
                    notifService.error(response.data.message);
                    reject();
                });
            });
        };

        function remove(matiere) {
            return $q(function(resolve, reject) {
                notifService.deleting();
                matiere.remove().then(function() {
                    notifService.deleted();
                    resolve();
                }, function(response) {
                    notifService.error(response.data.message);
                    reject();
                });
            });
        }

        return {
            updateList: updateList,

            getList: getList,

            getOne: getOne,

            getNew: getNew,

            save: save,

            remove: remove
        }
    })