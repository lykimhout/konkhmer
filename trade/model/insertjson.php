
<?php
header('Access-Control-Allow-Origin: *');
$msg = array();
if (isset($_POST['insertdata'])){

    $insertdata = $_POST['insertdata'];
    $insertdata = json_encode($insertdata);
    file_put_contents('../database/data.json', $insertdata);

    $msg = array('success'=>'1', 'msg'=>'Data has been inserted successfully.');
     
    echo json_encode($msg);
    //file_put_contents('../database/data.json', $_POST['insertdata']);
}

?>