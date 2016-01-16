//Les services permettent de créer des sections de codes accessible par tous les controllers

//Partie admins

webApp.factory('adminPersonnes',
	function(Restangular){
		return {
			getPersonnes: function(){
				return Restangular.all('admin/personnes').getList();
			},
			
			getPersonne: function(id){
				return Restangular.one('admin/personnes',id).get();
			},
			postPersonne: function(personne){
				Restangular.all('admin/personnes').post(personne);
			},
			deletePersonne: function(personne){
				personne.remove();
			}
		}
	})

//Partie planificateurs
	
webApp.factory('planClasses',
	function(Restangular){
		return {
			getClasses: function(){
				return Restangular.all('plan/classes').getList();
			},
			
			getClasse: function(id){
				return Restangular.one('plan/classes',id).get();
			},
            getNewClasse: function(){
				return Restangular.one('plan/classes');
			},
			postClasse: function(classe){
				Restangular.all('plan/classes').post(classe);
			},
			deleteClasse: function(classe){
				classe.remove();
			}
		}
	})

webApp.factory('planMatieres',
	function(Restangular){
		return {
			getMatieres: function(){
				return Restangular.all('plan/matieres').getList();
			},
			
			getMatiere: function(id){
				return Restangular.one('plan/matieres',id).get();
			},
            getNewMatiere: function(){
				return Restangular.one('plan/matieres');
			},
			postMatiere: function(classe){
				Restangular.all('plan/matieres').post(classe);
			},
			deleteMatiere: function(classe){
				classe.remove();
			}
		}
	})
	
webApp.factory('planCours',
	function(Restangular){
		return {
			getCours: function(){
				return Restangular.all('plan/cours').getList();
			},			
			getCoursSeul: function(id){
				return Restangular.one('plan/cours',id).get();
			},
            getNewCours: function(){
				return Restangular.one('plan/cours');
			},
			postCours: function(cours){
				Restangular.all('plan/cours').post(cours);
			},
            putCours: function(cours){
				Restangular.all('plan/cours').put(cours);
			},
			deleteCours: function(cours){
				cours.remove();
			}
		}
	})
	

	
webApp.factory('planEnseignants',
	function(Restangular){
		return {
			getEnseignants: function(){
				return Restangular.all('plan/enseignant').getList();
			},
					
			getEnseignant: function(id){
				return Restangular.one('plan/enseignant',id).get();
			}
		}
	})

//Partie enseignants

webApp.factory('ensCours',
	function(Restangular){
		return {
			getCours: function(){
				return Restangular.all('ens/cours').getList();
			}         
		}
	})

webApp.factory('ensIndisponibilite',
	function(Restangular){
		return {			
            getNewIndispo: function(){
				return Restangular.one('ens/indispo');
			},
            getIndispo: function(id){
				return Restangular.all('ens/indispo', id).get();
			},
            getIndispos: function(){
				return Restangular.all('ens/indispo').getList();
			},
            postIndispo: function(indispo){
				Restangular.all('ens/indispo').post(indispo);
			},
            deleteIndispo: function(indispo){
				indispo.remove;
			},
		}
	})
    
//Partie services

webApp.factory('serviceRoles',
	function(Restangular){
		return {
			getRoles: function(){
				return Restangular.all('roles').getList();
			},
		}
	})
	
webApp.factory('serviceMatieres',
	function(Restangular){
		return {
			getMatieres: function(){
				return Restangular.all('matieres').getList();
			},
		}
	})
    
//Session utilisateur Javascript ( garder au chaud dans la session du navigateur par la factory Authentification)
webApp.service('Session', function($rootScope, USERS_ROLES) {

	this.create = function(user) {
		this.user = user.name;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.roles = user.roles;
		this.token = user.token;
		this.home = user.home;
		this.id = user.id;
	};
	this.destroy = function() {
		this.user = null;
		this.firstName = null;
		this.lastName = null;
		this.roles = null;
		this.token = null;
		this.home = null;
		this.id = null;
	};
	return this;
});