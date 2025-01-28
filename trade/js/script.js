/* Place your JavaScript in this file */

$(document).ready(function(){
	$.getJSON("https://lykimhout.github.io/konkhmer/trade/database/data.json", function(json) {
		console.log(json); 
	});
});