<?php

class Seed {

    function run()
    {
        $role = new Roles;
        $role->role = "administrateur";
        $role->home = "administration";
        $role->priority = 1;
        $role->save();
        
        $role = new Roles;
        $role->role = "planificateur";
        $role->home = "planification";
        $role->priority = 25;
        $role->save();
        
        $role = new Roles;
        $role->role = "enseignant";
        $role->home = "enseignement";
        $role->priority = 50;
        $role->save();
        
        $user = new Users;
        $user->login = "admin";
        $user->password = "79dab24f39387b54b8bf23eaae0f929eeb1ebe82"; // abc
        $user->hash = "236155714eb110f2ff5.50325128";
        $user->firstName = "test";
        $user->lastName = "admin";
        $user->email = "test@admin.com";
        $user->enabled = 1;
        $user->save();
        
        $user->roles()->attach([1,2,3]);
    }
}
