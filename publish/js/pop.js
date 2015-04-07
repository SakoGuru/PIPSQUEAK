document.addEventListener('DOMContentLoaded', function(event) {
var pop = Popcorn("#video");
pop.code ({
	start: 1.799541,
	end: 3.799541,
	onStart: function() {
		$('#line0').addClass('strike');
	},
	onEnd: function() {
		$('#line0').removeClass('strike');
	}
});
});