var $ = require('jquery');					
			global.document = window.document;
			global.navigator = window.navigator;
			require('jquery-ui');
			
// Uploads user file and loads it into CodeMirror editor
function loadFile(input) {

	$('#wrappingDiv').remove(); //remove the textarea DOM element
	$('#wrapHouse').append("<div id='wrappingDiv'></div>"); //add new textarea DOM element
	$('#wrappingDiv').append("<textarea id='codearea' name='codearea'>" + e + "</textarea> "); //add new textarea DOM element
	
	editor = CodeMirror.fromTextArea(document.getElementById('codearea'), {
		tabMode: 'indent',
		lineNumbers: true,
		lineWrapping: true,
		autoCloseTags: true,
		theme: 'vibrant-ink',
		matchBrackets: true,
		styleActiveLine: true,
		gutters: ["CodeMirror-linenumbers", "annotation-gutter"]
	});

	var reader = new FileReader();
	reader.onload = function(e) {
		editor.setValue(e.target.result);
		code = e.target.result;
		code = (String (code)).replace(/'/g, "\"");
		//squeak.saveFile(media,code);
	}


	reader.readAsText(input.files[0]);
	
	$("#printInfo").html("new code");
	
	//transfer new codemirror instance back to PIPSQUEAK.js
	$('#codearea').data('CodeMirrorInstance', editor); //save new editor and name it CodeMirrorInstance
	newCmInstance = $('#codearea').data('CodeMirrorInstance'); //put new editor in global javascript variable to be accessed in PIPSQUEAK.js
	
}

// Uploads user video file and loads it into video player
function loadVideo(oldVid) {

	var fullPath = document.getElementById("myVidFile").value;
	var vidExt = fullPath.split('.').pop();
	
	//check for acceptable video types
	if (vidExt == "webm" || vidExt == "ogv"){ //testing plan also includes || vidExt == "mkt"  || vidExt == "wav"
		console.log("video file type is acceptable");
	}
	else if (vidExt == ""){
		console.log("video upload was cancelled");
		return;
	}
	else{
		alert("Please select one of the following types of files: webm, ogv"); //testing plan also includes mkt, or wav
		throw "Incorrect filetype.";
	}
	//end check for acceptable video types
	
	if (oldVid != null) fullPath = oldVid; //note: oldVid is always null
	media = fullPath;
	if (fullPath) {
		var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		var filename = fullPath.substring(startIndex);
		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
		}
	}
	
	var player = document.getElementById("video");
	var webmvid = document.getElementById("webm");
	var ogvvid = document.getElementById("ogv");

	$(webmvid).attr('src', fullPath);
	$(ogvvid).attr('src', fullPath);
	$(webmvid).attr('autoplay', false);
	$(ogvvid).attr('autoplay', false);
	player.load();
	//squeak.saveFile(media, code);
	
}