/* Place your JavaScript in this file */

$(document).ready(function(){
	var result ="";
	let maxid = 0;
	$.getJSON("https://lykimhout.github.io/konkhmer/trade/database/data.json", function(data) {
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
		
		$("#tbl_history").append(result);
		
	});
	
	var isaddnewcoin = 0;
	$('#btn_addcoin').click(function(){
		//$('#tbl_history tr:first').after('<tr><td></td><td></td><td></td><td></td><td></td></tr>');
		
		if(isaddnewcoin == 0){
			isaddnewcoin =1;
			$("#dv_addcoin").fadeIn();
			$(this).text="-";
		}else{
			$("#dv_addcoin").fadeOut();
			$(this).text="+";
		}
	});
});