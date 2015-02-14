//Apparently Code Mirror has a function called focus() too... that explodes.
function focusOnObject(objectId) {
	//I know it's a color, but I don't know much css... just testing to see if my code works first.
	//It's not editing any css yet, but the functions all get called at the right time, which is nice.
	document.getElementById(objectId).style.color = "red";  
}

function unFocus(objectId) {
	document.getElementById(objectId).style.color = "black";
}

var undoEventFunctions = {
	unfocusOnObject: unFocus
};

function popFunctions(objectId, startTime, endTime, eventType){
  document.addEventListener( "DOMContentLoaded", function(){
	  var pop = Popcorn( "#video" );
	  pop.code({
		 start: startTime,
		 end: endTime,
		 onStart: eventType(objectId),
		 onEnd: undoEventFunctions["un" + eventType.name](objectId)
	  });
  }, false);
};
