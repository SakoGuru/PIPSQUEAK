function writeList() {
	return true;
}

describe("tools", function () {
	var $ = require("../node_modules/jquery/dist/jquery");
	var tools = require("../js/tools.js");
		
	beforeEach(function (){
		spyOn(tools.squeak.prototype, "writeListToFrontend");
		//writeListToFrontend = jasmine.createSpy().andCallFake(writeList);
	});
	
	it("should add an action", function() {
		
		
		tools.squeak.addAction(1, 1, 1, 2, "focus");
		expect(writeListToFrontend).toHaveBeenCalled();
	});
});