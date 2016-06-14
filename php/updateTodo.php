<?php
$mysqli = new mysqli('localhost','root','root','test');
$sql = "UPDATE `todos` SET `content` = '{$_GET['content']}' WHERE `id` = {$_GET['id']}";
if( $mysqli->query($sql) ){
    echo 'success';
}else{
    echo 'fail';
}
?>
