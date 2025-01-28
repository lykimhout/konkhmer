/* Place your JavaScript in this file */


/*
function readJsonFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readJsonFile("https://lykimhout.github.io/konkhmer/trade/database/data.json", function(text){
    var data = JSON.parse(text);
    console.log(data);
    //alert(data[0].data);
    //var elem = document.getElementById("datadisplay");
    //elem.innerHTML = data.data['id']; //we want to read: "id": "123664" 
});
*/


$(document).ready(function(){
	console.log("test");
	
	$.getJSON("https://lykimhout.github.io/konkhmer/trade/database/data.json", function(json) {
		
	});
});