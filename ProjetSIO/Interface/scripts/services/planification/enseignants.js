webApp.factory("planEnseignants",
	function(Restangular){
		return {
			getEnseignants: function(){
				return Restangular.all("plan/enseignant").getList();
			},
					
			getEnseignant: function(id){
				return Restangular.one("plan/enseignant",id).get();
			}
		}
	})