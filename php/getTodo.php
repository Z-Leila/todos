<?php
$mysqli = new mysqli("localhost", "root", "root", "test");
$query = "SELECT * FROM `todos` ORDER by ID";
$result = $mysqli->query($query);
if( $row = $result->fetch_all(MYSQLI_ASSOC) ){
    echo json_encode($row);
}else{
    echo 'error';
}
?>
