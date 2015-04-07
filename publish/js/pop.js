document.addEventListener("DOMContentLoaded", function(event) { 
	var pop = Popcorn("#video");
	pop.code ({
		start: 1,
		end: 3,
		onStart: function() {
			$('#line0').addClass('highlight');
		},
		onEnd: function() {
			$('#line0').removeClass('highlight');
		}
	});
});

