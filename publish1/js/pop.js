document.addEventListener('DOMContentLoaded', function(event) {
var pop = Popcorn("#video");
pop.code ({
	start: 0,
	end: 2,
	onStart: function() {
		$('#line12').addClass("highlight");
	},
	onEnd: function() {
		$('#line12').removeClass("highlight");
	}
});
});