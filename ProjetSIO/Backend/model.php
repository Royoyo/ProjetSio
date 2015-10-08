<?php
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

class Users extends \Illuminate\Database\Eloquent\Model {
    protected $fillable = ['login', 'firstName', 'lastName', 'email'];
    public $timestamps = false;

    public function roles()
    {
        return $this->belongsToMany('Roles', 'users_roles', 'id_Users', 'id_Roles');
    }

    public function matieres()
    {
        return $this->belongsToMany('Matieres', 'users_matieres', 'id_Users', 'id_Matieres');
    }
}

class Classes extends \Illuminate\Database\Eloquent\Model {
    protected $fillable = ['dateDebut', 'dateFin', 'nom'];
    public $timestamps = false;

    public function cours() {
        return $this->hasOne('\Cours', 'cours_classes', 'id_Classes', 'id_Cours');
    }
}


class Fermeture extends \Illuminate\Database\Eloquent\Model {
    protected $fillable = ['dateDebut', 'dateFin'];
    public $timestamps = false;
}

class Indisponibilite extends \Illuminate\Database\Eloquent\Model {
    protected $fillable = ['dateDebut', 'dateFin', 'id_Users'];
    public $timestamps = false;

    public function user() {
        return $this->hasOne('\Users', 'id');
    }
}

class Matieres extends \Illuminate\Database\Eloquent\Model {
    protected $fillable = ['nom', 'code'];
    public $timestamps = false;
    public function user() {
        return $this->belongsToMany('\Users', 'users_matieres', 'id_Matieres', 'id_Users');
    }
}

class Cours extends \Illuminate\Database\Eloquent\Model {
    protected $fillable = ['dateDebut', 'dateFin', 'id_Matiere', 'id_Users'];
    public $timestamps = false;

    public function user() {
        return $this->hasOne('\Users', 'id');
    }

    public function matiere() {
        return $this->hasOne('\Matieres', 'id');
    }

    public function classes() {
        return $this->belongsToMany('\Classes', 'cours_classes', 'id_Cours', 'id_Classes');
    }
}

class Roles extends \Illuminate\Database\Eloquent\Model {
    protected $fillable = ['role'];
    public $timestamps = false;

    public function user() {
        return $this->belongsToMany('\Users', 'users_matieres', 'id_Roles', 'id_Users');
    }
}
?>