<?php

use Illuminate\Database\Eloquent\Model as Model;

/**
* \class        Cours Cours.php "Backend/model.php
* \brief        corresponding to lessons
*/
class Cours extends Model {
    public $timestamps = false;
    public function user() {
        return $this->belongsTo('Users', 'id_Users')->with('matieres')->select('id','firstName','lastName', 'email');
    }

    public function matiere() {
        return $this->belongsTo('Matieres', 'id_Matieres');
    }

    public function classes() {
        return $this->belongsToMany('Classes', 'cours_classes', 'id_Cours', 'id_Classes')->select('id', 'nom');
    }
}
