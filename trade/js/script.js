/* Place your JavaScript in this file */

$(document).ready(function(){
	console.log("test");
	
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
			
			
			
			
		});
	});
});