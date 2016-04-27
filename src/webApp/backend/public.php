<?php

use Dompdf\Dompdf;

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
        if (date('Y-m-d', strtotime("now")) >= date('Y-m-d', strtotime("first day of august"))) {
            $year = date("Y", strtotime("now")) . "/" . date("Y", strtotime("next year"));
        } else {
            $year = date("Y", strtotime("last year")) . "/" . date("Y", strtotime("now"));
        }
    } else {
        if (date('Y-m-d', strtotime("now")) >= date('Y-m-d', strtotime("first day of august"))) {
            $year = date("Y", strtotime("next year")) . "/" . date("Y", strtotime("+2 year"));
        } else {
            $year = date("Y", strtotime("now")) . "/" . date("Y", strtotime("next year"));
        }
    }
    $year = array("year" => $year);
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($year));
});

$app->get('/plan/weeks/:current_next', function($current_next) use ($app) {
    $date = getStartEndByYear($current_next);
    $cours = Cours::whereRaw('(start >= ? AND end <= ?)', [$date['start'], $date['end']])->orderBy('start', 'ASC')->get();
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

$app->get('/plan/current_next_classe/:current_next', function($current_next) use ($app) {
    $date = getStartEndByYear($current_next);
    $classes = Classes::with('user')->whereRaw('(start >= ? and start <= ?) or (end >= ? and end <= ? )', [$date['start'], $date['end'], $date['start'], $date['end']])->get();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody($classes->toJson());
});