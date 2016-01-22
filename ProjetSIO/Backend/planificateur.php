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
    $cours_obj = Cours::with('user', 'matiere', 'classes')->where(function($q) use($start) {
        $q->where('start', '>=', $start);
    })->where(function($q) use($end) {
        $q->where('start', '<=', $end);
    })->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours_obj));
});

$app->get('/plan/cours/:id', $authenticateWithRole('planificateur'), function ($id) use ($app) {
    $cours_obj = Cours::with('user', 'matiere', 'classes')->where('id', $id)->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours_obj));
});

$app->get('/plan/cours/classe/:id', $authenticateWithRole('planificateur'), function ($id) use ($app) {
    $classe = Classes::where('id', $id)->with('cours')->get();;
    $cours = Cours::whereHas('classes', function($q) use($id) {
        $q->where('id', $id);
    })->get();;
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours));
});


$app->post('/plan/cours/', $authenticateWithRole('enseignant'), function () use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);

        $cours = new Cours;
        $cours->start = $data['start'];
        $cours->end = $data['end'];
        $cours->id_Matieres = $data['matiere']['id'];
        $cours_user = [];
        $indispo = [];
        if (array_key_exists('user', $data))
            try {
                // Verification si l'enseignant na aucun autre cours à la même date
                $cours_user = Cours::whereRaw('(start BETWEEN ? and ? or end BETWEEN ? and ?) and ?', [$data['start'], $data['end'], $data['start'], $data['end'], $data['user']['id']])->firstOrFail();
            } catch(Exception $e) {
                $cours_user = [];
            }
                // Verification s'il n'est pas indisponible
            try {
                $indispo = Indisponibilite::whereRaw('(dateDebut BETWEEN ? and ? or dateFin BETWEEN ? and ?) and ?', [$data['start'], $data['end'], $data['start'], $data['end'], $data['user']['id']])->firstOrFail();

            }catch(Exception $e) {
                $indispo = [];
            }
        // S'il na pas de cours et qu'il est disponible
        if (empty($cours_user) && empty($indispo)) {
            $cours->id_Users = $data['user']['id'];
            $cours->save();
            $user = Users::where('id', $cours->id_Users)->firstOrFail();
            $newClasses = [];   
            foreach($data['classes'] as $classe) {
                array_push($newClasses, $classe['id']);
            }
            // Sauvegarde classe database
            $cours->classes()->sync($newClasses);

            // Conversion date pour extraire Date de Heure séparement
            $dt_start = new DateTime($cours->start);
            $dt_end = new DateTime($cours->end);
            // Extraction date et heure
            $date = $dt_start->format('d/m/Y');
            $time_start = $dt_start->format('H:i:s');
            $time_end = $dt_end->format('H:i:s');

            $liste_classe = '';
            $i = 0;
            $len = count($cours->classes);
            // Création liste de classe pour template
            foreach ($cours->classes as $classe) {
                if ($len <= 1) {
                    $liste_classe .= 'la classe ';
                } else {
                    $liste_classe .= 'les classes ';
                }
                $liste_classe .= $classe['nom'];
                if ($i != $len - 1) {
                    $liste_classe .= ',';
                }
                $i++;
            }      
            $matiere = Matieres::where('id', $cours->id_Matieres)->firstOrFail();
            // Liste variable a utilisé dans le template
            $list_var = array(
                'user_firstname' => $user->firstName,
                'user_lastname' => $user->lastName,
                'cours_date' => $date,
                'cours_start' => $time_start,
                'cours_end' => $time_end,
                'classe' => $liste_classe,
                'matiere' => $matiere['nom']
            );

            $template = file_get_contents("templates/assignation_cours.html", FILE_TEXT);
            // ajout des valeur des variables dans le template
            foreach($list_var as $cle => $valeur) {
                $template = str_replace('{{ '.$cle.' }}', $valeur, $template);
            }     
            // ajout du header pour responsive, css ...
            $template = file_get_contents("templates/header.html", FILE_TEXT) . $template; 
            // creation du mail
/*            $message = Swift_Message::newInstance('Assignation d\'un cours à IFIDE SupFormation')
                ->setFrom(array('test.ifide@gmail.com' => 'IFIDE SupFormation'))
                ->setTo(array($user->email => $user->firstName + '' + $user->lastName))
                ->setBody($template, "text/html")
                ->setContentType("text/html");

            // envoie
            try {
                $results = $mailer->send($message);
            }catch(Exception $e) {
                $results = $e;
            }
            $app->response->setBody($results);*/
        } else {
            $app->response->setBody("Non disponible");
        }
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'text/html');
        $app->response->setBody($e);
    }
});

