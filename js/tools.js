var squeak = (function() {
	var pub = {},
	listOfActions = [],
	id = 0;
	
	//adds an action to the list of actions
	pub.addAction = function(line,startTime,endTime,action) {
		var actionNode = {};
		id += 1;
		//add additional actions names here
		if(action !== 'strike' && action !== 'highlight') throw action + " is not an allowed action";
		actionNode.tool = action; 
		actionNode.line = line;
		actionNode.startTime = startTime;
		actionNode.endTime = endTime;
		actionNode.id = id;
		listOfActions.push(actionNode);
	};
	
	//deletes a node from the list.  
	pub.deleteAction = function(remId) {
		var i = 0,
			ii = 0;
		if(remId <=0 || remId > id) {
			console.log("Id was not found");
			return false;
		}
		//since the id starts at 1 and were keeping them in order theres no need to search for an id.
			//increase the ids of all higher nodes
		for(ii = remId;ii<id;ii += 1) {
			listOfActions[ii].id = listOfActions[ii].id-1;
		}
		//delete the node
		listOfActions.splice(remId-1,1);
		id -= 1;
		return true;
		console.log("Id was not found");
		return false;
	};
	
	//undo a change. Probably needs a bit of tweaking, for instance ability to undo deletes. 
	pub.undo = function() {
		if (id <= 0) return false;
		id -= 1;
		listOfActions.splice(id,1);
		return true;
	}

	//need on for publishes that runs through and call the functions that will actually write the changes.
	//just a tester function
	pub.showList = function() {
		console.log(listOfActions);
	};
	
	return pub;
}());