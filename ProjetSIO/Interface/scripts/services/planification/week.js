webApp.factory("weekService",
	function($q, notifService, Restangular){
	    var list = [];

	    function updateList() {
	        return $q(function (resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.all("plan/weeks").getList().then(function (data) {
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
	            if (list) {
	                updateList().then(function () {
	                    resolve(list);
	                });
	            } else {
	                updateList().then(function () {
	                    resolve(list);
	                });
	            }
	        });
	    };


	    return {
	        updateList: updateList,

	        getList: getList,
	    }
	})