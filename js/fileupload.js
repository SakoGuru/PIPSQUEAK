var $ = require('jquery');					
			global.document = window.document;
			global.navigator = window.navigator;
			require('jquery-ui');

// Uploads user file and loads it into CodeMirror editor
function loadFile(input) {
	var editor = CodeMirror.fromTextArea(document.getElementById('codearea'), {
		mode: 'text/html',
		tabMode: 'indent',
		lineNumbers: true,
		lineWrapping: true,
		autoCloseTags: true
	});
	var reader = new FileReader();
	reader.onload = function(e) {
		editor.setValue(e.target.result);
	}
	reader.readAsText(input.files[0]);
}