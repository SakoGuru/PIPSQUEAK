describe("tools", function () {
	//dummy function example, called by .andCallFake() when using Spies
	function writeList() {
		return true;
	}
	var tools = require("../js/tools.js");
		
	//These are globally set before each single test.
	//You may make local beforeEach within each describe block for specifics for your describe.
	beforeEach(function (){
		//You don't need to ".andCallFake(function) here, just did it as an example.
		spyOn(tools.squeak, "writeListToFrontend").andCallFake(writeList);
		
		//See warning below in AddAction for as how to use this.  You'll need it a lot
		this.startActionCount = tools.squeak.getListOfActionsCount();
	});
	
	//All tests for addAction go in here
	describe("addAction", function() {
		//Test the base case
		it("should add an action", function() {
			tools.squeak.addAction(1, 1, 1, 2, "focus");
			var actionCount = tools.squeak.getListOfActionsCount();
			expect(actionCount).toEqual(1);
		});
		
		//Test an internal action gets done.
		it("should call writeListToFrontend", function() {
			tools.squeak.addAction(1, 1, 1, 2, "focus");
			expect(tools.squeak.writeListToFrontend).toHaveBeenCalled();
		});
		
		//Test error handling.
		it("should not throw an error unless an improper action is given", function() {
			expect(function(){tools.squeak.addAction(1, 1, 1, 2, "focus");}).not.toThrow()
			expect(function(){tools.squeak.addAction(1, 1, 1, 2, "flip-desk");}).toThrow()
		});
		
		//Check logic structures (where possible)
		it("should return false if start time is after end time", function() {
			var goodCall = tools.squeak.addAction(1, 1, 2, 2, "focus");
			var badCall = tools.squeak.addAction(1, 1, 3, 2, "focus");	
			expect(goodCall).toEqual(true);
			expect(badCall).toEqual(false);
		});
		
		//WARNING: 	This is an example that shows a 'gotcha.'  Normally we want each of our 
		//			tests to be atomic (aka, nothing bleeds over from one to the next), but
		//			as you can see the listOfActions value is accumulating over all the tests.
		it("should add several valid actions to the list of actions", function() {	
			var actionCount = tools.squeak.getListOfActionsCount();
			expect(actionCount).toEqual(this.startActionCount); //From prior tests.  A better solution is below.
			tools.squeak.addAction(1, 1, 2, 2, "focus");
			tools.squeak.addAction(1, 1, 1, 2, "autoScroll");
			tools.squeak.addAction(1, 1, 2, 2, "strike");
			actionCount = tools.squeak.getListOfActionsCount() - this.startActionCount;
			expect(actionCount).toEqual(3); //Actual test done here.
		});
		
		it("should add multiple actions given multiple lines", function() {
			tools.squeak.addAction(1, 3, 1, 3, "focus");
			var actionCount = tools.squeak.getListOfActionsCount() - this.startActionCount;
			expect(actionCount).toEqual(3);
		});
	});
	
	//Delete Action
	describe("deleteAction", function() {
		it("should delete an action", function() {
			tools.squeak.deleteAction(1);
			var actionCount = tools.squeak.getListOfActionsCount();
			expect(actionCount).toEqual(actionCount - 1);
		});
		
		it("should call writeListToFrontend", function() {
			tools.squeak.deleteAction(1);
			expect(tools.squeak.writeListToFrontend).toHaveBeenCalled();
		});
		
		it("should not throw an error unless an improper action is given", function() {
			expect(function(){tools.squeak.deleteAction(1);}).not.toThrow()
			expect(function(){tools.squeak.deleteAction("freak-out");}).toThrow()
		});
		
		it("should return false if id was not found", function() {
			var goodCall = tools.squeak.addAction(1);
			var badCall = tools.squeak.addAction(0);	
			expect(goodCall).toEqual(true);
			expect(badCall).toEqual(false);
		});
	});
	
	//Undo
	describe("undo", function() {
		
	});
	
	//Publish
	describe("publish", function() {
		
	});
});