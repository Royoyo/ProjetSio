webApp.factory("classesService",
	function($q, notifService, Restangular){
	    var list = [];

	    function updateList() {
	        return $q(function (resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.all("plan/classe").getList().then(function (data) {
	                angular.forEach(data, function(element) {
	                    element.annee = element.start.substr(0, 4) + "/" + element.end.substr(0, 4);
	                });
	                list = [].concat(data.plain());
	                //TO DO SUCCESS TOASTR
	                resolve();
	            }, function () {
	                //TO DO ERROR TOASTR
	                reject();
	            });
	        });
	    };

	    function updateCurrentNextList(year) {
	        return $q(function (resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.one("plan/current_next_classe", year).getList().then(function (data) {
	                angular.forEach(data, function(element) {
	                    element.annee = element.start.substr(0, 4) + "/" + element.end.substr(0, 4);
	                });
	                list = [].concat(data.plain());
	                //TO DO SUCCESS TOASTR
	                resolve();
	            }, function () {
	                //TO DO ERROR TOASTR
	                reject();
	            });
	        });
	    };

	    function getList() {
	        return $q(function (resolve, reject) {
                updateList().then(function () {
                    resolve(list);
                });
	        });
	    };

	    function getCurrentNextList(year) {
	        return $q(function (resolve, reject) {
                updateCurrentNextList(year).then(function () {
                    resolve(list);
                });
	        });
	    };

	    function getOne(id) {
	        return $q(function (resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.one("plan/classe", id).get().then(function (data) {
	                data.annee = data.start.substr(0, 4) + "/" + data.end.substr(0, 4);
	                data.start = moment(data.start).startOf("day").toDate();
	                data.end = moment(data.end).startOf("day").toDate();
	                data.id_Users = Number(data.id_Users);
	                //TO DO SUCCESS TOASTR
	                resolve(data);
	            }, function () {
	                //TO DO ERROR TOASTR
	                reject();
	            });
	        });
	    };

	    function getNew() {
	        return Restangular.one("plan/classe");
	    };

	    function save(classe) {
	        return $q(function (resolve, reject) {
	            notifService.saving();
	            classe.save().then(function () {
	                notifService.saved();
	                resolve();
	            }, function (message) {
	                notifService.error(message);
	                reject();
	            });
	        });
	    };

	    function remove(classe) {
	        return $q(function (resolve, reject) {
	            notifService.deleting();
	            classe.remove().then(function () {
	                notifService.deleted();
	                resolve();
	            }, function (response) {
	                notifService.error(response.data.message);
	                reject();
	            });
	        });
	    }

	    return {
	        updateList: updateList,

	        getList: getList,

	        updateCurrentNextList: updateCurrentNextList,

	        getCurrentNextList: getCurrentNextList,

	        getOne: getOne,

	        getNew: getNew,

	        save: save,

	        remove: remove
	    }
	})