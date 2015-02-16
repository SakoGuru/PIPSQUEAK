//the way this works is that squeak is basically a namespace, and any "pub.x" items are made public, whereas the rest are private to the namespace
var squeak = (function () {
    'use strict';
    var pub = {},
        listOfActions = [],
        id = 0;
    //adds an action to the list of actions
    pub.addAction = function (line, startTime, endTime, action) {
        if (startTime > endTime) {
            console.log("The end time cannot be before the start time");
            return false;
        }
        var actionNode = {};
        id += 1;
        //add additional actions names here
        if (action !== 'strike' && action !== 'highlight') {
            throw action + " is not an allowed action";
        }
        actionNode.tool = action;
        actionNode.line = line;
        actionNode.startTime = startTime;
        actionNode.endTime = endTime;
        actionNode.id = id;
        listOfActions.push(actionNode);
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
        return true;
    };
    //TODO - most of this.
    //need on for publishes that runs through and call the functions that will actually write the changes.
    //will need to pull the video and codemirror segment and write those to the output template in the right places
    pub.publish = function () {
        var i,
            sinAction,
            runAction;
        runAction = function (line, startTime, endTime, action) {
        //only runAction can call the worker functions
            var focus,
                highlight,
                strike,
                annotate;
             //TODO - actual worker functions
            focus = function (line, startTime, endTime) {
                return false;
            };
            highlight = function (line, startTime, endTime) {
                return false;
            };
            strike = function (line, startTime, endTime) {
                return false;
            };
            annotate = function (line, startTime, endTime) {
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
            } else {
                console.log(action + " is not an accepted action in function runAction");
                return false;
            }
            return true;
        };
        //when they hit publish run through the codemirror div and assign each individual LINE to an array location, with arr[0] being empty for simplicity 
        //TODO - read in codemirror portion and parse into individual lines for wrapping or class adding.
        for (i = 0; i < id; i += 1) {
            //if i remember right this is more efficient that calling to the array each time, but i could be wrong
            sinAction = listOfActions[i];
            if (runAction(sinAction.line, sinAction.startTime, sinAction.endTime, sinAction.tool) === false) {
                console.log("Error in running the Actions list");
                //may want some error handling in here or something.
            }
        }
        //TODO - write the edited code and the video to a template file
        return true;
    };
    //just a tester function
    pub.showList = function () {
        console.log(listOfActions);
    };
    return pub;
}());