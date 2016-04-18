webApp.factory("weekService",
	function($q, notifService, Restangular){
	    var list = [];

	    function updateList(year) {
	        return $q(function (resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.one("plan/weeks", year).getList().then(function (data) {
	                list = [].concat(data.plain());
	                //TO DO SUCCESS TOASTR
	                resolve();
	            }, function () {
	                //TO DO ERROR TOASTR
	                reject();
	            });
	        });
	    };

	    function getList(year) {
	        return $q(function (resolve, reject) {
                updateList(year).then(function () {
                    resolve(list);
                });
	        });
	    };


	    return {
	        updateList: updateList,

	        getList: getList,
	    }
	})