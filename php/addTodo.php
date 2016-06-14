<?php
  $mysqli = new mysqli('localhost','root','root','test');
  $sql = "INSERT INTO `todos` (`id`, `content`, `isDone`) VALUES ('{$_GET[id]}', '{$_GET[content]}', '{$_GET[isDone]}')";

  if( $mysqli->query($sql) ){
    echo $mysqli->insert_id;
  }else{
    echo 'fail';
  }
?>
