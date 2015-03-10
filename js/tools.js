//(c) Scott Gavin, PIPSQUEAK 2015
//requires JQuery, filesystem.js

//the way this works is that squeak is basically a namespace, and any "pub.x" items are made public, whereas the rest are private to the namespace
var squeak = (function () {
    'use strict';
    var pub = {},
        id = 0,
        listOfActions = [],
        writeListToFrontend;
    //adds an action to the list of actions
    pub.addAction = function (startLine, endLine, startTime, endTime, action) {
        var i;
        endLine = endLine == null ? startLine : endLine;
        if(endLine < startLine) {
            i = endLine;
            endline = startLine;
            startLine = endLine;
        }
        if (startTime > endTime) {
            console.log("The end time cannot be before the start time");
            return false;
        }
        //add additional actions names here
        if (action !== 'strike' && action !== 'highlight' && action !== 'focus' && action !== 'fadeIn' && action !== 'fadeOut' && action !== 'anchor' && action !== 'autoScroll') {
            throw action + " is not an allowed action"; 
        }
        
        for(i = startLine; i <= endLine; i++) {
            var actionNode = {}; //ugly, but it works
            id += 1;
            actionNode.tool = action;
            actionNode.line = i;
            actionNode.startTime = startTime;
            actionNode.endTime = endTime;
            actionNode.id = id;
            listOfActions.push(actionNode);
        }
        writeListToFrontend();
    };
    //deletes a node from the list.  
    pub.deleteAction = function (remId) {
        var ii = 0;
        if (remId <= 0 || remId > id) {
            console.log("Id was not found");
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
        writeListToFrontend();
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
        writeListToFrontend();
        return true;
    };

    //function that writes the list to the running frontend display
    writeListToFrontend = function () {
        var i;

        //clear the table - extremely hamfisted
        $('.actionsTable').html("<thead><tr><th>Line #</th><th>Time</th><th>Tool</th><th>Delete</th></tr></thead><tbody></tbody>");
        //run through the list.
        for(i = 0; i < listOfActions.length; i++) {
            $('.actionsTable > tbody:last').append('<tr><td>' + listOfActions[i].line + '</td><td>' + listOfActions[i].startTime.toFixed(2) + ' - ' + listOfActions[i].endTime.toFixed(2) + '</td><td>'+listOfActions[i].tool+'</td><td><a href=\"javascript:;\" onclick = squeak.deleteAction(' + listOfActions[i].id + ')>X</a></td></tr>');
        }        
        return true;
    }
    //TODO - most of this.
    //will need to pull the video and codemirror segment and write those to the output template in the right places

    //requires video path from frontend
    pub.publish = function (media) {
        var i,
            sinAction,
            runAction,
            popcornFile = "", 
            mediaFileName,
            mediaType;
        if(media == null) {
            throw "Error, no media input to publish";
        }
        initialize();
        mediaFileName = function() {
            var pattern = new RegExp("[a-zA-Z0-9][a-zA-Z0-9]*[.][a-z0-9][a-z0-9]*")
            return pattern.exec(media);

        }();
        mediaType = function () {
            var pattern = new RegExp("[.][a-z0-9][a-z0-9]*"),
            ending = pattern.exec(mediaFileName);
            ending = ending[0];
            switch (ending) {
                case ".mp4":
                case ".ogv":
                case ".webm":
                case ".flv":
                case ".mkv": {
                    return "video";
                    break;
                }
                case ".mp3":
                case ".flac": {
                    return "audio";
                    break;
                }
                default: {
                    throw "Unrecognised media type " + ending
                }
            }

        }();
        //TODO: handle file to get its name from its path, and determine if video or audio, as well as published directory name.
        //proof of concept
        console.log('./publish/assets/'+ mediaType + '/' + mediaFileName);
        copyFile(media,'./publish/assets/'+ mediaType + '/' + mediaFileName);
        /*runAction = function (line, startTime, endTime, action) {
        //only runAction can call the worker functions
            var focus,
                highlight,
                strike,
                annotate,
                fadeIn,
                fadeOut,
                anchor,
                autoScroll;
             //TODO - actual worker functions
            focus = function (line, startTime, endTime) {
                return false;
            };
            highlight = function (line, startTime, endTime) {
				//the code will be the css we decide to use for highlight
				//use jquery .css, but need to figure out how we want a highlight to look.
                var start,
                    end;
                start = "pop.code ({\n\tstart: " + startTime + ",\n\tend: " + startTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+line+"\').addClass(\"highlight\")\n\t}\n});\n";
                end = "pop.code ({\n\tstart: " + endTime + ",\n\tend: " + endTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+line+"\').removeClass(\"highlight\")\n\t}\n});\n";
                popcornFile += start;
                popcornFile += end;
                return true;
            };
            strike = function (line, startTime, endTime) {
				//need to determine how were finding a line, adding a class to each line.
				//for strike we'll need a pop for start time, and then a pop for end time.
				//start will strike the code, end will unstrike the code.
				var code = $("" + line + "").html(),
					start = "pop.code ({\n\tstart: " + startTime + ",\n\tend: " + startTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+line+"\').addClass(\"strike\")\n\t}\n});\n",
					end = "pop.code ({\n\tstart: " + endTime + ",\n\tend: " + endTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+line+"\').removeClass(\"strike\")\n\t}\n});\n";
                popcornFile += start;
                popcornFile += end;
                return true;
            };
            annotate = function (line, startTime, endTime) {
                return false;
            };
            fadeIn = function (line, startTime, endTime) {
                var start,
                    end;
                start = "pop.code ({\n\tstart: " + startTime + ",\n\tend: " + startTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+line+"\').addClass(\"fadeIn\")\n\t}\n});\n";
                end = "pop.code ({\n\tstart: " + endTime + ",\n\tend: " + endTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+line+"\').removeClass(\"fadeIn\")\n\t}\n});\n";
                popcornFile += start;
                popcornFile += end;
                return true;
            };
            fadeOut = function (line, startTime, endTime) {
                var start,
                    end;
                start = "pop.code ({\n\tstart: " + startTime + ",\n\tend: " + startTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+line+"\').addClass(\"fadeOut\")\n\t}\n});\n";
                end = "pop.code ({\n\tstart: " + endTime + ",\n\tend: " + endTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+line+"\').removeClass(\"fadeOut\")\n\t}\n});\n";
                popcornFile += start;
                popcornFile += end;
                return true;
            };
            anchor = function (line, startTime, endTime) {
                return false;
            };
            autoScroll = function (line, startTime, endTime) {
                return false;
            };
            //body of runAction
            if (action === 'strike') {
                //call strike function
                console.log("Striking line " + line + " from time " + startTime + " to time " + endTime + ".");
                console.log(strike(line, startTime, endTime));
            } else if (action === 'highlight') {
                //call highlight function
                console.log("Highlighting line " + line + " from time " + startTime + " to time " + endTime + ".");
                console.log(highlight(line, startTime, endTime));
            } else if (action === 'focus') {
                //call focus function
                console.log("Focusing line " + line + " from time " + startTime + " to time " + endTime + ".");
                console.log(focus(line, startTime, endTime));
            } else if (action === 'annotate') {
                //call annotate function
                console.log("Annotating line " + line + " from time " + startTime + " to time " + endTime + ".");
                console.log(annotate(line, startTime, endTime));

            } else if (action === 'fadeOut') {
                //call fadeOut function
                console.log("Fading out line " + line + " from time " + startTime + " to time " + endTime + ".");
                console.log(fadeOut(line, startTime, endTime));

            } else if (action === 'fadeIn') {
                //call fadeIn function
                console.log("Fading in line " + line + " from time " + startTime + " to time " + endTime + ".");
                console.log(fadeIn(line, startTime, endTime));

            } else if (action === 'anchor') {
                //call anchor function
                console.log("Anchoring? line " + line + " from time " + startTime + " to time " + endTime + ".");
                console.log(anchor(line, startTime, endTime));

            } else if (action === 'autoScroll') {
                //call autoScroll function
                console.log("Scrolling? line " + line + " from time " + startTime + " to time " + endTime + ".");
                console.log(autoScroll(line, startTime, endTime));

            }
            else {
                console.log(action + " is not an accepted action in function runAction");
                return false;
            }
            return true;
        }; */
        //when they hit publish run through the codemirror div and assign each individual LINE to an array location, with arr[0] being empty for simplicity 
        //TODO - read in codemirror portion and parse into individual lines for wrapping or class adding.
        var start, end;
        for (i = 0; i < id; i += 1) {
            //if i remember right this is more efficient that calling to the array each time, but i could be wrong
            sinAction = listOfActions[i];
            start = "pop.code ({\n\tstart: " + sinAction.startTime + ",\n\tend: " + sinAction.startTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+sinAction.line+"\').addClass(\"" + sinAction.tool + "\")\n\t}\n});\n";
            end = "pop.code ({\n\tstart: " + sinAction.endTime + ",\n\tend: " + sinAction.endTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+sinAction.line+"\').removeClass(\"" + sinAction.tool + "\")\n\t}\n});\n";
            popcornFile += start;
            popcornFile += end;
            /*if (runAction(sinAction.line, sinAction.startTime, sinAction.endTime, sinAction.tool) === false) {
                console.log("Error in running the Actions list");
                //may want some error handling in here or something.
            }*/

        }
        //TODO - write the media and input code to a template file
        //write the popcorn functions to a javascript file
        writeFile("./publish/js/pop.js",popcornFile);
        alert("The tutorial has been published to " + process.cwd() + "/publish");
        return true;
    };
    //just a tester function
    pub.showList = function () {
        console.log(listOfActions);
    };
    return pub;
}());
exports.squeak = squeak;