function MainShell()
{
	var self = this;

	var size = {
		height: 480,
		width: 640,
	}
	
	this.init = function()
	{
		if (!BrowserCheck.check())
		{
			BrowserCheck.standartMessage();
		}

		$(window).on('resize orientationchange', function() {
		 	self.resize()
		});

		$(window).ready(function () {
		 	self.resize()
		});
	};

	this.resize = function () {
		var documentElement = document.documentElement,
			scaleWidth = ((100 / size.width) * documentElement.clientWidth),
			scaleHeight = ((100 / size.height) * documentElement.clientHeight),
			scale = Math.min(scaleWidth, scaleHeight);
		$('.shell-main').get(0).style.scale =  Math.max(scale, 0) + '%'
	}
}

$(function(){
	main = new MainShell();
	main.init()
});