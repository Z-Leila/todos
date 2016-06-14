<?php
$mysqli = new mysqli('localhost','root','root','test');
$sql = "DELETE FROM `todos` WHERE `id` = {$_GET['id']}";
if ( $r = $mysqli->query($sql) ){;
  echo 'success';
}else{
  echo 'fail';
}
?>
