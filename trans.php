<?php
$json = file_get_contents('http://jin.rf.gd/meal.php?date='.$_GET['date']);
echo $json;
?>
