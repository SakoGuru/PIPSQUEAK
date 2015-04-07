document.addEventListener("DOMContentLoaded", function(event) {
var pop = Popcorn("#video");
pop.code ({
	start: 1.265504,
	end: 4.265504,
	onStart: function() {
		$('#line0').addClass("strike");
		console.log("asdf");
	},
	onEnd: function() {
		$('#line0').removeClass("strike");
	}
	});
});