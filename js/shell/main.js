function MainShell()
{
	var self = this;
	
	this.init = function()
	{
		if (!BrowserCheck.check())
		{
			BrowserCheck.standartMessage();
		}

		self.resize();
		$(window).on('resize', function() {
		 	self.resize()
		})
	};

	this.resize = function () {
		const scaleWith = ((100 / 640) * window.innerWidth)
		const scaleHeight = ((100 / 480) * window.innerHeight)
		const scale = Math.min(scaleWith, scaleHeight);
		$('.shell-main').get(0).style.scale =  Math.max(scale, 0) + '%'
	}
}

$(function(){
	main = new MainShell();
	main.init()
});