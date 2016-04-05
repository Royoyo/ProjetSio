webApp.factory("planMatieres",
	function(Restangular){
		return {
			getMatieres: function(){
				return Restangular.all("plan/matiere").getList();
			},
			
			getMatiere: function(id){
				return Restangular.one("plan/matiere",id).get();
			},
            getNewMatiere: function(){
				return Restangular.one("plan/matiere");
			},
			postMatiere: function(classe){
				Restangular.all("plan/matiere").post(classe);
			},
			deleteMatiere: function(classe){
				classe.remove();
			}
		}
	})