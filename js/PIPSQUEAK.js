
var $ = require('jquery');					
global.document = window.document;
global.navigator = window.navigator;
require('jquery-ui');
var gui = require('nw.gui');

var startLine;
var endLine;
var startTime;
var endTime;
var action;
var media = './videos/nothing.webm';
var code = 'dead code';

var entityMap = {
"&": "&amp;",
"<": "&lt;",
">": "&gt;",
'"': '&quot;',
"'": '&#39;',
"/": '&#x2F;'
};

function escapeHtml(string) {
return String(string).replace(/[&<>"'\/]/g, function (s) {
return entityMap[s];
});
}

profComments = [];		
annotateLineNum = 0;

$(document).ready(function(global){

	//create global variables

	var startLine,
			endLine,
			startTime,
			endTime, 
			dev = false;

	//so pressing enter to submit doesn't break the page		
	$(document).ready(function() {
		$(window).keydown(function(event){
			if(event.keyCode == 13) {
				event.preventDefault();
				$('#durationSubmit').click();
			}
		});
	});
			

	//create codemirror instance and add gutter marks

	editor = CodeMirror.fromTextArea(document.getElementById("codearea"), {
		tabMode: 'indent',
		lineNumbers: true,
		lineWrapping: true,
		autoCloseTags: true,
		theme: 'vibrant-ink',
		matchBrackets: true,
		styleActiveLine: true,
		gutters: ["CodeMirror-linenumbers", "annotation-gutter"]
	});

	if(pip.doesExist('recoveryFile.pipsqueak') === true) {
		if(confirm("PIPSQUEAK has detected that the recovery file is intact. Would you like to recover? (Note: selecting \'No\' will delete the recovery file)")) {
			squeak.recover();
		} else {
			pip.removeFile('recoveryFile.pipsqueak');
		}
	}
	//end codemirror

	//jsfiddle code for grabbing current time from video

	$(function(){
		$('#currentTime').html($('#video_container').find('video').get(0).load());
	});
	setInterval(function(){
		$('#currentTime').html($('#video_container').find('video').get(0).currentTime);
		$('#totalTime').html($('#video_container').find('video').get(0).duration);  

	},500);

	//end jsfiddle 
	
	$('#uploadVid').click(function() {
		video.pause();
	});

	$('#uploadCode').click(function() {
		video.pause();
		var c = $("#codearea").html();
		
		if ($("#newCM").html() === "upload button clicked") {

			if(typeof newCmInstance === "undefined") {
				console.log("newCmInstance is undefined");
			}
			else {
				e = escapeHtml(newCmInstance.getValue());

				newCmInstance.toTextArea();
				$('#codearea').remove(); //remove the textarea DOM element
				var d = $("#codearea").html();

				if (typeof d === "undefined") {

				$('#wrappingDiv').remove(); //remove the textarea DOM element
				$('#wrapHouse').append("<div id='wrappingDiv'></div>"); //add new textarea DOM element
				$('#wrappingDiv').append("<textarea id='codearea' name='codearea'>" + e + "</textarea> "); //add new textarea DOM element
					editor = CodeMirror.fromTextArea(document.getElementById("codearea"), {
						tabMode: 'indent',
						lineNumbers: true,
						lineWrapping: true,
						autoCloseTags: true,
						theme: 'vibrant-ink',
						matchBrackets: true,
						styleActiveLine: true,
						gutters: ["CodeMirror-linenumbers", "annotation-gutter"]
					});
					
					$('#codearea').data('CodeMirrorInstance', editor); //save new editor and name it CodeMirrorInstance
					newCmInstance = $('#codearea').data('CodeMirrorInstance'); //put new editor in global javascript variable to be accessed in PIPSQUEAK.js
					
				}
			}
			
		}
		else {

			if(typeof editor === "undefined") {
				console.log("editor is undefined");
			}
			else {
				e = editor.getValue();

				editor.toTextArea();
				$('#codearea').remove(); //remove the textarea DOM element
				var d = $("#codearea").html();

				if (typeof d === "undefined") {

					$('#wrappingDiv').append("<textarea id='codearea' name='codearea'>" + c + "</textarea> "); //add new textarea DOM element
					editor = CodeMirror.fromTextArea(document.getElementById("codearea"), {
						tabMode: 'indent',
						lineNumbers: true,
						lineWrapping: true,
						autoCloseTags: true,
						theme: 'vibrant-ink',
						matchBrackets: true,
						styleActiveLine: true,
						gutters: ["CodeMirror-linenumbers", "annotation-gutter"]
					});
					
					$('#codearea').data('CodeMirrorInstance', editor); //save new editor and name it CodeMirrorInstance
					newCmInstance = $('#codearea').data('CodeMirrorInstance'); //put new editor in global javascript variable to be accessed in PIPSQUEAK.js
					
				}
			}
		}

		$("#newCM").html("upload button clicked");
		$("#printInfo").html("reset");

		$('#codearea').remove(); //remove the textarea DOM element
		
	});

	var codesize = $(".codeSizer").height();

	$(".videoSizer").height(codesize);

	$('#durationModal').on('shown.bs.modal', function () {
		$("#error").html("");
		$('#dur').focus();
	})

	$('#annotateModal').on('shown.bs.modal', function () {
		$('#annotateLine').focus();
	})
	
	$('#autoScrollModal').on('shown.bs.modal', function () {
		$('#autoScrollLine').focus();
	})

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
			return;
		}
		else if (dur > (Number(document.getElementById("totalTime").innerHTML) - Number(document.getElementById("currentTime").innerHTML))) {
			//is input less than time left in video
			error = "Error: duration entered exceeds length of film."
			$("#error").html(error);
			return;
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
					doc = newCmInstance.getDoc();
			}
			else {
				doc = editor.getDoc(); //get the editor document
			}
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
		$("#error").html("");
		$("#tool").html("highlight");
		video.pause();
	});
					
	$("#focus").click(function() {
		$("#error").html("");
		$("#tool").html("focus");
		video.pause();
	});

	$("#fade").click(function() {
		$("#error").html("");
		$("#tool").html("fade");
		video.pause();
	});
	
	$("#autoScroll").click(function() {
		video.pause();
		$("#autoScrollError").html("");
	});

	$("#annotate").click(function() {
		video.pause();
		$("#annotateError").html("");
	});
	
	$('#autoScrollSubmit').click(function() {

		var autoScrollNum = parseInt($('#autoScrollLine').val());
		var error = "";
		
		if ($.isNumeric(autoScrollNum) != true) { //is input numeric
			error = "Error: please enter number of line to scroll to."
			$("#autoScrollError").html(error);
			return;
		}

		if ($("#newCM").html() == "upload button clicked") {
			if (autoScrollNum > newCmInstance.lineCount() || autoScrollNum < 1) {					//check if user entered line is in editor
				error = "Error: Please choose a line between 1 and " + newCmInstance.lineCount() + ".";
				$("#autoScrollError").html(error);	
				return;
			}
			else {

				$('#autoScrollModal').modal('hide');
				$("#autoScrollError").html("");
			}
		}
		else {
			if (autoScrollNum > editor.lineCount() || autoScrollNum < 1) {					//check if user entered line is in editor
				error = "Error: Please choose a line between 1 and " + editor.lineCount() + ".";
				$("#autoScrollError").html(error);
				return;
			}
			else {

				$('#autoScrollModal').modal('hide');
				$("#autoScrollError").html("");
			}
		}
		
		action = "scroll";
		startLine = autoScrollNum;
		endLine = autoScrollNum;
		startTime = $('#currentTime').html();
		startTime = Number(startTime);
		endTime = (startTime + 1);

		squeak.addAction( startLine, endLine, startTime, endTime, action );
	});

	$('#annotateSubmit').click(function() {
		
		annotateLineNum = parseInt($('#annotateLine').val());
		var error = "";
		
		if ($.isNumeric(annotateLineNum) != true) { //is input numeric
			error = "Error: please enter number of line to annotate."
			$("#annotateError").html(error);
			return;
		}

		if(typeof profComments[annotateLineNum] === 'undefined'){ //check if there is already a comment on the line
			//console.log("we are good to go annotating this line");
		}
		else{
			error = "Error: Remove previous comment from line " + annotateLineNum + " to continue.";
			$("#annotateError").html(error);
			return;
		}

		if ($("#newCM").html() == "upload button clicked") {
			if (annotateLineNum > newCmInstance.lineCount() || annotateLineNum < 1) {					//check if user entered line is in editor
				error = "Error: Please choose a line between 1 and " + newCmInstance.lineCount() + ".";
				$("#annotateError").html(error);	
				return;
			}
			else {

				$('#annotateModal').modal('hide');
				$("#annotateError").html("");
			}
		}
		else {
			if (annotateLineNum > editor.lineCount() || annotateLineNum < 1) {					//check if user entered line is in editor
				error = "Error: Please choose a line between 1 and " + editor.lineCount() + ".";
				$("#annotateError").html(error);
				return;
			}
			else {

				$('#annotateModal').modal('hide');
				$("#annotateError").html("");
			}
		}

		//add professor comment to global variable to write into pop.js

		$("#annotateCommentContent").html(profComments[annotateLineNum]);

		
		action = "annotate";
		startLine = annotateLineNum;
		endLine = annotateLineNum;
		startTime = $('#currentTime').html();
		startTime = Number(startTime);
		endTime = $('#totalTime').html();
		endTime = Number(endTime);

		squeak.addAction( startLine, endLine, startTime, endTime, action );
	});

	$("#strikethrough").click(function() {
		$("#error").html("");
		$("#tool").html("strikethrough");
		video.pause();
	});

	$("#collapse").click(function() {
		$("#error").html("");
		$("#tool").html("collapse");
		video.pause();
	});
				
	$("#publish").click(function() {
		video.pause();
		$("#printInfo").html("published");

		var doc;
		
		var test = $("#newCM").html();
		if (dev === true) console.log(test);
		
		if ($("#newCM").html() == "upload button clicked") {
			$("#printInfo2").html("published for the new editor");
			doc = newCmInstance.getDoc();
		}
		else {
			$("#printInfo2").html("published from original editor");
			doc = editor.getDoc(); //get the editor document
		}
		
		//get codemirror lines into <p> tags
			
			var numLines = doc.lineCount();
			var lines = [];
			var i;
			var firstPTag = "<span id='line";
			var lastPTag = "</span>";
			lines[0] = "\n\t\t\t\t\t<pre id='codearea_pretty' class='prettyprint linenums' style='min-height: 370px; max-height: 370px; overflow-y: scroll; overflow-x: scroll;'><code>";
			for (i = 0; i < numLines; i++) {
				lines[i+1] = firstPTag + (i + 1) + "'>" + escapeHtml(doc.getLine(i)) + lastPTag + '\n';
			}
			lines[numLines+1] = "</code></pre>\n";
		
			
		//end get codemirror lines into <p> tags
		
		squeak.publish(media, lines);
		
		doc.markText({line: 0, ch: 0}, {line: editor.lastLine() + 1, ch: 0}, {className: "codeMirror"});
		
		

	});
				
});


