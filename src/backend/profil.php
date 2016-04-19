<?php
$app->post('/changePassword',$authenticateWithRole('enseignant'), function() use ($app) {
    $json = $app->request->getBody();
    $data = json_decode($json, true);
	if ($data['newPassword'] == $data['newPasswordConfirm']){
		$hash = uniqid(rand(),true);
		$newPassword = sha1($hash . sha1($data['newPassword']));
		Users::where('id',$_SESSION['id'])->update(['password' => $newPassword, 'hash' => $hash]);
		$app->response->setStatus(200);
	} else {
		$app->response->setStatus(400);
	}	
});

$app->post('/changeEmail',$authenticateWithRole('enseignant'), function() use ($app) {
    $json = $app->request->getBody();
    $data = json_decode($json, true);
	if ($data['newEmail'] == $data['newEmailConfirm']){
		Users::where('id',$_SESSION['id'])->update(['email' => $data['newEmail']]);
		$app->response->setStatus(200);
	} else {
		$app->response->setStatus(400);
	}
});
?>