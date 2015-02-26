
			var $ = require('jquery');					
			global.document = window.document;
			global.navigator = window.navigator;
			require('jquery-ui');
			
			$(document).ready(function(global){
				
				//create codemirror instance and add gutter marks
			
				var editor = CodeMirror.fromTextArea(document.getElementById("codearea"), {
					lineNumbers: true,
					gutters: ["CodeMirror-linenumbers", "annotation-gutter"]
				});
				
				/*editor.on("gutterClick", function(cm, n) {
					var info = cm.lineInfo(n);
					cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
				});*/
				
				editor.on("gutterContextMenu", function(cm, n) {
					var info = cm.lineInfo(n);
					cm.setGutterMarker(n, "annotation-gutter", info.gutterMarkers ? null : makeMarker());
				});

				function makeMarker(src, type) {
					var marker = document.createElement("div");
					marker.style.color = "#822";
					marker.innerHTML = "<a href=" + src + "><span class='glyphicon glyphicon-" + type + "'></span></a>";
					return marker;
				}
				
				//end codemirror
				
				//jsfiddle code for grabbing current time from video
				
				$(function(){
					$('#currentTime').html($('#video_container').find('video').get(0).load());
					//$('#currentTime').html($('#video_container').find('video').get(0).play());
				});
				setInterval(function(){
					$('#currentTime').html($('#video_container').find('video').get(0).currentTime);
					$('#totalTime').html($('#video_container').find('video').get(0).duration);  

				},500);
				
				//end jsfiddle 
				
				$("#dialog").dialog({ //configuring dialog box options
					/*
					autoOpen: false,
					show: {
						effect: "blind",
						duration: 1000
					},
					hide: {
						effect: "explode",
						duration: 1000
					}
					*/
				});
				
				
				function duration(){ //all code editing functions call this to open dialog box and get duration from user input
				
					video.pause();
					$("#dialog").dialog("option", "width", 600);
					$("#dialog").dialog("option", "title", "Hello!");
					$("#dialog").dialog("open");
				
				}
				
				$("#answer").click(function() { //perform checks on user input and give (current time, tool, duration, and text to edit) to backend
				
					var error = "";
					var dur = $("#dur").val();
					
					if ($.isNumeric(dur) != true) { //is input numeric
						error = "Error: please enter the number of seconds."
						$("#printInfo").html(error);
						exit();
					}
					else if (dur > (Number(document.getElementById("totalTime").innerHTML) - Number(document.getElementById("currentTime").innerHTML))) {
						//is input less than time left in video
						error = "Error: duration entered exceeds length of film."
						$("#printInfo").html(error);
						exit();
					}
					else {
						$("#dialog").dialog("close");
						var action = $("#tool").html();
						var startTime = $('#currentTime').html();
						startTime = Number(startTime);
						var endTime = startTime + Number(dur);
						//get currently selected text from codemirror editor
						var doc = editor.getDoc(); //get the editor document
						//var editText = doc.getSelection(); //get ALL selected text
						var startLine = (doc.getCursor("head").line + 1); //get line of highlighted text that moves when you press shift+arrow (add 1 b/c it's an array)
						var endLine = (doc.getCursor("anchor").line + 1);	//get line of highlighted text that stays the same (add 1 b/c it's an array)
						
						if(startLine > endLine){ //check if startLine is greater than endLine, if so switch the two
							var temp = startLine;
							startLine = endLine;
							endLine = temp;
						}

//************************************THIS IS THE VARIABLE TO SEND TO THE BACK END************************************
						//var sendToBackend = [ startLine, " ", endLine, " ", startTime, " ", endTime, " ",action]; //print to test output
					
						//$("#printInfo").html(sendToBackend); //print to test output
						
						squeak.addAction( startLine, endLine, startTime, endTime, action );
						
					}
				
				});
				
				$("#highlight").click(function() {
				
					$("#tool").html("highlight");
					duration();
				
				});
				
				$("#focus").click(function() {
				
					$("#tool").html("focus");
					duration();
				
				});
				
				$("#fade").click(function() {
				
					$("#tool").html("fade");
					duration();
				
				});
				
				$("#upload").click(function() {
				
					$("#printInfo").html("upload");
					
				});
				
				$('#annotateDropMenu li a').click(function() {
					var selText = $(this).text();
					$('#annotateType').html(selText+' <span class="caret"></span>');
					$('#annotateType').val(selText);
				});
				
				$('#annotateSubmit').click(function() {
					$('#annotateModal').modal('hide');
					
					var line = parseInt($('#annotateLine').val()) - 1;
					var src = $('#annotateSource').val();
					var type = $('#annotateType').val();
					var sendToBackend = [line, src, type];
					
					var typeGlyph = "info-sign";
					if (type == "Video") {
						typeGlyph = "facetime-video";
					} else if (type == "Picture") {
						typeGlyph = "picture";
					} else if (type == "Article") {
						typeGlyph = "book";
					}
					editor.setGutterMarker(line, "annotation-gutter", makeMarker(src, typeGlyph));
				});
				
			});

