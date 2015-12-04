<?php

require 'vendor/autoload.php';
require_once 'model.php';
$app = new \Slim\Slim();

/**
* Planificateur
*/
$app->get('/plan/cours/', $authenticateWithRole('planificateur'),  function () use ($app) {
    $start = $_GET['start'];
    $end = $_GET['end'];
    $cours_obj = Cours::with('user', 'matiere', 'classes')->select('id', 'dateDebut', 'dateFin')->where(function($q) use($start) {
        $q->where('dateDebut', '>=', $start);
    })->where(function($q) use($end) {
        $q->where('dateDebut', '<=', $end);
    })->get();
    $title = '';
    $cours = array();
    foreach($cours_obj as $cour) {
        $title .= $cour->matiere['nom'];
        $title .= '<br>';
        $title .= $cour->user['lastName'];
        $title .= ' ';
        $title .= $cour->user['firstName'];
        $title .= '<br>';
        foreach($cour->classes as $classe) {
            $title .= $classe['nom'];
            $title .= '/';
        }
        array_push($cours,
            "cours", $cour,
            "user", $cour->user,
            "matiere", $cour->matiere,
            "classes", $cour->classes,
            "title", $title
        );
    }
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours));
});

$app->get('/plan/cours/:id', $authenticateWithRole('planificateur'), function ($id) use ($app) {
    $cours_obj = Cours::with('user', 'matiere', 'classes')->where('id', $id)->firstOrFail();
    $title = '';
    $cours = array();
    $title .= $cours_obj->matiere['nom'];
    $title .= '<br>';
    $title .= $cours_obj->user['lastName'];
    $title .= ' ';
    $title .= $cours_obj->user['firstName'];
    $title .= '<br>';
    foreach($cours_obj->classes as $classe) {
        $title .= $classe['nom'];
        $title .= '/';
    }
    array_push($cours, 
        "user", $cours_obj->user,
        "matiere", $cours_obj->matiere,
        "classes", $cours_obj->classes,
        "title", $title
    );
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours));
});

$app->get('/plan/enseignant', $authenticateWithRole('planificateur'), function() use ($app) {
    $users = Users::whereHas('roles', function($q) {
        $q->where('role', 'enseignant');
    })->with('matieres')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/plan/classes', $authenticateWithRole('planificateur'), function() use ($app) {
    $classes = Classes::all();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($classes));
});
?>