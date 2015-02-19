			$(document).ready(function(){
				
				global.document = window.document;
				global.navigator = window.navigator;
				require('jquery');
				require('jquery-ui');				
				
				var editor = CodeMirror.fromTextArea(document.getElementById("codearea"), {
					lineNumbers: true,
					gutters: ["CodeMirror-linenumbers", "breakpoints"]
				});
				
				editor.on("gutterClick", function(cm, n) {
					var info = cm.lineInfo(n);
					cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
				});

				function makeMarker() {
					var marker = document.createElement("div");
					marker.style.color = "#822";
					marker.innerHTML = "*";
					return marker;
				}
				
				//end codemirror
				
				//jsfiddle code for grabbing current time from video
				
				$(function(){
					$('#currentTime').html($('#video_container').find('video').get(0).load());
					$('#currentTime').html($('#video_container').find('video').get(0).play());
				})
				setInterval(function(){
					$('#currentTime').html($('#video_container').find('video').get(0).currentTime);
					$('#totalTime').html($('#video_container').find('video').get(0).duration);  

				},500)
				
				//end jsfiddle 
				
				$("#dialog").dialog({
					autoOpen: false,
					show: {
						effect: "blind",
						duration: 1000
					},
					hide: {
						effect: "explode",
						duration: 1000
					}
				});
				
				function duration(){
				
					$("#dialog").dialog("option", "width", 600);
					$("#dialog").dialog("option", "title", "Hello!");
					$("#dialog").dialog("open");
				
				}
				
				var doc = editor.getDoc();
				var cursor = doc.getCursor(); //gets cursor location
				var line = doc.getLine(cursor.line); //grabs line cursor is on

				/*
				var startLine = doc.getCursor(start:"head");
				var endLine = codemirror.getCursor(false);
				
				editor.getSelectedRange = function() {
					return { from: doc.getCursor(true), to: doc.getCursor(false) };
				};
				
				var lines = editor.getSelectedRange;
				*/
				$("#answer").click(function() {
				
					var dur = $("#dur").val();
					var tool = $("#tool").html();
					var grabTime = $('#currentTime').html();
					
//************************************THIS IS THE VARIABLE TO SEND TO THE BACK END************************************
					var sendToBackend = [grabTime, tool, dur, line];
					
					$("#printInfo").html(sendToBackend);
				
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
				
			});