/*-----------------------------------------------------------------------------
-------------------------------------------------------------------------------

				Begin PIP

-------------------------------------------------------------------------------
-----------------------------------------------------------------------------*/

//(c) Scott G Gavin, PIPSQUEAK - 01/28/2015
/*jslint node: true */


var pip = (function() {
//this probably needs to be namespaced before too long, prevent collisions
    var http = require('http'),
            fs = require('fs'),
            pub = {};
    //this function prints the indicated directory, indicates items within a directory under the directory's name and leveled with 4 spaces
    pub.printDir = function(directory, level, out) {
        "use strict";
        var files,
            i,
            ii;

        //make sure all inputs are assigned an initial variable. Defaults to local directory.
        directory = directory == null ? "." : directory;
        level = level == null ? 0 : level;
        out = out == null ? [] : out;
        files = fs.readdirSync(directory);
        for (i = 0; i < files.length; i += 1) {
            for (ii = 0; ii < level; ii += 1) {
                out.push("    ");
            }
            if (fs.lstatSync(directory + "/" + files[i]).isDirectory()) {
                out.push(files[i] + "\n");
                out = printDir((directory + "/" + files[i]), level + 1, out);
            } else {
                out.push(files[i] + "\n");
            }
        }
        return out;
    }

    //reads out the contents of a file as a string
    pub.readFile = function(location) {
        "use strict";
        return fs.readFileSync(location, 'ascii');
    }

    pub.copyFile = function(location, destination)  {
        "use strict";
        fs.createReadStream(location).pipe(fs.createWriteStream(destination));
        return true;
    }
    //write the string contents of a file. can use different encoding types, like UTF8.
    pub.writeFile = function(location, contents) {
        "use strict";
        contents = contents == null ? "File generated by PIPSQUEAK\n" : contents;
        fs.writeFileSync(location, contents, 'ascii');
        return true;
    }

    pub.doesExist = function(directory) {
        return fs.existsSync(directory);
    };
    //if theres no overwrite, make the directory. otherwise throw an error
    pub.makeDirectory = function(location) {
        "use strict";
        var permissions = '0777';
        //need to make sure the selected directory wont overwrite a file too
        if (fs.existsSync(location)) {
            return false;
        }
        fs.mkdirSync(location, permissions);
        return true;
    }

    //takes a filename and an optional directory, returns an array with whether the file was found and the local filepath
    function findFile(fileName, dir) {
        "use strict";
        var filePath = [false, "No file found"],
            files,
            i;
        if (fileName == null) {
            throw "No filename input";
        }
        //if dir is not defined assign it the local scope, otherwise leave it alone
        dir = dir == null ? "." : dir;
        files = fs.readdirSync(dir);
        for (i = 0; i < files.length; i += 1) {
            if (fs.lstatSync(dir + "/" + files[i]).isDirectory()) {
                filePath = findFile(fileName, (dir + "/" + files[i]));
                if (filePath[0] === true) {
                    return filePath;
                }
            } else {
                if (fileName === files[i]) {
                    return [true, dir + "/" + files[i]];
                }
            }
        }
        return filePath;
    }



    //removes a file if it exists
    pub.removeFile = function(location) {
        "use strict";
        
        fse.unlinkSync(location);
        return true;
    };

    //removes a directory if it exists
    pub.removeDirectory = function(location) {
        "use strict";
        var fse = require('fs-extra');
        //needs to descend into its directory and delete files.  or not, maybe. Depends on if we want it to delete the whole directory and everything in it, or be safer and only kill empty directories.
        fse.remove(location);
        return true;
    };

    //entry point to removal
    function remove(location) {
        "use strict";
        if (!(fs.existsSync(location))) {
            return false;
        }
        //if its a file, call remove file
        if (fs.lstatSync(location).isFile()) {
            removeFile(location);
        } else {
            //if its a directory call remove directory
            removeDirectory(location);
        }
    }

    //function that will initialize the PIPSQUEAK location if it doesn't already exist.
    //location variable to allow us to eventually maybe let the user et where they want the working directory
    pub.initialize = function(name,location) {
        "use strict";
        //set default location
        location = location == null ? "." : location;
        name = name == null ? "publish" : name;
        if (fs.existsSync(location + "/" + name)) {
            return false;
        }
        //make PIPSQUEAK directory
        this.makeDirectory(location + "/" + name);
        //main folder is html
        //js, css folders
        this.makeDirectory(location + "/"  + name + "/js");
        this.makeDirectory(location + "/" + name + "/css");
        //assets folder
        this.makeDirectory(location + "/"  + name + "/assets");
        //subfolders - audio, video, images?
        this.makeDirectory(location + "/"  + name + "/assets/video");
        this.makeDirectory(location + "/"  + name + "/assets/audio");
        this.makeDirectory(location + "/"  + name + "/assets/images");
        return true;
    };

    pub.zip = function(mediaPath, code, name, location) {
    	var zip = new require('node-zip')(),
    		i = 0;
    	location = location == null ? "./" : location;
    	name = name == null ? "recovery.pipsqueak" : name;
        if(code == null) {
        	return false;
        } else {
    		zip.file("recover.media",this.readFile(mediaPath));
    		zip.file("recover.code",code);
    		console.log("here");
    		console.log(this.readFile(mediaPath));
        	var data = zip.generate({base64:false,compression:'DEFLATE'});
        	console.log(data);
        	this.writeFile(location + name, data);
        	return true;
        }
    };

    pub.copyDir = function(dirPath, targetPath) {
    	var ncp = new require('ncp').ncp;
    	ncp.limit = 1600;
    	ncp(dirPath, targetPath, function (err) {
		if (err) {
		   	return console.error(err);
		}
		 	console.log('done!');
		});

    }

    
    return pub;
}());


