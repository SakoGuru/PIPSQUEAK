document.addEventListener('DOMContentLoaded', function(event) {
var pop = Popcorn("#video");
pop.code ({
	start: 0.894,
	end: 2.894,
	onStart: function() {
		$('#line0').addClass("strike");
	},
	onEnd: function() {
		$('#line0').removeClass("strike");
	}
});
pop.code ({
	start: 3.110735,
	end: 4.110735,
	onStart: function() {
		$('#line1').addClass("highlight");
	},
	onEnd: function() {
		$('#line1').removeClass("highlight");
	}
});
});