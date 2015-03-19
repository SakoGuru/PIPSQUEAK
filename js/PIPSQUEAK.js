
			var $ = require('jquery');					
			global.document = window.document;
			global.navigator = window.navigator;
			require('jquery-ui');
			
			var startLine;
			var endLine;
			var startTime;
			var endTime;
			var action;
			var media = './videos/nothing.webm';
			var code = 'dead code';
			$(document).ready(function(global){
				
				
				//create global variables
				
				var startLine,
						endLine,
				 		startTime,
						endTime, 
						dev = false;
				
				//create codemirror instance and add gutter marks
				
				var editor = CodeMirror.fromTextArea(document.getElementById("codearea"), {
					tabMode: 'indent',
					lineNumbers: true,
					lineWrapping: true,
					autoCloseTags: true,
					theme: 'vibrant-ink',
					matchBrackets: true,
					styleActiveLine: true,
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
				if(pip.doesExist('recoveryFile.js') === true) {
					if(confirm("PIPSQUEAK has detected that the recovery file is intact. Would you like to recover? (Note: selecting \'No\' will delete the recovery file)")) {
						squeak.recover();
					} else {
						pip.removeFile('recoveryFile.js');
					}
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

				$('#uploadCode').click(function() {
					
					if ($("#newCM").html() == "upload button clicked") {
						newCM.toTextArea(); //transfer current code mirror instance back to the textarea DOM element
					}
					else {
						editor.toTextArea(); //transfer current code mirror instance back to the textarea DOM element
					}
					$("#newCM").html("upload button clicked");
				
					$('#codearea').remove(); //remove the textarea DOM element
				});
				
				$('#durationModal').on('shown.bs.modal', function () {
					$('#dur').focus();
				})
				
				$('#annotateModal').on('shown.bs.modal', function () {
					$('#annotateLine').focus();
				})
				
				$('#myFile').click(function() {
					loadVideo();
				});
				
				$('#durationClose').click(function() {
					$("#error").html("");
					document.getElementById("durationForm").reset();
				});
				
				$('#durationSubmit').click(function() {
				
					var error = "";
					var dur = $("#dur").val();
					
					if ($.isNumeric(dur) != true) { //is input numeric
						error = "Error: please enter the number of seconds."
						$("#error").html(error);
						exit();
					}
					else if (dur > (Number(document.getElementById("totalTime").innerHTML) - Number(document.getElementById("currentTime").innerHTML))) {
						//is input less than time left in video
						error = "Error: duration entered exceeds length of film."
						$("#error").html(error);
						exit();
					}
					else {
						
						$("#durationModal").modal('hide');
						$("#error").html("");
						document.getElementById("durationForm").reset();
						action = $("#tool").html();
						startTime = $('#currentTime').html();
						startTime = Number(startTime);
						endTime = startTime + Number(dur);
						var doc;
						//begin get currently selected text from codemirror editor
						var test = $("#newCM").html();
						if (dev === true) console.log(test);
						if ($("#newCM").html() == "upload button clicked") {
								doc = newCM.getDoc();
						}
						else {
							doc = editor.getDoc(); //get the editor document
						}
						//var editText = doc.getSelection(); //get ALL selected text (save for later use)
						startLine = (doc.getCursor("head").line + 1); //get line of highlighted text that moves when you press shift+arrow (add 1 b/c it's an array)
						endLine = (doc.getCursor("anchor").line + 1);	//get line of highlighted text that stays the same (add 1 b/c it's an array)
						//end get selected text

						if(startLine > endLine){ //check if startLine is greater than endLine, if so switch the two
							var temp = startLine;
							startLine = endLine;
							endLine = temp;
						}

//************************************THIS IS WHERE WE SEND THE INFO TO THE BACK END************************************
						//var sendToBackend = [ startLine, " ", endLine, " ", startTime, " ", endTime, " ",action]; //print to test output
					
						//$("#printInfo").html(sendToBackend); //print to test output
						
						squeak.addAction( startLine, endLine, startTime, endTime, action );
						
					}
				
				});
				
				$("#highlight").click(function() {
				
					$("#tool").html("highlight");
					video.pause();
				
				});
				
				$("#focus").click(function() {
				
					$("#tool").html("focus");
					video.pause();
				
				});
				
				$("#fadeOut").click(function() {
				
					$("#tool").html("fadeOut");
					video.pause();
				
				});
				
				$("#fadeIn").click(function() {
				
					$("#tool").html("fadeIn");
					video.pause();
				
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
					
					if ($("#newCM").html() == "upload button clicked") {
							newCM.setGutterMarker(line, "annotation-gutter", makeMarker(src, typeGlyph));
					}
					else {
						editor.setGutterMarker(line, "annotation-gutter", makeMarker(src, typeGlyph));
					}
					
				});
				
				$("#strikethrough").click(function() {
				
					$("#tool").html("strike");
					video.pause();
				
				});
				
				$("#anchor").click(function() {
				
					$("#tool").html("anchor");
					video.pause();
				
				});
				
				$("#autoScroll").click(function() {
				
					$("#tool").html("autoScroll");
					video.pause();
				
				});
							
				$("#publish").click(function() {
					$("#printInfo").html("published");

					var doc;
					var test = $("#newCM").html();
					if (dev === true) console.log(test);
					if ($("#newCM").html() == "upload button clicked") {
						$("#printInfo2").html("published for the new editor");
						doc = newCM.getDoc();
					}
					else {
						$("#printInfo2").html("published from original editor");
						doc = editor.getDoc(); //get the editor document
					}
					
					doc.markText({line: 0, ch: 0}, {line: editor.lastLine() + 1, ch: 0}, {className: "codeMirror"});
					
					var pop = Popcorn( "#video" );
				
					pop.code({
						start: startTime,
						end: endTime,
						onStart: function( options ) {
							if (action == "fadeIn") {
								doc.markText({line: startLine - 1, ch: 0}, {line: endLine, ch: 0}, {className: "change"});
								$(".change").css({
									"font-size": "100%"
								});
							}
							else if (action == "fadeOut") {
								doc.markText({line: startLine - 1, ch: 0}, {line: endLine, ch: 0}, {className: "change"});
								$(".change").css({
									"font-size": "0%"
								});
							}
							else if (action == "focus") {
								$("#codeMirror").css({
									"font-size": "200%",
									"text-align": "center"
								});
								doc.markText({line: 0, ch: 0}, {line: startLine - 1, ch: 0}, {className: "change"});
								doc.markText({line: endLine, ch: 0}, {line: editor.lastLine() + 1, ch: 0}, {className: "change"});
								$(".change").css({
									"font-size": "0%"
								});
							}
							else {
								doc.markText({line: startLine - 1, ch: 0}, {line: endLine, ch: 0}, {className: action});							
							}
						},
						onEnd: function( options ) {
							if (action == "fadeIn") {
								doc.markText({line: startLine - 1, ch: 0}, {line: endLine, ch: 0}, {className: "change"});
								$(".change").css({
									"font-size": "0%"
								});
							}
							else if (action == "fadeOut") {
								doc.markText({line: startLine - 1, ch: 0}, {line: endLine, ch: 0}, {className: "change"});
								$(".change").css({
									"font-size": "100%"
								});		
							}
							else if (action == "focus") {
								doc.markText({line: 0, ch: 0}, {line: startLine - 1, ch: 0}, {className: "popReset"});
								doc.markText({line: endLine, ch: 0}, {line: editor.lastLine() + 1, ch: 0}, {className: "popReset"});
								$("#codeMirror").css({
									"font-size": "100%",
									"text-align": "left"
								});
							}
							else {
								doc.markText({line: startLine - 1, ch: 0}, {line: endLine, ch: 0}, {className: "popReset"});	
							}
						}
					});
					
					//for future maybe
					//maybe use "doc.setSelection" for autoscroll function
					// to append text to end of codemirror: "editor.replaceRange( text, { line: editor.lastLine() + 1, ch:0 });"
				
				});
				
				//testing stuff
				
				//popcornjs example not working (startTime and end Time variables not accessible here)
				//console.log(startTime);
				//console.log(endTime);
				//$("#test1").html("test area");
				//$("#test1").html(endTime);
				/*
				var pop = Popcorn( "#video" );
				
				pop.code({
					start: startTime,
					end: endTime,
					onStart: function( options ) {
						document.getElementById( "test1" ).innerHTML = "Start Popcornjs";
					},
					onEnd: function( options ) {
						document.getElementById( "test1" ).innerHTML = "Stop Popcornjs";
					}
				});
				*/	
			});

