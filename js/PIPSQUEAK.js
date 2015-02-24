			var $ = require('jquery');					
			global.document = window.document;
			global.navigator = window.navigator;
			require('jquery-ui');
			
			$(document).ready(function(global){
				
			
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
				$("#dialog").dialog({
					autoOpen: false
					/*show: {
						effect: "blind",
						duration: 1000
					},
					hide: {
						effect: "explode",
						duration: 1000
					}*/
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

