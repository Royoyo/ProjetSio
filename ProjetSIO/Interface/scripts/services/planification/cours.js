webApp.factory("coursService",
	function($q, Restangular, notifService){

	    function getOne(id) {
	        return $q(function(resolve, reject) {
	            //TO DO Lancer toastr chargement
	            Restangular.one("plan/cours", id).get().then(function (data) {
	                data.id_Users = Number(data.id_Users);
	                data.id_Matieres = Number(data.id_Matieres);
	                //TO DO SUCCESS TOASTR
	                resolve(data);
	            }, function() {
	                //TO DO ERROR TOASTR
	                reject();
	            });
	        });
	    };

	    function getNew() {
	        return Restangular.one("plan/cours");
	    };

	    function save(cours) {
	        return $q(function(resolve, reject) {
	            notifService.saving();
	            cours.save().then(function() {
	                notifService.saved();
	                resolve();
	            }, function(response) {
	                notifService.error(response.data.message);
	                reject();
	            });
	        });
	    };

	    function remove(cours) {
	        return $q(function(resolve, reject) {
	            notifService.deleting();
	            cours.remove().then(function() {
	                notifService.deleted();
	                resolve();
	            }, function(response) {
	                notifService.error(response.data.message);
	                reject();
	            });
	        });
	    };
        
        function sendAssignations(start,end) {
            return $q(function(resolve, reject){
                notifService.sending();
                Restangular.one("plan/cours").customGET("assignation", {start: start, end: end}).then(function(){
                    notifService.sent();
                    resolve();
                },function(response){
                    notifService.error(response.data.message);
                    reject();
                })
            })
        };

	    return {

	        getOne: getOne,

	        getNew: getNew,

	        save: save,

	        remove: remove,
            
            sendAssignations: sendAssignations
	    }
	})