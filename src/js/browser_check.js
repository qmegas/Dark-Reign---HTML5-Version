var BrowserCheck = {
	check: function()
	{
		//Support canvas
		var ret = !!document.createElement('canvas').getContext;
		if (!ret)
			return false;
		
		//Audio element
		ret = !!document.createElement('audio').canPlayType;
		if (!ret)
			return false;
		
		//Video support
		ret = !!document.createElement('video').canPlayType;
		if (!ret)
			return false;
		
		//WebM support
		if (document.createElement('video').canPlayType('video/webm') == '')
			return false;
		
		return true;
	},
		
	standartMessage: function()
	{
		$('.load-screen').css('background-image', 'url("images/interface/not_supported.png")');
	}
};