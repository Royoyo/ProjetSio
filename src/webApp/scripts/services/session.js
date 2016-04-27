//Session utilisateur Javascript ( garder au chaud dans la session du navigateur par la factory Authentification)
webApp.service("Session", function($rootScope, USERS_ROLES) {

	this.create = function(user) {
		this.user = user.name;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.roles = user.roles;
		this.token = user.token;
		this.home = user.home;
		this.id = user.id;
		this.email = user.email;
        this.theme = user.theme;
        $rootScope.theme = user.theme; 
	};
	this.destroy = function() {
		this.user = null;
		this.firstName = null;
		this.lastName = null;
		this.roles = null;
		this.token = null;
		this.home = null;
		this.id = null;
	    this.email = null;
        this.theme = null;
	};
	return this;
});


