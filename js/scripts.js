/* Place your JavaScript in this file */

$(document).ready(function(){
	$("button").click(function(){
		var tmptext = $("#txt_text").val();
		tmptext = tmptext.replace(/\u200B/g,''); // chunk and remove all zero space

		$("#txt_text").val("");
		$("#txt_text").val(tmptext);
	});
  
  $("#txt_text").on("paste",function(){
		var elem = $(this);

		setTimeout(function() {
			// gets the copied text after a specified time (100 milliseconds)
			var text = elem.val();
			
			if(text.length == 0) return;
			
			text = text.replace(/\u200B/g,''); // chunk and remove all zero space
			text = text.replace(/\￼/g,''); // chunk and remove all zero space
			text = text.replaceAll('*',''); // chunk and remove all *
			text = text.replaceAll('Cr.รูปภาพ อีสานบ้านนา',''); // chunk and remove all zero space
			text = text.replaceAll('Cr.รูปภาพ วิชา วันนี้',''); // chunk and remove all zero space
			text = text.replaceAll('Cr.รูปภาพ มาดูวิชา 365',''); // chunk and remove all zero space
			
			text = text.replaceAll('0','๐');
			text = text.replaceAll('1','๑');
			text = text.replaceAll('2','๒');
			text = text.replaceAll('3','๓');
			text = text.replaceAll('4','๔');
			text = text.replaceAll('5','๕');
			text = text.replaceAll('6','๖');
			text = text.replaceAll('7','๗');
			text = text.replaceAll('8','๘');
			text = text.replaceAll('9','๙');
			
			
			// Add/Remove zero with space
			if ($('#chb_addzs').is(':checked')) {
				text = chunkText(text,2); // chunk zero content
			}
			// Add/Remove lao char
			if ($("#chb_chklao").is(':checked')){
				text = chunkCharWithLaoChar(text); // chunk zero content
			}else if ($("#chb_chkrmlao").is(':checked')){
				text = chunkCharWithLaoChar(text,1);
			}
			// Add ￼ to content
			if($('#chb_OBJ').is(':checked')) {
				text = chunkText(text,30,"￼"); // chunk add OBJ char code content
			}

			text = text.trim();
			elem.val(text);

			var post = document.createElement('p');
			post.textContent = elem.val();
			post.innerHTML = post.innerHTML.replace(/\n/g, '<br>');
			var showzerowithspace = post.innerHTML.replace(/\u200B/g,'<span style="color:red;">•</span>');
			$("#spnresult span").html(showzerowithspace);
			
			// Start to select all content and make copy
			elem.focus();
			elem.select();
			elem.scrollTop(0);
			document.execCommand('copy');
			$("#hmessage").fadeIn();
			$("#spnresult").fadeIn();
			
			setTimeout(function() {
				elem.val('');
				$("#spnresult span").html('');
				elem.focus();
				$("#hmessage").fadeOut();
				$("#spnresult").fadeOut();
			}, 5000); //End timer
		}, 200); //End timer
	});
	
	
	function chunkText(str, objRandNumChar=1, objCharCode = "​") {
		
		var ret = [];
		var i;
		var len;

		// 3 is the start number
		// 7 is the number of possible results (3 + start (7) - end (3))

		var rndCharacter = Math.floor(Math.random() * 7) + objRandNumChar;
		var tmpRnd = rndCharacter;
		
		var result = "";
		var consonant = ["a","b", "c", "d", "e", "f", "g","h", "i", "j", "k","l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z","ก", "ข", "ฃ", "ค", "ฅ", "ฆ", "ง", "จ", "ฉ", "ช", "ซ", "ฌ", "ญ", "ฎ", "ฏ", "ฐ", "ฑ", "ฒ", "ณ", "ด", "ต", "ถ", "ท", "ธ", "น", "บ", "ป", "ผ", "ฝ", "พ", "ฟ", "ภ", "ม", "ย", "ร", "ล", "ว", "ศ", "ษ", "ส", "ห", "ฬ", "อ", "ฮ"];
		
		var vowel = ["ะ", " ั", " ็", "า", " ิ", " ่", " ่ ่", " ํ", " ุ", " ู", "เ", "ใ", "ไ", "โ", "อ", "ย", "ว", "ฤ", "ฦ", "ำ", "้","แ"];
		var tmphastage = false;
		for (i = 0, len = str.length; i < len; i += tmpRnd) {
			// get the trim current content in loop
			var prefixChar = str.substr(i-1,1);
			var currentCharacter = str.substr(i, 1);
			
			// if the last characters is consonent then add zero space
			if (vowel.indexOf(prefixChar.toLowerCase()) < 0 && consonant.indexOf(currentCharacter.toLowerCase()) >= 0) {
				result += objCharCode + str.substr(i, rndCharacter);
			} else {
				result += str.substr(i, rndCharacter);
			}
		
			tmpRnd = rndCharacter;
			rndCharacter = Math.floor(Math.random() * 6) + objRandNumChar;
		}
		// Let's find hashtag
		const hashtags = []
		if (result.length){
			let preHashtags = result.split('#');
			let i = 0;
			if (result[0] !== '#') i++;
			// find hashtag to be stored for next time
			for (null; i < preHashtags.length; i++) {
				let item = preHashtags[i];
				// String.prototype.split() is needed to sort out non-hashtag related string data
				item = '#' + item.split(' ')[0];
				hashtags.push(item);
				// find match hashtag from result and replace with hastage with no zero space
				result = result.replace(item,item.replace(/\u200B/g,''));
			}
		}
    
		return result;
	}  
  
	$('#btnpaste').click(function(){
		navigator.clipboard.readText().then(text => {
			// use text as a variable, here text = 'clipboard text'
			$('#txt_text').val(text);
			$('#txt_text').trigger('paste');
		});
	});
	
	$("#txt_text").focus(function() {
		var $this = $(this);
		$this.select();

		// Work around Chrome's little problem
		$this.mouseup(function() {
			// Prevent further mouseup intervention
			$this.unbind("mouseup");
			return false;
		});
	});
	
	$('#chb_addzs').on('change', function() {		
		onoffchbox("chb_removesp");
	});
	$('#chb_removesp').on('change', function() {		
		onoffchbox("chb_addzs");
	});
	
	$('#chb_chklao').on('change', function() {		
		onoffchbox("chb_chkrmlao");
	});

	$('#chb_chkrmlao').on('change', function() {		
		onoffchbox("chb_chklao");
	});
	
	function onoffchbox(obj1){
		$('#'+obj1).prop('checked', false);  
	}

	function chunkCharWithLaoChar(str, removelao = 0) {
		var i; 

		var result = "";
		var vowel = ["ิ","ี","ื","ึ","ะ", "ั","๋", "็", " ิ", " ่", " ่ ่", " ํ", "ุ", 
					 "ู",  "ฤ", 
					 "ฦ", "ำ","่า", "้","์","่"];

		var ThaiLaoConsonant = {"จ":"ຈ","บ":"ບ","ป":"ປ","เ":"ເ","แ":"ແ","ไ":"ໄ",
							"ย":"ຍ","พ":"ພ","ฟ":"ຟ","ม":"ມ",
							"ถ":"ຄ","ฮ": "ອ","ะ":"ະ"};

		if(removelao == 1){
			ThaiLaoConsonant = {"ຈ":"จ","ບ":"บ","ປ":"ป","ເ":"เ","ແ":"แ","ໄ":"ไ",
							"ຍ":"ย","ພ":"พ","ຟ":"ฟ","ມ":"ม",
							"ຄ":"ถ","ອ": "ฮ","ະ":"ะ"};
		}

		for (i = 0; i < str.length; i++) {
			var currentCharacter = str.substr(i, 1);
			var nextCharacter = str.substr(i+1,1);
			if(getObjKey(ThaiLaoConsonant, currentCharacter)){
				  // Found a vowel in the next char
				 if(vowel.indexOf(nextCharacter) >= 0){
					result += currentCharacter;                
				 }else{
				   result += ThaiLaoConsonant[currentCharacter];
				 }
			}else{
				result += currentCharacter;
			}
		}
		return result;
	}

	function getObjKey(obj, keyName, value) {
		if (Object.keys(obj).indexOf(keyName) !== -1) {
			return true;
		} else{
			return false;
		}
	}

	$('#spnresult').click(function(event) { event.preventDefault(); });
});