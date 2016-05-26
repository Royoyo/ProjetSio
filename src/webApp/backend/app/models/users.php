<?php

use Illuminate\Database\Eloquent\Model as Model;

/**
* \class        Users model.php "Backend/model.php
* \brief        corresponding to the registered users
*/
class Users extends Model {
    public $timestamps = false;

    public function roles() {
        return $this->belongsToMany('Roles', 'users_roles', 'id_Users', 'id_Roles');
    }

    public function matieres() {
        return $this->belongsToMany('Matieres', 'users_matieres', 'id_Users', 'id_Matieres');
    }

    public function indisponibilite() {
        return $this->hasMany('Indisponibilite', 'id_Users');
    }

    public function cours() {
        return $this->hasMany('Cours', 'id_Users');
    }

    public function classes() {
        return $this->hasMany('Classes', 'id_Users');
    }

}
