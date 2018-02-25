<?php
header('Content-Type: application/json; charset=utf-8');

include('simple_html_dom.php');

require_once __DIR__.DIRECTORY_SEPARATOR.'vendor/autoload.php';

use juno_okyo\Chatfuel;

$urlA = "http://pusanjin.hs.kr/asp/food/FOOD_1001/main.html?siteid=pusanjinhs&boardid=food&uid=";
$urlB = "&pagemode=view";
$urlImage = "http://pusanjin.hs.kr";
$url="";
$chatfuel = new Chatfuel(TRUE);
if (isset($_GET['date']) && !empty($_GET['date'])){
  if (mb_strlen($_GET['date'], 'utf-8') == 8 && is_numeric($_GET['date'])){
    $url = $urlA.$_GET['date'].$urlB;
  } else {
    $chatfuel->sendText('입력해주신 날짜 정보가 잘못된 것 같아요... YYYYMMDD 형식인지 다시 확인해보세요! ex)'.date("Ymd"));
    return;
  }
} else {
  $url = $urlA.date("Ymd").$urlB;
}

//echo $url.'<br>';

//$html = file_get_html("http://pusanjin.hs.kr/asp/food/FOOD_1001/main.html?siteid=pusanjinhs&boardid=food&uid=20180205&pagemode=view");
$html = file_get_html($url);
//echo $html->find('img', 3)->src.'<br>';
//echo substr($_GET['date'], 0, 4)."년 ".substr($_GET['date'], 4, 2)."월 ".substr($_GET['date'], 6, 2)."일 점심은 ".iconv("EUC-KR","UTF-8",$html->find('tr td table tr td b', 0)->innertext)."입니다!";
//echo $html->find('img', 5)->src.'<br>';
//echo substr($_GET['date'], 0, 4)."년 ".substr($_GET['date'], 4, 2)."월 ".substr($_GET['date'], 6, 2)."일 저녁은 ".iconv("EUC-KR","UTF-8",$html->find('tr td table tr td b', 1)->innertext)."입니다!";

//$response_lunch_text = ['messages' => substr($_GET['date'], 0, 4)."년 ".substr($_GET['date'], 4, 2)."월 ".substr($_GET['date'], 6, 2)."일 점심은 ".iconv("EUC-KR","UTF-8",$html->find('tr td table tr td b', 0)->innertext . '<br>')."입니다!"];
//$response_dinner_text = ['messages' => substr($_GET['date'], 0, 4)."년 ".substr($_GET['date'], 4, 2)."월 ".substr($_GET['date'], 6, 2)."일 저녁은 ".iconv("EUC-KR","UTF-8",$html->find('tr td table tr td b', 1)->innertext . '<br>')."입니다!"];

$lunch = iconv("EUC-KR","UTF-8",$html->find('tr td table tr td b', 0)->innertext);
$dinner = iconv("EUC-KR","UTF-8",$html->find('tr td table tr td b', 1)->innertext);

if($lunch != ""){
  //$chatfuel->sendImage($urlImage.$html->find('img', 3)->src);
  //echo $urlImage.$html->find('img', 3)->src;
  $chatfuel->sendText(substr($_GET['date'], 0, 4)."년 ".substr($_GET['date'], 4, 2)."월 ".substr($_GET['date'], 6, 2)."일 점심은 ".$lunch."입니다!");
}

if($dinner != ""){
  //$chatfuel->sendImage($urlImage.$html->find('img', 5)->src);
  $chatfuel->sendText(substr($_GET['date'], 0, 4)."년 ".substr($_GET['date'], 4, 2)."월 ".substr($_GET['date'], 6, 2)."일 저녁은 ".$dinner."입니다!");
}

if($lunch == "" && $dinner == ""){
  $chatfuel->sendText('오늘은 급식이 없습니다.');
}

//$response[] = array("text" => $lunch);
//echo json_encode(array('messages'=>$response), JSON_UNESCAPED_UNICODE);


?>
