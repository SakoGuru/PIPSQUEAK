var $ = require('jquery');					
			global.document = window.document;
			global.navigator = window.navigator;
			require('jquery-ui');
			
// Uploads user file and loads it into CodeMirror editor
function loadFile(input) {

	$('#wrappingDiv').append("<textarea id='codearea' name='codearea'></textarea> "); //add new textarea DOM element
	
	var editor = CodeMirror.fromTextArea(document.getElementById('codearea'), {
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
	}
	reader.readAsText(input.files[0]);
	
	//transfer new codemirror instance back to PIPSQUEAK.js
	$('#codearea').data('CodeMirrorInstance', editor); //save new editor and name it CodeMirrorInstance
	newCM = $('#codearea').data('CodeMirrorInstance'); //put new editor in global javascript variable to be accessed in PIPSQUEAK.js
	
}

// Uploads user video file and loads it into video player
function loadVideo(oldVid) {
	var fullPath = document.getElementById("myFile").value;
	if (oldVid != null) fullPath = oldVid;
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
	player.load();
	player.play(); 
}