$app->put('/plan/cours/:id', $authenticateWithRole('planificateur'), function ($id) use ($app) {
    try {
        $json = $app->request->getBody();
        $data = json_decode($json, true);

        $cours = Cours::with('user', 'matiere', 'classes')->where('id', $id)->firstOrFail();
        $cours_user = [];
        $indispo = [];
        $old_user_id = '';
        if (array_key_exists('user', $data)) {
            if ($cours->id_Users != $data['user']['id'] and $cours->id_Users != '') {
                $old_user_id = $cours->id_Users;
            }
            try {
                // Verification si l'enseignant na aucun autre cours à la même date
                $cours_user = Cours::whereRaw('(start BETWEEN ? and ? or end BETWEEN ? and ?) and ?', [$data['start'], $data['end'], $data['start'], $data['end'], $data['user']['id']])->firstOrFail();
            } catch(Exception $e) {
                $cours_user = [];
            }
                // Verification s'il n'est pas indisponible
            try {
                $indispo = Indisponibilite::whereRaw('(dateDebut BETWEEN ? and ? or dateFin BETWEEN ? and ?) and ?', [$data['start'], $data['end'], $data['start'], $data['end'], $data['user']['id']])->firstOrFail();

            }catch(Exception $e) {
                $indispo = [];
            }
        }
        $old_cours_start = $cours->start;
        $old_cours_end = $cours->end;
        $old_classes = $cours->classes;
        $old_matieres_id = $cours->id_Matieres;
        $dt_start_o = new DateTime($old_cours_start);
        $dt_end_o = new DateTime($old_cours_end);
        // Extraction date et heure
        $date_o = $dt_start_o->format('d/m/Y');
        $time_start_o = $dt_start_o->format('H:i:s');
        $time_end_o = $dt_end_o->format('H:i:s');
        $cours->start = $data['start'];
        $cours->end = $data['end'];
        $cours->id_Matieres = $data['matiere']['id'];
        // S'il na pas de cours et qu'il est disponible
        if (empty($cours_user) && empty($indispo)) {
            $cours->id_Users = $data['user']['id'];
            $cours->save();

            $newClasses = [];
            foreach($data['classes'] as $classe) {
                array_push($newClasses, $classe['id']);
            }
            
            $cours->classes()->sync($newClasses);
            // Si l'enseignant a changé on lui envoie un mail pour le prévenir
            if ($old_user_id != '') {
                $user_old = Users::where('id', $old_user_id)->firstOrFail();
                $list_var = array(
                    'user_firstname' => $user_old->firstName,
                    'user_lastname' => $user_old->lastName,
                    'cours_date' => $date_o,
                    'cours_start' => $time_start_o,
                    'cours_end' => $time_end_o
                );

                $template = file_get_contents("templates/supression_cours.html", FILE_TEXT);
                // ajout des valeur des variables dans le template
                foreach($list_var as $cle => $valeur) {
                    $template = str_replace('{{ '.$cle.' }}', $valeur, $template);
                }     
                // ajout du header pour responsive, css ...
                $template = file_get_contents("templates/header.html", FILE_TEXT) . $template; 
                // creation du mail
                $message = Swift_Message::newInstance('Suppression d\'un cours à Ifide SupFormation')
                    ->setFrom(array('test.ifide@gmail.com' => 'IFIDE SupFormation'))
                    ->setTo(array($user_old->email => $user_old->firstName + '' + $user_old->lastName))
                    ->setBody($template, "text/html")
                    ->setContentType("text/html");

                // envoie
                try {
                    $results = $mailer->send($message);
                }catch(Exception $e) {
                    $results = $e;
                }
                $app->response->setBody($results);
            }

            // Conversion date pour extraire Date de Heure séparement
            $dt_start = new DateTime($cours->start);
            $dt_end = new DateTime($cours->end);
            // Extraction date et heure
            $date = $dt_start->format('d/m/Y');
            $time_start = $dt_start->format('H:i:s');
            $time_end = $dt_end->format('H:i:s');

            $liste_classe_old = '';
            $i = 0;
            $len = count($cours->classes);
            // Création liste de classe pour template
            foreach ($old_classes as $classe) {
                if ($len <= 1) {
                    $liste_classe_old .= 'la classe ';
                } else {
                    $liste_classe_old .= 'les classes ';
                }
                $liste_classe_old .= $classe['nom'];
                if ($i != $len - 1) {
                    $liste_classe_old .= ',';
                }
                $i++;
            }
            $matiere_old = Matieres::where('id', $old_matieres_id)->firstOrFail();
            $liste_classe = '';
            $i = 0;
            $len = count($cours->classes);
            // Création liste de classe pour template
            foreach ($cours->classes as $classe) {
                if ($len <= 1) {
                    $liste_classe .= 'la classe ';
                } else {
                    $liste_classe .= 'les classes ';
                }
                $liste_classe .= $classe['nom'];
                if ($i != $len - 1) {
                    $liste_classe .= ',';
                }
                $i++;
            }
            $user = Users::where('id', $cours->id_Users)->firstOrFail();
            $matiere = Matieres::where('id', $old_matieres_id)->firstOrFail();
            // Liste variable a utilisé dans le template
            $list_var = array(
                'user_firstname' => $user->firstName,
                'user_lastname' => $user->lastName,
                'cours_date_old' => $date_o,
                'cours_start_old' => $time_start_o,
                'cours_end_old' => $time_end_o,
                'classe_old' => $liste_classe_old,
                'matiere_old' => $matiere_old['nom'],
                'cours_date' => $date,
                'cours_start' => $time_start,
                'cours_end' => $time_end,
                'classe' => $liste_classe,
                'matiere' => $matiere['nom']
            );

            $template = file_get_contents("templates/modification_cours.html", FILE_TEXT);
            // ajout des valeur des variables dans le template
            foreach($list_var as $cle => $valeur) {
                $template = str_replace('{{ '.$cle.' }}', $valeur, $template);
            }     
            // ajout du header pour responsive, css ...
            $template = file_get_contents("templates/header.html", FILE_TEXT) . $template; 
            // creation du mail
            $message = Swift_Message::newInstance('Modification d\'un cours à IFIDE SupFormation')
                ->setFrom(array('test.ifide@gmail.com' => 'IFIDE SupFormation'))
                ->setTo(array($user->email => $user->firstName + '' + $user->lastName))
                ->setBody($template, "text/html")
                ->setContentType("text/html");

            // envoie
            try {
                $results = $mailer->send($message);
            }catch(Exception $e) {
                $results = $e;
            }
            $app->response->setBody($results);
        } else {
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody('Non disponible');
        }
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'text/html');
        $app->response->setBody($e);
    }
});

