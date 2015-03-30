describe("fileupload", function() {
	
	var fileupload = require("../js/fileupload.js");
	
	beforeEach(function() {
		this.startActionCount = tools.squeak.getListOfActionsCount();
	});
	
	describe("uploadCode", function() {
		
		it("should upload a code file", function() {
			fileupload.loadFile();
			expect(fileupload.input.files[0]).not.toBeNull();
		});
		
		it("should load into codemirror", function() {
			fileupload.loadFile();
			expect(fileupload.editor.getValue()).not.toBeNull();
		});
	});
	
	describe("uploadVideo", function() {
		
		it("should call saveFile", function() {
			fileupload.loadVideo();
			expect(fileupload.squeak.saveFile).toHaveBeenCalled();
		});
	});
});