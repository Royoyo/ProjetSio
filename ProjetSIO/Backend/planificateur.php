<?php

/**
 * \file        planificateur.php
 * \author      SIO-SLAM 2014-2016
 * \version     1.0
 * \date        12/04/2015
 * \brief       "planificateur" routes
 *
 * \details     this file contains all the routes for "planificateur" role
 */
 
 //TO DO : revoir la logique appliquée au date
 
 //Cours
 
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

//Enseignants

$app->get('/plan/enseignant', $authenticateWithRole('planificateur'), function() use ($app) {
    $users = Users::whereHas('roles', function($q) {
        $q->where('role', 'enseignant');
    })->with('matieres')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/plan/enseignant/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    //TO DO : rajouter filtre enabled
    $personne = Users::where('id', $id)->with('matieres')->select('id', 'firstName', 'lastName')->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($personne));
});

$app->put('/plan/enseignant/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $personne = Users::where('id', $id)->with('matieres')->firstOrFail();
        
        //sync matieres
        $newMatieres = [];
        foreach($data['matieres'] as $matiere){
            array_push($newMatieres, $matiere['id']);
        }        
        $personne->matieres()->sync($newMatieres);
        
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});

//Classes

$app->get('/plan/classes', $authenticateWithRole('planificateur'), function() use ($app) {
    $classes = Classes::all();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($classes));
});

$app->get('/plan/classes/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $classe = Classes::where('id', $id)->select('id', 'dateDebut', 'dateFin', 'nom')->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($classe));
});

$app->put('/plan/classes/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $classe = Classes::where('id', $id)->firstOrFail();

        $classe->nom = $data['nom'];
        $classe->dateDebut = $data['dateDebut'];
        $classe->dateFin = $data['dateFin'];
        $classe->save();
              
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});

$app->post('/plan/classes', $authenticateWithRole('planificateur'), function() use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        
        $classe = new Classes(array(
                'nom' => $data['nom'],
                'dateDebut' => $data['dateDebut'],
                'dateFin' => $data['dateFin']
        ));
        
        $classe->save();
              
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});
?>