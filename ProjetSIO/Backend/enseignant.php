<?php

/**
 * \file        enseignant.php
 * \author      SIO-SLAM 2014-2016
 * \version     1.0
 * \date        12/04/2015
 * \brief       "enseignant" routes
 *
 * \details     this file contains all the routes for "enseignant" role
 */
 
 
//Cours
$app->get('/ens/cours/', $authenticateWithRole('enseignant'),  function () use ($app) {
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

$app->get('/ens/cours/:id', $authenticateWithRole('enseignant'),  function ($id) use ($app) {
    $cours_obj = Cours::with('matiere', 'classes')->select('id', 'dateDebut', 'dateFin')->where('id', $id)->get();
    $cours = array();
    foreach($cours_obj as $cour) {
        array_push($cours,
            "cours", $cour,
            "matiere", $cour->matiere,
            "classes", $cour->classes
        );
    }
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours));
});

//Indisponibilités
$app->get('/ens/indispo/', $authenticateWithRole('enseignant'),  function () use ($app) {
    $indispo = Indisponibilite::where('id_Users', $_SESSION['id'])->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($indispo));
});

$app->post('/ens/indispo/', $authenticateWithRole('enseignant'),  function () use ($app) {
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        
        $indispo = new Indisponibilite;
        $indispo->dateDebut = $data['dateDebut'];
        $indispo->dateFin = $data['dateFin'];
        $indispo->id_Users = $_SESSION['id'];
        $indispo->save();
              
        $app->response->setBody(true);
});

$app->delete('/ens/indispo/:id', $authenticateWithRole('enseignant'),  function ($id) use ($app) {
    try {
        $indispo = Indisponibilite::where('id_Users', $_SESSION['id'])->where('id', $id)->firstOrFail();
        $indispo->delete();

        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});

?>