<?php
  if(empty($_GET['name']) || empty($_GET['grade']) || empty($_GET['course'])){//check if you have all the data you need from the client-side call.  This should include the fields being changed and the ID of the student to be changed
	$output['errors'] = 'missing data';//if not, add an appropriate error to errors
}

$likes = $_GET['likes'];
$comments = $_GET['comments'];
$audioId = $_GET['audio_id'];

$query = "UPDATE `user_feedback` SET `id`=$id, `name`=$name, `grade`=$grade, `course_name`=$course_name WHERE `id`=$id";
//write a query that updates the data at the given student ID.  
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn, $query);


if(empty($result)){//check if $result is empty.  
	$output['errors'] = 'database error';//if it is, add 'database error' to errors
}else {//else: 
	if(mysqli_affected_rows($conn)){//check if the number of affected rows is 1.  Please note that if the data updated is EXCACTLY the same as the original data, it will show a result of 0
		$output['success'] = true;//if it did, change output success to true
	}else {//if not, add to the errors: 'update error'
		$output['errors'] = 'update error';
	}
}
?>