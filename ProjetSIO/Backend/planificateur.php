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

use Dompdf\Dompdf;

$app->post('/theme', $authenticateWithRole('enseignant'), function() use ($app) {
	try{
        $user = Users::where('id', $_SESSION['id'])->first();
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $user->theme = $data["theme"];
        $user->save();
        
	}
	catch(Exception $e){
        $app->response->headers->set('Content-Type', 'text/html');
        $app->response->setBody($e);
		$app->response->setStatus(400);
	}
});
//Message d'assignation à tous les enseignants dans une fourchette de temps
$app->get('/plan/cours/assignation', $authenticateWithRole('planificateur'), function() use ($app) {
	try{
        $start = $_GET['start'];
        $end = $_GET['end'];
		$cours = Cours::with('user')->whereRaw("start >= ? AND end <= ?",[$start, $end])->get();

		foreach($cours as $cour) {
            $cour->assignationSent = true;
            $cour->save();
            if(!empty($cours->user)){
                mailAssignationCours($cour);
            }
		}
	}
	catch(Exception $e){
        $app->response->headers->set('Content-Type', 'text/html');
        $app->response->setBody($e);
		$app->response->setStatus(400);
	}
});

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

$app->get('/semaine/:year/:week/:classe', function ($year, $week, $classe) use ($app) {
    $dompdf = new Dompdf();
    $classe = Classes::where('id', $classe)->firstOrFail();
    $date = getDateList($week, $year);
    $cours_am = array();
    $cours_pm = array();
    $count = 0;
    foreach ($date as $day) {
        $cours_am[$count] = Cours::with('user', 'matiere')->whereRaw('(start >= ? AND end <= ?) and assignationSent = 1', [$day . " 08:00:00", $day . " 12:15:00"])->whereHas('classes', function($q) use($classe) {
            $q->where('id', $classe['id']);
        })->first();
        $cours_pm[$count] = Cours::with('user', 'matiere')->whereRaw('(start >= ? AND end <= ?) and assignationSent = 1', [$day . " 13:15:00", $day . " 17:30:00"])->whereHas('classes', function($q) use($classe) {
            $q->where('id', $classe['id']);
        })->first();
        $count += 1;
    }
    $date_name = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    $template = "templates/week.php";
    ob_start();
    include $template;
    $template = ob_get_clean();
    $dompdf->loadHtml($template);

    // Render the HTML as PDF
    $dompdf->render();

    // Output the generated PDF to Browser
    $dompdf->stream($classe->nom . "_semaine_" . $week);
});

$app->get('/plan/years/:current_next', function($current_next) use ($app) {
    if ($current_next == 'current') {
        if (date('Y-m-d', strtotime("now")) >= date('Y-m-d', strtotime("first day of september"))) {
            $year = date("Y", strtotime("now")) . "/" . date("Y", strtotime("next year"));
        } else {
            $year = date("Y", strtotime("last year")) . "/" . date("Y", strtotime("now"));
        }
    } else {
        if (date('Y-m-d', strtotime("now")) >= date('Y-m-d', strtotime("first day of september"))) {
            $year = date("Y", strtotime("next year")) . "/" . date("Y", strtotime("+2 year"));
        } else {
            $year = date("Y", strtotime("now")) . "/" . date("Y", strtotime("next year"));
        }
    }
    $year = array("year" => $year);
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($year));
});
$app->get('/plan/weeks', function() use ($app) {
    $start = date('Y-m-d', strtotime("first day of september last year"));
    $end = date('Y-m-d', strtotime("last day of july"));
    $cours = Cours::whereRaw('(start >= ? AND end <= ?)', [$start, $end])->orderBy('start', 'ASC')->get();
    $weeks = array();
    $week_list = array();
    foreach ($cours as $cour) {
        $classe_list = array();
        $date = new DateTime($cour->start);
        $week = $date->format("W");
        $year = $date->format("Y");
        $date = getStartAndEndDate($week, $year);
        $classes = Classes::whereHas('cours', function($q) use($date) {
                            $q->whereRaw('(start >= ? AND end <= ?)', [$date[0], $date[1]]);
                        })->get();
        foreach ($classes as $classe) {
            array_push($classe_list, $classe->id);
        }
        if (!in_array($week, $week_list)) {
            array_push($weeks, array(
                "number" => $week,
                "year" => $year,
                "classes" => $classe_list
            ));
            array_push($week_list, $week);
        }
    }
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($weeks));
});

