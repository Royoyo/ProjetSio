//Les services permettent de créer des sections de codes accessible par tous les controllers


// Ce service crée la liste des utilisateurs  manipulable pour la vue admin
// Bien sûr toutes les fonctions pour la connection avec la BDD ne sont pas encore en place dans cet exemple
// et le système sera bien différent une fois l'api backend mise en place
// TO DO : remplacer les infos de la maquette et mettre une connexion avec l'API backend
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
	
webApp.factory('planCours',
	function(Restangular){
		return {
			getCours: function(){
				return Restangular.all('plan/cours').getList();
			},
			
			getCoursSeul: function(id){
				return Restangular.one('plan/cours',id).get();
			},
			postCours: function(personne){
				Restangular.all('plan/cours').post(personne);
			},
			deleteCours: function(personne){
				personne.remove();
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
	
webApp.service('matiereService',
	function(Restangular){

		var matieres = Restangular.all('matieres');		
		
		//Une fonction pour récupérer la liste entière
		var getMatieres = function(){
			return matieres;
		}
		
		return {
			//De base, les fonctions déclarées dans un service sont privées, pour les rendre publiques il faut les indiquer comme cela :
			getMatieres : getMatieres
		}
	})

//Session utilisateur Javascript ( garder au chaud dans la session du navigateur par la factory Authentification)
webApp.service('Session', function($rootScope, USERS_ROLES) {

	this.create = function(user) {
		this.user = user.name;
		this.roles = user.roles;
		this.token = user.token;
		this.home = user.home;
		this.id = user.id;
	};
	this.destroy = function() {
		this.user = null;
		this.roles = null;
		this.token = null;
		this.home = null;
		this.id = null;
	};
	return this;
});