/* Place your JavaScript in this file */

$(document).ready(function(){
	$.getJSON("https://lykimhout.github.io/konkhmer/trade/js/script.js", function(json) {
		console.log(json); 
	});
});