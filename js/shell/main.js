function MainShell()
{
	var self = this;

	function getParameterByName(name, url) {
	    name = name.replace(/[\[\]]/g, '\\$&');
	    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}
	
	var config = {
		mode: getParameterByName('video', location.href) || 'hd', // scale / original / hd
		width: VIEWPORT_SIZE_X,
		height: VIEWPORT_SIZE_Y,
	} 
	
	this.init = function()
	{
		if (!BrowserCheck.check())
		{
			BrowserCheck.standartMessage();
		}

		$(window).on('resize orientationchange devicepixelratiochange', function() {
		 	self.resize()
		});

		$(window).ready(function () {
		 	self.resize()
		});
	};

	this.resize = function () {

		var documentElement = document.documentElement,
			viewportSize = {
				width: documentElement.clientWidth,
				height: documentElement.clientHeight,
			};

		var scaleWidth = ((100 / config.width) * viewportSize.width),
			scaleHeight = ((100 / config.height) * viewportSize.height),
			scale = Math.min(scaleWidth, scaleHeight);

		if (config.mode === 'scale') {

			// Set scale to ratio
			$('.shell-main').css({
				width: config.width,
				height: config.height,
				scale:  Math.max(scale, 0) + '%'
			});

		} else if (config.mode === 'hd') {

			VIEWPORT_SIZE_X = parseInt(viewportSize.width);
			VIEWPORT_SIZE_Y = parseInt(viewportSize.height);

			// Rescale menu and load screnn
			$('.shell-main .shell-menu, .shell-main .load-screen').css({
				width: config.width,
				height: config.height,
				scale:  Math.max(scale, 0) + '%',
				color: scale < 100 ? 'red' : 'blue',
    			'transform-origin': scale < 100 ? 'left' : 'center'
			});
			
			// Set scale to 1
			$('.shell-main').css({
				//'width': config.width,
				//'height': config.height,
				scale: 1
			});

			$('.game .top-panel').css({
				width: VIEWPORT_SIZE_X - RIGHT_FRAME_X,
				'min-width': config.width - RIGHT_FRAME_X
			});

			$('.game').css({
				width: VIEWPORT_SIZE_X,
				height: VIEWPORT_SIZE_Y,
			});

			$('.game .left-frame').css({
				width: VIEWPORT_SIZE_X,
				height: VIEWPORT_SIZE_Y,
			});

			$('.game .left-frame .game-area').css({
				width: VIEWPORT_SIZE_X - (RIGHT_FRAME_X * scale),
				//width: VIEWPORT_SIZE_X,
				height: VIEWPORT_SIZE_Y - TOP_BAR_Y,
			});

			$('.game .left-frame .game-area .view').css({
				//width: VIEWPORT_SIZE_X - (RIGHT_FRAME_X),
				width: VIEWPORT_SIZE_X,
				height: VIEWPORT_SIZE_Y - TOP_BAR_Y,
			});

			$('#mouseview, #viewport').attr({
				//width: viewportSize.width - (RIGHT_FRAME_X),
				width: VIEWPORT_SIZE_X,
				height: VIEWPORT_SIZE_Y - TOP_BAR_Y,
			});

		}
	}
}

$(function(){
	main = new MainShell();
	main.init()
});