/* Place your JavaScript in this file */

$(document).ready(function(){
	console.log("test");
	$.getJSON("https://lykimhout.github.io/konkhmer/trade/database/data.json", function(json) {
		console.log(json); 
	});
});