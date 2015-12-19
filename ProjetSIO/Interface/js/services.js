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
	
webApp.factory('planClasses',
	function(Restangular){
		return {
			getClasses: function(){
				return Restangular.all('plan/classes').getList();
			},
			
			getClasse: function(id){
				return Restangular.one('plan/classes',id).get();
			},
			postClasse: function(classe){
				Restangular.all('plan/classes').post(classe);
			},
			deleteClasse: function(classe){
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
			postCours: function(personne){
				Restangular.all('plan/cours').post(personne);
			},
			deleteCours: function(personne){
				personne.remove();
			}
		}
	})
	
webApp.factory('roles',
	function(Restangular){
		return {
			getRoles: function(){
				return Restangular.all('roles').getList();
			},
		}
	})
	
webApp.factory('matieres',
	function(Restangular){
		return {
			getMatieres: function(){
				return Restangular.all('matieres').getList();
			},
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