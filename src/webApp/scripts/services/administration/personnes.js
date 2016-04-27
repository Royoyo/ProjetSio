webApp.factory("adminService",
    function($q, notifService, Restangular) {

        var list = [];

        function updateList() {
            return $q(function(resolve, reject) {
                //TO DO Lancer toastr chargement
                Restangular.all("admin/personnes").getList().then(function(data) {
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
                    console.log(list);
                    updateList().then(function() {
                        resolve(list);
                    });
                }
            });
        };

        function getOne(id) {
            return $q(function(resolve, reject) {
                //TO DO Lancer toastr chargement
                Restangular.one("admin/personnes", id).get().then(function(data) {
                    //TO DO SUCCESS TOASTR
                    resolve(data);
                }, function() {
                    //TO DO ERROR TOASTR
                    reject();
                });
            });
        };

        function getNew() {
            return Restangular.one("admin/personnes");
        };

        function save(personne) {
            return $q(function(resolve, reject) {
                notifService.saving();
                personne.save().then(function() {
                    notifService.saved();
                    resolve();
                }, function(response) {
                    notifService.error(response.data.message);
                    reject();
                });
            });
        };

        function remove(personne) {
            return $q(function(resolve, reject) {
                notifService.deleting();
                personne.remove().then(function() {
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