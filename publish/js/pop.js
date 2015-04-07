var pop = Popcorn("#video");
pop.code ({
	start: 0,
	end: 0,
	onStart: function() {
		$('line0').addClass("fadeOut")
	}
});
pop.code ({
	start: 2,
	end: 2,
	onStart: function() {
		$('line0').removeClass("fadeOut")
	}
});
