/* Place your JavaScript in this file */

$(document).ready(function(){
	
	
	let maxid = 0;
	var arrdata= [];
	
	// for loading json to Array visit this url (https://stackoverflow.com/questions/33328779/javascript-jquery-push-json-objects-into-array)
	loaddata();
	
	
	var isaddnewcoin = 0;
	$('#btn_addcoin').click(function(){
		//$('#tbl_history tr:first').after('<tr><td></td><td></td><td></td><td></td><td></td></tr>');
		
		if(isaddnewcoin == 0){
			isaddnewcoin =1;
			$("#dv_addcoin").fadeIn();
			$(this).text("-");
		}else{
			isaddnewcoin =0;
			$("#dv_addcoin").fadeOut();
			$(this).text("+");
		}
	});
	
	$("#btn_insert").click(function(){
		//const fsdata = require('fs');
		
		var coinname = $("#txt_coinname").val();
		var orderdate = $("#txt_orderdate").val();
		var orderprice = $("#txt_orderprice").val();
		var orderamount = $("#txt_orderamount").val();
		var ordertotal = $("#txt_ordertotal").val();

		//fsdata.readFile('../database/data.json', function (err, data) {
			
		
			//var json = JSON.parse(data);
			// store original max id
			$.each(arrdata, function(i, item) {
				// store the max id
				if (parseInt(arrdata[i].id) > maxid) {
					maxid = parseInt(arrdata[i].id);
				}
			});
			maxid = maxid+1;
					
			arrdata.unshift({'id':maxid, 'clear_trade':'0',"detail":{
				"coint_type":coinname,
				"order_date":orderdate,
				"order_price":orderprice,
				"order_amount":orderamount,
				"total":ordertotal
			}});			
			
            $.ajax({
                type: 'POST',
                url: './model/insertjson.php',
                data: { insertdata: arrdata },
                dataType: "json",
                success: function(data){ 
                    
                    $("#spn_msg").text(data["msg"]);
                    $('#spn_msg').fadeIn('fast').delay(3000).fadeOut('fast');
                
                    loaddata();
                    $("#dv_addcoin").fadeOut();
                    isaddnewcoin =0;
                    $('#btn_addcoin').text("+");
                    clearcontrol();
                },
                error: function(objet,status,error){
                    console.log(objet);
                    console.log(status);
                    console.log(error);
                    alert('Erreur');
                }
            });			
			//fsdata.writeFile("../database/data.json", JSON.stringify(json))
		//})
	});

    function loaddata(){
        var result ="";
        $.getJSON("database/data.json", function(data) {
            /*
            [
                {
                "id":1,
                "detail":{
                        "coint_type":"BNB",
                        "order_date":"27 Jan 2025",
                        "order_price":"639.8692",
                        "order_amount":"0.1",
                        "total":"63.98692"
                        }

                },
            ]
            */
            // store database into array data;
            arrdata = data;
            
            
            $.each(data, function(i, item) {
                /*			
                //Example Data:
                // alert(data[i].id);
                // alert(data[i].detail["coint_type"]);									
                */
                // store the max id
                if (parseInt(data[i].id) > maxid) {
                    maxid = parseInt(data[i].id);
                }
                
                result += "<tr>";
                result += "<td>" + data[i].detail["coint_type"]+"</td>";
                result += "<td>" + data[i].detail["order_date"]+"</td>";
                result += "<td>" + data[i].detail["order_price"]+"</td>";
                result += "<td>" + data[i].detail["order_amount"]+"</td>";
                result += "<td>" + data[i].detail["total"]+"</td>";
                result += "</tr>";			
            });

            //jQuery delete all table rows except first
            $("#tbl_history").find("tr:gt(0)").remove();            
            
            $("#tbl_history").append(result);
            
        });
    }

    function clearcontrol(){
        $("#txt_coinname").val("");
		$("#txt_orderdate").val("");
		$("#txt_orderprice").val("");
		$("#txt_orderamount").val("");
		$("#txt_ordertotal").val("");

    }
});