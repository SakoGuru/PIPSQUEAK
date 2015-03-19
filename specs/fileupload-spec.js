describe("fileupload", function() {
	
	var fileupload = require("../js/fileupload.js");
	
	beforeEach(function() {
		this.startActionCount = tools.squeak.getListOfActionsCount();
	});
	
	describe("uploadCode", function() {
		
		it("should upload a code file", function() {
			expect(input.files[0]).not.toBeNull();
		});
		
		it("should load into codemirror", function() {
			expect(editor.getValue()).not.toBeNull();
		});
	});
	
	describe("uploadVideo", function() {
		
	});
});