/* ----------------------------------------------------------------------
-------------------------------------------------------------------------

		Begin Squeak

-------------------------------------------------------------------------
-----------------------------------------------------------------------*/


//(c) Scott Gavin, PIPSQUEAK 2015
//requires JQuery, filesystem.js

//the way this works is that squeak is basically a namespace, and any "pub.x" items are made public, whereas the rest are private to the namespace
var squeak = (function () {
    'use strict';
    var pub = {},
        id = 0,
        listOfActions = [],
        dev = true;

        //TODO: This is gonna need to handle the zip file
    pub.recover = function() {
       /*

        },1000);*/
        return false;
    };

    pub.saveFile = function(media, codeFile) {
   		var files = [];
        //write the code from the codeMirror into the recover.code
        files.append(media);
        //write the media file (hell, why not) into the recover.itsMediaTag

        //zip them together and what have you got?
        pip.zip(files);

    };
    //Getter for listOfActions (mainly for testing)
    pub.getListOfActionsCount = function () {
        return listOfActions.length;
    };
    //adds an action to the list of actions
	
    pub.addAction = function (startLine, endLine, startTime, endTime, action) {
        var i,
            actionNode = {};
        if (typeof startLine !== "number" || typeof endLine !== "number" || typeof startTime !== "number" || typeof endTime !== "number") {
            if(dev === true) console.log("Start line = " + startLine + " is a " + typeof startLine + ", should be a number."
                + "\nEnd Line = " + endLine + " is a " + typeof endLine + ", should be a number."
                + "\nstartTime = " + startTime + " is a " + typeof startTime + ", should be a number."
                + "\nEnd Time = " + endTime + " is a " + typeof endTime + ", should be a number."
                + "\nAction = " + action + " is a " + typeof action + ", should be a string.");
            throw "Invalid parameters";
        }
        endLine = endLine == null ? startLine : endLine;
        if (endLine < startLine) {
            i = endLine;
            endLine = startLine;
            startLine = i;
        }
        if (startTime > endTime) {
            throw "Invalid end time, end time cannot be before start time";
            return false;
        }
        if(startTime === endTime && startTime === 0) {
        	startTime = 0.01;
        	endTime = startTime;
        } else if(startTime === 0) {
        	startTime = 0.01;
        }
        //add additional actions names here
        if (action !== 'strikethrough' && action !== 'highlight' && action !== 'focus' && action !== 'fadeIn' && action !== 'fade' && action !== 'collapse' && action !== 'scroll' && action != 'annotate') {
            throw action + " is not an allowed action";
        }
        id += 1;
        actionNode.tool = action;
        actionNode.startLine = startLine;
        actionNode.endLine = endLine;
        actionNode.startTime = startTime;
        actionNode.endTime = endTime;
        actionNode.id = id;
		
		//added for annotation add
		if (actionNode.tool == "annotate") {
			profComments[annotateLineNum] = $('#annotateComment').val();
		}
		//end annotation add
		
        listOfActions.push(actionNode);
        this.writeListToFrontend();
        if(dev === true) console.log("Added the action " + action);
        //right now the variables being passed are the globals from PIPSQUEAK
        //this.saveFile(media, code);
        return true;
    };
    //deletes a node from the list.  
    pub.deleteAction = function (remId) {

		//added for annotation delete
		if (listOfActions[(remId - 1)].tool == "annotate") {
			delete profComments[listOfActions[(remId - 1)].startLine]; //sets profComments[annotateLineNum] to undefined
		}
		//end annotation delete
		
        var ii = 0;
        if (remId <= 0 || remId > id) {
            throw "Id was not found";
            return false;
        }
        //since the id starts at 1 and were keeping them in order theres no need to search for an id.
        //increase the ids of all higher nodes
        for (ii = remId; ii < id; ii += 1) {
            listOfActions[ii].id = listOfActions[ii].id - 1;
        }
        //delete the node
        listOfActions.splice(remId - 1, 1);
        id -= 1;
        this.writeListToFrontend();
        if(dev === true) console.log("Deleted an action.");
        return true;
    };
    //TODO - fix this so it can undo deletes, and add a redo. will need at least 1 more "stack" (array)
    //undo a change. Probably needs a bit of tweaking, for instance ability to undo deletes. 
    pub.undo = function () {
        if (id <= 0) {
            return false;
        }
        id -= 1;
        listOfActions.splice(id, 1);
        this.writeListToFrontend();
        if(dev === true) console.log("Undid the last function");
        return true;
    };

    //function that writes the list to the running frontend display
    pub.writeListToFrontend = function () {
        var i;

        //clear the table - extremely hamfisted
        $('.actionsTable').html("<thead><tr><th>Line #</th><th>Time (s)</th><th>Tool</th><th>Delete</th></tr></thead><tbody></tbody>");
        //run through the list.
        for (i = 0; i < listOfActions.length; i += 1) {
            if (listOfActions[i].startLine === listOfActions[i].endLine) {
                $('.actionsTable > tbody:last').append('<tr><td>' + listOfActions[i].startLine + '</td><td>' + listOfActions[i].startTime.toFixed(2)
                    + ' - ' + listOfActions[i].endTime.toFixed(2) + '</td><td>' + listOfActions[i].tool
                    + '</td><td><a href=\"javascript:;\" onclick = squeak.deleteAction(' + listOfActions[i].id + ')>X</a></td></tr>');
            } else {
                $('.actionsTable > tbody:last').append('<tr><td>' + listOfActions[i].startLine + " - "
                    + listOfActions[i].endLine + '</td><td>' + listOfActions[i].startTime.toFixed(2)
                    + ' - ' + listOfActions[i].endTime.toFixed(2) + '</td><td>' + listOfActions[i].tool
                    + '</td><td><a href=\"javascript:;\" onclick = squeak.deleteAction(' + listOfActions[i].id + ')>X</a></td></tr>');
            }
        }
        if(dev === true) console.log("Wrote the list to the frontend.");
        return true;
    };
    //TODO - most of this.
    //will need to pull the video and codemirror segment and write those to the output template in the right places

    //requires video path from frontend as the media
    //path can be absolute or relative
    pub.publish = function (media, fileContents, name, path) {
        var i,
            sinAction,
            runAction,
            popcornFile = "",
            mediaFileName,
            mediaType,
            html,
            startTime = new Date().getTime(),
            endTime = 0;
        name = prompt("Name the tutorial as:", "publish");
        //this.saveFile(media,fileContents);

		if(name === null) {
				return;
		}
        if (media == null) {
            throw "Error, no media input to publish";
        }
        if(pip.doesExist(media) === false) { 
        	alert("Cannot publish without a valid video file");
            throw "File " + media + " does not exist.";
        }
        name = name == null ? "publish" : name;
        path = path == null ? "./publish" : path;
		
		var fs = require('fs');
		if (fs.existsSync(path + "/" + name + "/js/pop.js")) {
			console.log(path + "/" + name + "/js/pop.js" + "already exists");
        	alert("Cannot overwrite an existing directory as of this version, please save as  unique filename");
            throw "File already exists";
        }
		else if (fs.existsSync(path + "/" + name + "/index.html")) {
			console.log(path + "/" + name + "/index.html" + "already exists");
        	alert("Cannot overwrite an existing directory as of this version, please save as  unique filename");
            throw "File already exists";
        }
		
        pip.makeDirectory('./publish');
        pip.initialize(name, path);
		pip.copyDir("./js/",path + "/" + name + "/js/");
		pip.copyDir("./fonts/",path + "/" + name + "/fonts/");
        //pip.copyDir("./node_modules", path + "/" + name + "/node_modules/");

		var firstPart = pip.readFile("./templates/firstPart.txt");

		html = firstPart;

		html += "\n\t\t\t\t\t\t\t<source type=\"video/mp4\" src=file:///" + media + " id=\"mp4\"></source>\n";
		html += "\t\t\t\t\t\t\t<source type=\"video/webm\" src=file:///" + media + " id=\"webm\"></source>\n";
		html += "\t\t\t\t\t\t\t<source type=\"video/ogg\" src=file:///" + media + " id=\"ogv\"></source>\n";
		
		var secondPart = pip.readFile("./templates/secondPart.txt");
		html += secondPart;
		
		var i;
		for(i = 0; i < fileContents.length; i++) {
			html += fileContents[i];
		}
		
		var thirdPart = pip.readFile("./templates/thirdPart.txt");
		html += thirdPart;
		
		html += name;
		
		var fourthPart = pip.readFile("./templates/fourthPart.txt");
		html += fourthPart;

        mediaFileName = (function () {
            var pattern = new RegExp("[a-zA-Z0-9][a-zA-Z0-9]*[.][a-z0-9][a-z0-9]*");
            return pattern.exec(media);

        }());
        mediaType = (function () {
            var pattern = new RegExp("[.][a-z0-9][a-z0-9]*"),
                ending = pattern.exec(mediaFileName);
            ending = ending[0];
            switch (ending) {
            case ".mp4":
            case ".ogv":
            case ".webm":
            case ".mkv":
                return "video";
            case ".mp3":
            case ".ogg":
            case ".wav":
            case ".wave":
                return "audio";
            default:
                throw "Unrecognised media type " + ending;
            }

        }());
        pip.copyFile(media, path + '/' + name + '/assets/' + mediaType + '/' + mediaFileName);

        if(pip.doesExist("./css/PIPSQUEAK.css") === true) {
            pip.copyFile("./css/PIPSQUEAK.css", path + '/' + name + '/css/PIPSQUEAK.css');
        } else {
            throw "File ./css/PIPSQUEAK.css does not exist.";
        }
        if(pip.doesExist("./css/styles.css") === true) {
            pip.copyFile("./css/styles.css", path + '/' + name + '/css/styles.css');
        } else {
            throw "File ./css/styles.css does not exist.";
        }
        if(pip.doesExist("./css/bootstrap.min.css") === true) {
            pip.copyFile("./css/bootstrap.min.css", path + '/' + name + '/css/bootstrap.min.css');
        } else {
            throw "File ./css/bootstrap.min.css does not exist.";
        }
		if(pip.doesExist("./css/jquery-ui.css") === true) {
            pip.copyFile("./css/jquery-ui.css", path + '/' + name + '/css/jquery-ui.css');
        } else {
            throw "File ./css/jquery-ui.css does not exist.";
        }
		popcornFile += "document.addEventListener('DOMContentLoaded', function(event) {\n";
        popcornFile += "var pop = Popcorn(\"#video\");\n";
        
        //Autoscroll check function:
        popcornFile += "var checkPos = function (nextPos, currentPos){\n"
        	+ "\tif(nextPos > (currentPos + 100)){\n"
        	+ "\t\treturn true;\n"
        	+ "\t} else {\n"
        	+ "\t\treturn false;\n"
        	+ "}\n};\n\n"
        	

        //copy the js files and then the node_modules
       // pip.copyDir("./js/",path + "/" + name + "/js/");
       // pip.copyDir("./node_modules", path + "/" + name + "/node_modules/");
        runAction = function (startLine, endLine, startTime, endTime, action) {
        //only runAction can call the worker functions
            var start,
                end,
                ii = 0;
            
            if (action === 'strikethrough' || action === 'highlight' || action === 'focus' || action === 'fade') {
                //call any of the CSS adder functions
                if(dev === true) console.log(action + "ing lines " + startLine + " - " + endLine + " from time " + startTime + " to time " + endTime + ".");
				//var scroller = "\n\t\tdocument.getElementById(\'codearea\').scrollTop = (document.getElementById(\'line" + startLine + "\').offsetTop - 150);";
                var scroller = "\n\t\tvar startPos = (document.getElementById(\'line" + startLine + "\').offsetTop - 150);\n"
                	+ "\t\tvar currentPos = document.getElementById(\'codearea_pretty\').scrollTop;\n"
                	+ "\t\tif(startPos > (currentPos + 300) || startPos < currentPos){\n"
                	+ "\t\t\t$(\'#codearea_pretty\').animate({ scrollTop: startPos }, 600, 'easeOutBack')"
                	+ "\t\t}\n";
                for (ii = startLine; ii <= endLine; ii += 1) {
                    start = "pop.code ({\n\tstart: " + startTime + ",\n\tend: " + endTime
                        + ",\n\tonStart: function() {" + scroller 
						+ "\n\t\t$(\'#line" + ii + "\').addClass(\"" + action + "\");\n\t},\n"
                        + "\tonEnd: function() {\n\t\t$(\'#line" + ii + "\').removeClass(\"" + action + "\");\n\t}\n});\n";
                    /*end = "pop.code ({\n\tstart: " + endTime + ",\n\tend: " + endTime
                        + ",\n\tonStart: function() {\n\t\t$(\'line" + i  + "\').removeClass(\"" + action + "\")\n\t}\n});\n";*/
                    popcornFile += start;
                    //popcornFile += end;
					scroller = ""; //Only want it on the first line
                }
            } else if (action === 'annotate') {
                //call annotate function
                if(dev === true) console.log("Annotating lines " + startLine + " to " + endLine + " from time " + startTime + " to time " + endTime + ".");
                for (ii = startLine; ii <= endLine; ii += 1) {
                    start = "\n$(\'#line" + (startLine) + "\').prepend(\"<span id='comment" + (ii) + "' data-toggle='modal' data-target='#annotateCommentModal' class='glyphicon glyphicon-comment'> </span>\");\n"
						+ "$('#comment" + (ii) + "').click(function() {\n"
						+ "video.pause();\n"
						+ "$('#annotateCommentContent').html('" + profComments[ii] + "');\n"
						+ "});\n"
						+ "$('#comment" + (ii) + "').hover(function() {\n"
						+ "\t$('#comment" + (ii) + "').css('cursor', 'pointer');\n"
						+ "}, function(){"
						+ "\t$('#comment" + (ii) + "').css('cursor', 'auto');\n"
						+ "});\n";
						
					/*end = "pop.code ({\n\tstart: " + endTime + ",\n\tend: " + endTime
                        + ",\n\tonStart: function() {\n\t\t$(\'line" + i  + "\').removeClass(\"" + action + "\")\n\t}\n});\n";*/
                    popcornFile += start;
                    //popcornFile += end;
				}
            } else if (action === 'collapse') {
                //call collapse function
                if(dev === true) console.log("collapsing lines " + startLine + " to " + endLine + " from time " + startTime + " to time " + endTime + ".");
				for (ii = startLine; ii <= endLine; ii += 1) {
                    start = "pop.code ({\n\tstart: " + startTime + ",\n\tend: " + endTime
                        + ",\n\tonStart: function() { \n\t\tdocument.getElementById(\'codearea\').scrollTop = (document.getElementById(\'line" + startLine + "\').offsetTop - 150);"
						+ "\n\t\t$(\'#line" + ii + "\').parent().parent().fadeOut();\n\t},\n"
                        + "\tonEnd: function() {\n\t\t$(\'#line" + ii + "\').parent().parent().fadeIn();\n\t}\n});\n";
                    /*end = "pop.code ({\n\tstart: " + endTime + ",\n\tend: " + endTime
                        + ",\n\tonStart: function() {\n\t\t$(\'line" + i  + "\').removeClass(\"" + action + "\")\n\t}\n});\n";*/
                    popcornFile += start;
                    //popcornFile += end;
				}
            } else if (action === 'scroll') {
                //call autoScroll function
                if(dev === true) console.log("Scrolling from line " + startLine + " to line " + endLine + " from time " + startTime + " to time " + endTime + ".");
                //durr = end - start; never used?
                start = "pop.code ({\n\tstart: " + startTime + ",\n\tend: " + endTime
                        + ",\n\tonStart: function() { \n\t\t$(\'#codearea_pretty\').animate({ scrollTop: (document.getElementById(\'line" + startLine + "\').offsetTop - 150) }, 600, 'easeOutBack')"
						+ "\n\t},\n"
                        + "\tonEnd: function() {}\n});\n";
                        
                        
                        //\n\t\t$(\'#codearea_pretty\').animate({ scrollTop: (document.getElementById(\'line" + startLine + "\').offsetTop - 150) }, 600, 'easeOutBack')\n"
                        //+ "\tonEnd: function() { }\n});\n";
                popcornFile += start;
            } else {
                if(dev === true) console.log(action + " is not an accepted action in function runAction");
                return false;
            }
            
            return true;
        };
        //when they hit publish run through the codemirror div and assign each individual LINE to an array location, with arr[0] being empty for simplicity 
        for (i = 0; i < id; i += 1) {
            //this is assuming that each line will have a class of "line<lineNumber>"
            sinAction = listOfActions[i];
            if (runAction(sinAction.startLine, sinAction.endLine, sinAction.startTime, sinAction.endTime, sinAction.tool) === false) {
                if(dev === true) console.log("Error in running the Actions list");
                //may want some error handling in here or something.
            }
        }
        popcornFile += "});";
        //write the popcorn functions to a javascript file
		
        pip.writeFile(path + "/" + name + "/js/pop.js", popcornFile);
        console.log(path + "/" + name + "/index.html");
        pip.writeFile(path + "/" + name + "/index.html", html);
        endTime = new Date().getTime();
        var newWinPath = "";
        if (path === ".") {
        	newWinPath = process.cwd() + "/" + name;
            alert("The tutorial has been published to " + process.cwd() + "/" + name);
        } else {
        	newWinPath = path + "/" + name;
            alert("The tutorial has been published to " + path + "/" + name);
        }
        if(dev === true) console.log("Publish is complete.");

        // pip.removeFile('./recoveryFile.pipsqueak');

		//alert for testing publish time
        //if(dev === true) alert("Publish took approximately " + (endTime - startTime)/1000 + " seconds to complete");
        
        setTimeout( function() {
        	var newWin = gui.Window.open(path + "/" + name + "/index.html", {
	  			position: 'center',
	  			width: 1280,
	    		height: 720,
				'new-instance': true
			});

			newWin.on('focus', function() {
  			console.log('New window is focused');
		});
        }, 2000);

        return true;
    };
    //just a tester function
    pub.showList = function () {
        console.log(listOfActions);
    };
    if(dev === true) console.log("Squeak has initialized");
    return pub;
}());



