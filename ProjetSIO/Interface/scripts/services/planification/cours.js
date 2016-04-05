webApp.factory("planCours",
	function(Restangular){
		return {
			getCours: function(){
				return Restangular.all("plan/cours").getList();
			},			
			getCoursSeul: function(id){
				return Restangular.one("plan/cours",id).get();
			},
            getNewCours: function(){
				return Restangular.one("plan/cours");
			},
			postCours: function(cours){
				Restangular.all("plan/cours").post(cours);
			},
            putCours: function(cours){
				Restangular.all("plan/cours").put(cours);
			},
			deleteCours: function(cours){
				cours.remove();
			}
		}
	})