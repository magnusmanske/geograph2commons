<?PHP

$server = $_REQUEST['server'] ;
$photo_id = $_REQUEST['photo_id'] ;
$s = array() ;
$s['main'] = file_get_contents ( "http://$server/photo/$photo_id" ) ;
$s['reuse'] = file_get_contents ( "http://$server/reuse.php?id=$photo_id" ) ;
header('Content-type: application/json');
print json_encode ( $s ) ;

?>
