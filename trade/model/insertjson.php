
<?php
header('Access-Control-Allow-Origin: *');
$msg = array();
$action = @$_POST['action'];

//if (isset($_POST['insertdata'])){
if($action == "insertdata"){

    $insertdata = $_POST['data'];
    $insertdata = json_encode($insertdata);
    file_put_contents('../database/data.json', $insertdata);

    $msg = array('success'=>'1', 'msg'=>'Data has been inserted successfully.');
     
    echo json_encode($msg);
    //file_put_contents('../database/data.json', $_POST['insertdata']);
}else if ($action == "updatedata"){
    $updatedata = $_POST['data'];
    $updatedata = json_encode($updatedata);
    file_put_contents('../database/data.json', $updatedata);

    $msg = array('success'=>'1', 'msg'=>'Data has been update successfully.');
     
    echo json_encode($msg);
    //file_put_contents('../database/data.json', $_POST['insertdata']);
}

?>