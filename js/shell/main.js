function MainShell()
{
	var self = this;
	
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
		var documentElement = document.documentElement
		const scaleWith = ((100 / 640) * documentElement.clientWidth)
		const scaleHeight = ((100 / 480) * documentElement.clientHeight)
		const scale = Math.min(scaleWith, scaleHeight);
		$('.shell-main').get(0).style.scale =  Math.max(scale, 0) + '%'
	}
}

$(function(){
	main = new MainShell();
	main.init()
});