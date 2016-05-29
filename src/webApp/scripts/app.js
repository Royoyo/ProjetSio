var webApp = angular.module("webApp", ["ui.router","ui.bootstrap","smart-table","ngAnimate","toastr","restangular","ui.calendar"]);

//TO DO : prendre ces constantes du serveur
webApp.constant("USERS_ROLES", {
    administrateur: "administrateur",
    planificateur: "planificateur",
    enseignant: "enseignant"
});

// Déclaration des constantes pour les évènements de login
webApp.constant("AUTH_EVENTS", {
    loginSuccess: "auth-loginSuccess",
    loginFailed: "auth-loginFailed",
    logoutSuccess: "auth-logoutSuccess",
    sessionTimeout: "auth-sessionTimeout",
    notAuthenticated: "auth-notAuthenticated",
    notAuthorized: "auth-notAuthorized"
});

// Constante pour lien backend
webApp.constant("BACKEND_URL", "./backend/");

//Config de toastr
webApp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        positionClass: "toast-bottom-right",
        //Limité à un à cause de la mise à jour 1.4.7 d'angular-animate
        maxOpened: 1
    });
});

// Rajout d'un intercepteur de toutes les requêtes http pour vérifier le login
webApp.config(function($httpProvider) {
    $httpProvider.interceptors.push([
        "$injector",
        function($injector) {
            return $injector.get("AuthInterceptor");
        }
    ]);
});