webApp.factory("adminPersonnes",
	function(Restangular){
		return {
			getPersonnes: function(){
				return Restangular.all("admin/personnes").getList();
			},
			
			getPersonne: function(id){
				return Restangular.one("admin/personnes",id).get();
			},
			postPersonne: function(personne){
				Restangular.all("admin/personnes").post(personne);
			},
			deletePersonne: function(personne){
				personne.remove();
			}
		}
	})