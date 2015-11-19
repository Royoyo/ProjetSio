<?php

/**
 * \file		model.php
 * \author		SIO-SLAM 2014-2016
 * \version		1.0
 * \date     	11/19/2015
 * \brief       backend models and db connection
 *
 * \details		this file enable the connection to the DB and
 *				display a list of all the models used
 */
 
//// DataBase connection
$settings = array(
    'driver' => 'mysql',
    'host' => '127.0.0.1',
    'database' => 'test',
    'username' => 'root',
    'password' => '020395',
    'collation' => 'utf8_general_ci',
    'charset' => 'utf8',
    'prefix' => ''
);

$container = new \Illuminate\Container\Container;
$connFactory = new \Illuminate\Database\Connectors\ConnectionFactory($container);
$conn = $connFactory->make($settings);
$resolver = new \Illuminate\Database\ConnectionResolver();
$resolver->addConnection('default', $conn);
$resolver->setDefaultConnection('default');
\Illuminate\Database\Eloquent\Model::setConnectionResolver($resolver);

use \Illuminate\Database\Eloquent\Model;

/// users class : corresponding to the users
class Users extends Model {
    protected $fillable = ['login', 'firstName', 'lastName', 'email'];
    public $timestamps = false;


    public function roles() {
        return $this->belongsToMany('Roles', 'users_roles', 'id_Users', 'id_Roles');
    }

    public function matieres() {
        return $this->belongsToMany('Matieres', 'users_matieres', 'id_Users', 'id_Matieres');
    }
}

/// classes class : corresponding to the "classes". A "classe" is composed by many students
class Classes extends Model {
    protected $fillable = ['dateDebut', 'dateFin', 'nom'];
    public $timestamps = false;

    public function cours() {
        return $this->belongsToMany('Cours', 'cours_classes', 'id_Classes', 'id_Cours');
    }
}

/// fermeture class : corresponding to the day the school is close
class Fermeture extends Model {
    protected $fillable = ['dateDebut', 'dateFin'];
    public $timestamps = false;
}

/// indisponibilite class : corresponding to the unusable hours in the teacher's schedule
class Indisponibilite extends Model {
    protected $fillable = ['dateDebut', 'dateFin', 'id_Users'];
    public $timestamps = false;

    public function user() {
        return $this->hasOne('Users', 'id');
    }
}

/// matieres class : corresponding to the lesson's subject f.e. : mathematics, english
class Matieres extends Model {
    protected $fillable = ['nom', 'code'];
    public $timestamps = false;

    public function user() {
        return $this->belongsToMany('Users', 'users_matieres', 'id_Matieres', 'id_Users');
    }
}

/// cours class : corresponding to lessons
class Cours extends Model {
    protected $fillable = ['dateDebut', 'dateFin', 'id_Matiere', 'id_Users'];
    public $timestamps = false;

    public function user() {
        return $this->hasOne('Users', 'id');
    }

    public function matiere() {
        return $this->hasOne('Matieres', 'id');
    }

    public function classes() {
        return $this->belongsToMany('Classes', 'cours_classes', 'id_Cours', 'id_Classes');
    }
}

/// roles class : corresponding to the role an user has. He can be : Administrateur,Planificateur or Enseignant
class Roles extends Model {
    protected $fillable = ['role'];
    public $timestamps = false;

    public function user() {
        return $this->belongsToMany('Users', 'users_matieres', 'id_Roles', 'id_Users');
    }
}
?>