$app->post('/plan/cours/', $authenticateWithRole('enseignant'), function () use ($app, $mailer) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);

        $cours = new Cours;
        $cours->start = $data['start'];
        $cours->end = $data['end'];
        $cours->id_Matieres = $data['id_Matieres'];
        $cours_user = [];
        $indispo = [];
        if (!empty($data['id_Users'])){
			$cours->id_Users = $data['id_Users'];
			// Verification si l'enseignant na aucun autre cours à la même date
			$coursExists = Cours::whereRaw('(start >= ? AND end <= ?) and id_Users = ?', [$data['start'], $data['end'], $data['id_Users']])->count();
			// Verification s'il n'est pas indisponible
			$indispoExists = Indisponibilite::whereRaw('(start >= ? AND end <= ?) and id_Users = ?', [$data['start'], $data['end'], $data['id_Users']])->count();

			if ($coursExists == 0  && $indispoExists == 0){
				saveCours($cours, $data['classes']);
			} else {
				$app->response->headers->set('Content-Type', 'application/json');
				$app->response->setStatus(400);
				$app->response->setBody(json_encode(array("message"=>"Cet enseignant est indisponible!")));
			}
		} else {
			saveCours($cours, $data['classes']);
		}
    } catch(Exception $e) {
		$app->response->setStatus(400);
		$app->response->setBody($e);
    }
});

$app->put('/plan/cours/:id', $authenticateWithRole('planificateur'), function ($id) use ($app, $mailer) {
    try {
        $json = $app->request->getBody();
        $data = json_decode($json, true);

        $cours = Cours::where('id', $id)->firstOrFail();
		$cours->start = $data['start'];
        $cours->end = $data['end'];
        $cours->id_Matieres = $data['id_Matieres'];
        $cours_user = [];
        $indispo = [];
        if (!empty($data['id_Users'])){
			$cours->id_Users = $data['id_Users'];
			// Verification si l'enseignant na aucun autre cours à la même date
			$coursExists = Cours::whereRaw('(start >= ? AND end <= ?) and id_Users = ? and id != ?', [$data['start'], $data['end'], $data['id_Users'], $id])->count();
			  // Verification s'il n'est pas indisponible
			$indispoExists = Indisponibilite::whereRaw('(start >= ? AND end <= ?) and id_Users = ?', [$data['start'], $data['end'], $data['id_Users']])->count();

			if ($coursExists == 0  && $indispoExists == 0){
				saveCours($cours, $data['classes']);
			} else {
				$app->response->headers->set('Content-Type', 'application/json');
				$app->response->setStatus(400);
				$app->response->setBody(json_encode(array("message"=>"Cet enseignant est indisponible!")));
			}
		} else {
			saveCours($cours, $data['classes']);
		}
	} catch(Exception $e) {
		$app->response->headers->set('Content-Type', 'application/json');
		$app->response->setStatus(400);
        $app->response->setBody($e);
	}
});

function saveCours($cours, $classes){
	$cours->save();
	$newClasses = [];
	foreach($classes as $classe) {
		array_push($newClasses, $classe['id']);
	}
	// Sauvegarde classe database
	$cours->classes()->sync($newClasses);
}

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

//Matières
$app->get('/plan/matiere', $authenticateWithRole('planificateur'), function() use ($app) {
    $matiere = Matieres::with('user')->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody($matiere->toJson());
});

$app->get('/plan/matiere/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $matiere = Matieres::where('id', $id)->first();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody($matiere->toJson());
});

$app->post('/plan/matiere/', $authenticateWithRole('planificateur'), function() use ($app) {
    try {
        $json = $app->request->getBody();
        $data = json_decode($json, true);

        $matiere = new Matieres();
        $matiere->nom = $data['nom'];
        $matiere->code = $data['code'];
        $matiere->save();
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
		$app->response->setStatus(400);
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
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
		$app->response->setStatus(400);
        $app->response->setBody($e);
    }
});

$app->delete('/plan/matiere/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
	try{
		$cours = Matieres::where('id', $id)->has('cours')->count();
		if($cours == 0){
			Matieres::find($id)->delete();
		} else {
			$app->response->headers->set('Content-Type', 'application/json');
			$app->response->setBody(json_encode(array("message"=>"Vous ne pouvez pas supprimer une matiere avec des cours!")));
			$app->response->setStatus(400);
		}
	} catch(Exception $e){
		$app->response->headers->set('Content-Type', 'application/json');
		$app->response->setStatus(400);
        $app->response->setBody($e);
	}
});

