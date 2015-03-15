//(c) Scott Gavin, PIPSQUEAK 2015
//requires JQuery, filesystem.js

//the way this works is that squeak is basically a namespace, and any "pub.x" items are made public, whereas the rest are private to the namespace
var squeak = (function () {
    'use strict';
    var pub = {},
        id = 0,
        listOfActions = [];
    //Getter for listOfActions (mainly for testing)
    pub.getListOfActionsCount = function () {
        return listOfActions.length;
    };
    //adds an action to the list of actions
    pub.addAction = function (startLine, endLine, startTime, endTime, action) {
        var i,
            actionNode = {};
        endLine = endLine == null ? startLine : endLine;
        if (endLine < startLine) {
            i = endLine;
            endLine = startLine;
            startLine = i;
        }
        if (startTime > endTime) {
            console.log("The end time cannot be before the start time");
            return false;
        }
        //add additional actions names here
        if (action !== 'strike' && action !== 'highlight' && action !== 'focus' && action !== 'fadeIn' && action !== 'fadeOut' && action !== 'anchor' && action !== 'autoScroll') {
            throw action + " is not an allowed action";
        }
        id += 1;
        actionNode.tool = action;
        actionNode.startLine = startLine;
        actionNode.endLine = endLine;
        actionNode.startTime = startTime;
        actionNode.endTime = endTime;
        actionNode.id = id;
        listOfActions.push(actionNode);
        this.writeListToFrontend();
        return true;
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
        this.writeListToFrontend();
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
        return true;
    };

    //function that writes the list to the running frontend display
    pub.writeListToFrontend = function () {
        var i;

        //clear the table - extremely hamfisted
        $('.actionsTable').html("<thead><tr><th>Line #</th><th>Time</th><th>Tool</th><th>Delete</th></tr></thead><tbody></tbody>");
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
            html;
        if (media == null) {
            throw "Error, no media input to publish";
        }
        name = name == null ? "publish" : name;
        path = path == null ? "." : path;
        pip.initialize(name, path);
        html = "<!DOCTYPE html>";
        html += "\n<html>";
        html += "\n\t<head>";
        html += "\n\t\t<script src = \"js/pop.js\" type = \"text/javascript\"></script>";
        html += "\n\t\t<link rel=\"stylesheet\" href=\"css/styles.css\">";
        html += "\n\t\t<link rel=\"stylesheet\" href=\"css/PIPSQUEAK.css\">";
        html += "\n\t\t<link rel=\"stylesheet\" href=\"css/bootstrap.min.css\">";
        html += "\n\t</head>";
        html += "\n\t<body>";
        html += "\n\t</body>";
        html += "\n</html>";
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
        //TODO: check that all paths exist BEFORE trying to copy them, otherwise it makes an empty file if the copied files not found (at least in windows) that cant be deleted until 
        pip.copyFile(media, path + '/' + name + '/assets/' + mediaType + '/' + mediaFileName);
        pip.copyFile("./css/PIPSQUEAK.css", path + '/' + name + '/css/PIPSQUEAK.css');
        pip.copyFile("./css/styles.css", path + '/' + name + '/css/styles.css');
        pip.copyFile("./css/bootstrap.min.css", path + '/' + name + '/css/bootstrap.min.css');
        runAction = function (startLine, endLine, startTime, endTime, action) {
        //only runAction can call the worker functions
            var start,
                end,
                ii = 0;
                //durr;
             //TODO - actual worker functions
            /*annotate = function (line, startTime, endTime) {
                return false;
            };
            anchor = function (line, startTime, endTime) {
                return false;
            };
            //TODO 'codearea' is whatever the name for the scroll div where the code is.  Confirm 
            //TODO If possible to get all the lines for this one instead of individual actions per line
            //        so we can get the first line to the last line (just need those two) to set the autoScroll bounds
            autoScroll = function (line, startTime, endTime) {
                var start,
                    end,
                    durr;
                durr = end - start;
                start = "pop.code ({\n\tstart: " + startTime + ",\n\tend: " + startTime 
                    + ",\n\tonStart: function() {\n\t\ttop = document.getElementById('"+line+"').offsetTop; 
                    \n\t\tdocument.getElementById('codearea').scrollTop = topPos;\n
                    \n\t\t$('body,html').animate({scrollTop: +line+},+durr+);\n
                    \n\t\t$(\'"+line+"\').addClass(\"autoScroll\")\n\t}\n});\n";
                end = "pop.code ({\n\tstart: " + endTime + ",\n\tend: " + endTime 
                    + ",\n\tonStart: function() {\n\t\t$(\'"+line+"\').removeClass(\"autoScroll\")\n\t}\n});\n";
                popcornFile += start;
                popcornFile += end;
                return true;
            };*/
            if (action === 'strike' || action === 'highlight' || action === 'focus' || action === 'fadeOut' || action === 'fadeIn') {
                //call any of the CSS adder functions
                console.log(action + "ing lines " + startLine + " - " + endLine + " from time " + startTime + " to time " + endTime + ".");
                for (ii = startLine; ii < endLine; ii += 1) {
                    start = "pop.code ({\n\tstart: " + startTime + ",\n\tend: " + startTime
                        + ",\n\tonStart: function() {\n\t\t$(\'line" + i + "\').addClass(\"" + action + "\")\n\t}\n});\n";
                    end = "pop.code ({\n\tstart: " + endTime + ",\n\tend: " + endTime
                        + ",\n\tonStart: function() {\n\t\t$(\'line" + i  + "\').removeClass(\"" + action + "\")\n\t}\n});\n";
                    popcornFile += start;
                    popcornFile += end;
                }
            } else if (action === 'annotate') {
                //call annotate function
                console.log("Annotating lines " + startLine + " to " + endLine + " from time " + startTime + " to time " + endTime + ".");
                //TODO: Annotate function

            } else if (action === 'anchor') {
                //call anchor function
                console.log("Anchoring lines " + startLine + " to " + endLine + " from time " + startTime + " to time " + endTime + ".");
                //TODO: Anchor function

            } else if (action === 'autoScroll') {
                //call autoScroll function
                //TODO: Luke should look at this and make sure I refactored it correctly.
                console.log("Scrolling from line " + startLine + " to line " + endLine + " from time " + startTime + " to time " + endTime + ".");
                //durr = end - start; never used?
                start = "pop.code ({\n\tstart: " + startTime + ",\n\tend: " + startTime
                    + ",\n\tonStart: function() {\n\t\ttop = document.getElementById(\'" + startLine + "\').offsetTop;"
                    + "\n\t\tdocument.getElementById('codearea').scrollTop = topPos;\n"
                    + "\n\t\t$('body,html').animate({scrollTop: " + endLine + "}," + "durr" + ");\n"
                    + "\n\t\t$(\'" + endLine + "\').addClass(\"autoScroll\")\n\t}\n});\n";
                end = "pop.code ({\n\tstart: " + endTime + ",\n\tend: " + endTime
                    + ",\n\tonStart: function() {\n\t\t$(\'" + endLine + "\').removeClass(\"autoScroll\")\n\t}\n});\n";
                popcornFile += start;
                popcornFile += end;
            } else {
                console.log(action + " is not an accepted action in function runAction");
                return false;
            }
            return true;
        };
        //when they hit publish run through the codemirror div and assign each individual LINE to an array location, with arr[0] being empty for simplicity 
        //TODO - read in codemirror portion and parse into individual lines for wrapping or class adding.
        for (i = 0; i < id; i += 1) {
            //this is assuming that each line will have a class of "line<lineNumber>"
            sinAction = listOfActions[i];
            if (runAction(sinAction.startLine, sinAction.endLine, sinAction.startTime, sinAction.endTime, sinAction.tool) === false) {
                console.log("Error in running the Actions list");
                //may want some error handling in here or something.
            }

        }
        //TODO - write the media and input code to a template file
        //write the popcorn functions to a javascript file
        pip.writeFile(path + "/" + name + "/js/pop.js", popcornFile);
        console.log(path + "/" + name + "/index.html");
        pip.writeFile(path + "/" + name + "/index.html", html);
        if (path === ".") {
            alert("The tutorial has been published to " + process.cwd() + "/" + name);
        } else {
            alert("The tutorial has been published to " + path + "/" + name);
        }
        return true;
    };
    //just a tester function
    pub.showList = function () {
        console.log(listOfActions);
    };
    return pub;
}());
//why is this here?
//For testing yo -Luke (feel free to comment it out if not testing and it's giving a headache)
exports.squeak = squeak;