$app->delete('/plan/cours/:id', $authenticateWithRole('planificateur'),  function ($id) use ($app) {
    try {
        $cours = Cours::with('user', 'matiere', 'classes')->where('id', $id)->firstOrFail();
        $cours->classes()->detach();
        $cours->delete();
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'text/html');
        $app->response->setBody($e);
    }
});

//Cours d'une classe
$app->get('/plan/classe/cours/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $cours = Cours::whereHas('cours', function($q) use($id) {
        $q->where('id', $id);
    })->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($cours));
});

//Matières
$app->get('/plan/matiere', $authenticateWithRole('planificateur'), function() use ($app) {
    $matiere = Matieres::with('user')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($matiere));
});

$app->get('/plan/matiere/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $matiere = Matieres::where('id', $id)->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($matiere));
});

$app->post('/plan/matiere/', $authenticateWithRole('planificateur'), function() use ($app) {
    try {
        $json = $app->request->getBody();
        $data = json_decode($json, true);

        $matiere = new Matieres();
        $matiere->nom = $data['nom'];
        $matiere->code = $data['code'];
        $matiere->save();

        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

$app->put('/plan/matiere/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    try {
        $matiere = Matieres::where('id', $id)->firstOrFail();
        $json = $app->request->getBody();
        $data = json_decode($json, true);

        $matiere->nom = $data['nom'];
        $matiere->code = $data['code'];
        $matiere->save();

        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

//Enseignants
$app->get('/plan/enseignant', $authenticateWithRole('planificateur'), function() use ($app) {
    $users = Users::whereHas('roles', function($q) {
        $q->where('role', 'enseignant');
    })->with('matieres', 'indisponibilite')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/plan/enseignant/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $personne = Users::where('id', $id)->where('enabled', 1)->with('matieres')->select('id', 'firstName', 'lastName')->firstOrFail();
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
        $app->response->setBody($e);
    }
});

//Classes

$app->get('/plan/classes', $authenticateWithRole('planificateur'), function() use ($app) {
    $classes = Classes::with('user')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($classes));
});

$app->get('/plan/classes/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $classe = Classes::where('id', $id)->with('user')->firstOrFail();
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
        //TO DO : enregistrer le prof principal
        $classe->id_Users = $data['user']['id'];
        $classe->save();

        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

$app->post('/plan/classes', $authenticateWithRole('planificateur'), function() use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        
        $classe = new Classes;
        $classe->nom = $data['nom'];
        $classe->dateDebut = $data['dateDebut'];
        $classe->dateFin = $data['dateFin'];
        $classe->id_Users = $data['user']['id'];
        $classe->save();

         
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});
?>