//Enseignants
$app->get('/plan/enseignant', $authenticateWithRole('planificateur'), function() use ($app) {
    $users = Users::whereHas('roles', function($q) {
        $q->where('role', 'enseignant');
    })
	->where("enabled",1)
	->with('matieres', 'indisponibilite', 'cours')
	->select('id','firstName','lastName')
	->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody($users->toJson());
});

$app->get('/plan/enseignant/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $personne = Users::where('id', $id)
		->where('enabled', 1)
		->with('matieres')
		->select('id', 'firstName', 'lastName')
		->first();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody($personne->toJson());
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
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
		$app->response->setStatus(400);
        $app->response->setBody($e);
    }
});

//Classes
$app->get('/plan/classe', $authenticateWithRole('planificateur'), function() use ($app) {
    if (date('Y-d-m', strtotime("now")) >= date('Y-d-m', strtotime("first day of september"))) {
        $start = date('Y-m-d', strtotime("first day of september"));
    } else {
        $start = date('Y-m-d', strtotime("first day of september last year"));
    }
    $classes = Classes::with('user')->whereRaw('(end >= ?)', [$start])->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody($classes->toJson());
});

$app->get('/plan/current_next_classe/:year', $authenticateWithRole('planificateur'), function($year) use ($app) {
    if ($year == 'current') {
        if (date('Y-m-d', strtotime("now")) >= date('Y-m-d', strtotime("first day of september"))) {
            $year = date("Y", strtotime("now")) . "/" . date("Y", strtotime("next year"));
            $start = date('Y-m-d', strtotime("first day of september"));
            $end = date('Y-m-d', strtotime("last day of july next year"));
        } else {
            $year = date("Y", strtotime("last year")) . "/" . date("Y", strtotime("now"));
            $start = date('Y-m-d', strtotime("first day of september last year"));
            $end = date('Y-m-d', strtotime("last day of july"));
        }
    } else {
        if (date('Y-m-d', strtotime("now")) >= date('Y-m-d', strtotime("first day of september"))) {
            $year = date("Y", strtotime("next year")) . "/" . date("Y", strtotime("+2 year"));
            $start = date('Y-m-d', strtotime("first day of september next year"));
            $end = date('Y-m-d', strtotime("last day of july +2 years"));
        } else {
            $year = date("Y", strtotime("now")) . "/" . date("Y", strtotime("next year"));
            $start = date('Y-m-d', strtotime("first day of september"));
            $end = date('Y-m-d', strtotime("last day of july next year"));
        }
    }
    $classes = Classes::with('user')->whereRaw('(start <= ? and end >= ?)', [$start, $end])->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody($classes->toJson());
});

$app->get('/plan/classe/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    $classe = Classes::where("id",$id)->with('user')->first();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody($classe->toJson());
});

$app->put('/plan/classe/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $classe = Classes::where('id', $id)->firstOrFail();

        $classe->nom = $data['nom'];
        $classe->start = $data['start'];
        $classe->end = $data['end'];
        $classe->id_Users = $data['id_Users'];
        $classe->save();

        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
		$app->response->setStatus(400);
        $app->response->setBody($e);
    }
});

$app->post('/plan/classe', $authenticateWithRole('planificateur'), function() use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        
        $classe = new Classes;
        $classe->nom = $data['nom'];
        $classe->start = $data['start'];
        $classe->end = $data['end'];
        $classe->id_Users = $data['id_Users'];
        $classe->save();
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
		$app->response->setStatus(400);
        $app->response->setBody($e);
    }
});

$app->delete('/plan/classe/:id', $authenticateWithRole('planificateur'), function($id) use ($app) {
    try{
        $nbCours = Classes::where("id",$id)->has('cours')->count();
        if($nbCours == 0){
             Classes::find($id)->delete();
        }
        else{
            $app->response->headers->set('Content-Type', 'application/json');
            $app->response->setBody(json_encode(array("message"=>"Vous ne pouvez pas supprimer une classe avec des cours!")));
            $app->response->setStatus(400);
        }
		
    } catch(Exception $e) {
      $app->response->headers->set('Content-Type', 'application/json');
      $app->response->setStatus(400);
      $app->response->setBody($e);
    }
});
?>