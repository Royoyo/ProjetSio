<html>
<style type="text/css">
	table.agenda {
	  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
	  border-collapse: collapse;
	  width: 100%;
	}

	table.agenda td,
	table.agenda th, {
	  border: 1px solid #fff;
	  padding: 8px;
	  text-align: center;
	  width:16%;
	}


	table.agenda td {
	  padding-top: 12px;
	  padding-bottom: 12px;
	  background-color: #bcecff;
	  color: black;
	}

	table.agenda th {
	  background: #004b9f;
	  color: white;
	}
	table.agenda th:nth-child(0) {
	  background: #00739f;
	  color: white;
	}
</style>
<h1>I.F.I.D.E. : PLANNING <?php echo($classe->nom. " - Semaine " . $week) ?></h1>
<table class="agenda">
	<thead>
		<tr>
			<th>Semaine <?php echo($week) ?></th>
			<?php
				$count = 0;
				foreach($date as $day) {
					echo ("<th>" . $date_name[$count] . "<br>" . strftime('%d/%m', strtotime($day)) . "</th>");
					$count += 1;
				}
			?>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>
				8h<br>
				-<br>
				12h15
			</th>
			<?php
				foreach($cours_am as $cours) {
					if ($cours) {
						echo ("<td>" .
							$cours->matiere->nom . "<br>" . 
							$cours->user->lastName
						. "</td>");
					} else {
						echo ("<td></td>");
					}
				}
			?>
		</tr>
		<tr>
			<th>
				13h15<br>
				-<br>
				17h30
			</th>
			<?php
				foreach($cours_pm as $cours) {
					if ($cours) {
						echo ("<td>" .
							$cours->matiere->nom . "<br>" . 
							$cours->user->lastName
						. "</td>");
					} else {
						echo ("<td></td>");
					}
				}
			?>
		</tr>
	</tbody>
</table>
</html>