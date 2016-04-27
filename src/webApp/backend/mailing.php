<?php
// Create Transport
$transport = Swift_SmtpTransport::newInstance('10.0.0.3', 465, 'ssl')
    ->setUsername('')
    ->setPassword('');

// Create Mailer with our Transport.
$mailer = Swift_Mailer::newInstance($transport);

function mailAssignationCours($cours, $mailer){


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
        'user_firstname' => $cours->user->firstName,
        'user_lastname' => $cours->user->lastName,
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
    $message = Swift_Message::newInstance('Assignation d\'un cours à IFIDE SupFormation')
        ->setFrom(array('test.ifide@gmail.com' => 'IFIDE SupFormation'))
        ->setTo(array($cours->user->email => $cours->user->firstName + '' + $cours->user->lastName))
        ->setBody($template, "text/html")
        ->setContentType("text/html");

    // envoie
    $results = $mailer->send($message);
}

function mailAnnulationCours($cours, $mailer){

	// Conversion date pour extraire Date de Heure séparement
    $dt_start = new DateTime($cours->start);
    $dt_end = new DateTime($cours->end);

    // Extraction date et heure
    $date = $dt_start->format('d/m/Y');
    $time_start = $dt_start->format('H:i:s');
    $time_end = $dt_end->format('H:i:s');

    // Liste variable a utilisé dans le template
    $list_var = array(
        'user_firstname' => $cours->user->firstName,
        'user_lastname' => $cours->user->lastName,
        'cours_date' => $date,
        'cours_start' => $time_start,
        'cours_end' => $time_end
    );

    $template = file_get_contents("templates/suppression_cours.html", FILE_TEXT);

    // ajout des valeur des variables dans le template
    foreach($list_var as $cle => $valeur) {
        $template = str_replace('{{ '.$cle.' }}', $valeur, $template);
    }

    // ajout du header pour responsive, css ...
    $template = file_get_contents("templates/header.html", FILE_TEXT) . $template;

    // creation du mail
    $message = Swift_Message::newInstance('Suppression d\'un de vos cours à IFIDE SupFormation')
        ->setFrom(array('test.ifide@gmail.com' => 'IFIDE SupFormation'))
        ->setTo(array($cours->user->email => $cours->user->firstName + '' + $cours->user->lastName))
        ->setBody($template, "text/html")
        ->setContentType("text/html");

    // envoie
    $results = $mailer->send($message);
}
	
?>