var PUNKT_SOUNDS = 6;

function GameShell()
{
	var self = this;
	
	this.curr_srcreen = '';
	this.prev_screen = '';
	
	this.resources = new ResourseLoader();
	this.fontNormal = null;
	this.fontRed = null;
	
	this.init = function()
	{
		if (!BrowserCheck.check())
		{
			BrowserCheck.standartMessage();
			return;
		}
		
		this.resources.addImage('css1', 'images/shell/level_select.png');
		this.resources.addImage('css2', 'images/shell/archive.png');
		
		this.resources.addImage('font-normal', 'images/shell/font-normal.png');
		this.resources.addImage('font-red', 'images/shell/font-red.png');
		
		this.resources.addSound('bridge_sound', 'sounds/shell/bridge.' + AUDIO_TYPE); //Just for preload
		for (var i = 1; i <= PUNKT_SOUNDS; ++i)
			this.resources.addSound('punct_sound' + i, 'sounds/shell/punct_' + i + '.' + AUDIO_TYPE);
		
		this.resources.addVideo('cube_in', 'videos/cube_in.webm', 'menu_video');
		this.resources.addVideo('cube01', 'videos/cube01.webm', 'menu_video');
		this.resources.addVideo('cube02', 'videos/cube02.webm', 'menu_video');
		this.resources.addVideo('cube03', 'videos/cube03.webm', 'menu_video');
		this.resources.addVideo('cube04', 'videos/cube04.webm', 'menu_video');
		this.resources.addVideo('cube05', 'videos/cube05.webm', 'menu_video');
		this.resources.addVideo('ring0', 'videos/m_ring00.webm', 'ring');
		
		this.resources.onLoaded = function(loaded, total){
			var progress = parseInt(500/total*loaded);
			$('#progress-bar').css({width: progress+'px'});
		};
		
		this.resources.onComplete = function(){
			$('.load-screen').hide();
			
			this.fontNormal = new FontDraw('font-normal', 18);
			this.fontRed = new FontDraw('font-red', 20);
			
			$('#link_archive_text, #link_archive2_text').css('background-image', 'url("' + this.fontNormal.getDataUrl('ARCHIVE') + '")');
			$('#link_back_text').css('background-image', 'url("' + this.fontNormal.getDataUrl('BACK') + '")');
			$('#link_mession_text').css('background-image', 'url("' + this.fontNormal.getDataUrl('MISSION') + '")');
			
			$('#level_name').css('background-image', 'url("' + this.fontRed.getDataUrl('2JUNGLE TEST LEVEL') + '")');
			
			self.videoIntro();
		};
	};
	
	this.playPunktSound = function()
	{
		var i = Math.ceil(Math.random() * PUNKT_SOUNDS);
		self.resources.play('punct_sound'+i);
	};
	
	this.navigate = function(nav_to, animation)
	{
		if (nav_to == 'back')
			nav_to = self.prev_screen;
		
		if (self.curr_srcreen != '')
			$('#' + self.curr_srcreen).hide();
		
		var callback = function(){
			$('#' + nav_to).show();
			self.prev_screen = self.curr_srcreen;
			self.curr_srcreen = nav_to;
		};
		
		switch (animation)
		{
			case 'up':
				self._moveCube('cube04', callback);
				break;
			case 'down':
				self._moveCube('cube05', callback);
				break;
			case 'left':
				self._moveCube('cube02', callback);
				break;
			case 'right':
				self._moveCube('cube03', callback);
				break;
		}
	};
	
	this.showArchive = function()
	{
		$('#archive').show();
	};
	
	this.showObjective = function()
	{
		$('#objective').show();
	};
	
	this.videoIntro = function()
	{
		self._runVideo('cube_in', function(){
//			new Howl({
//				urls: ['sounds/shell/bridge.' + AUDIO_TYPE],
//				autoplay: true,
//				loop: true
//			});
//
//			setInterval(self.playPunktSound, 13000);

			self.curr_srcreen = 'level_select';
			var video = self.resources.get('ring0');
			$('#level_select').show().append(video);
			$(video).attr('loop', true);
			video.play();
		});
	};
	
	this._moveCube = function(animation_name, callback)
	{
		self._runVideo(animation_name, function(){
			self._runVideo('cube01', function(){
				if (callback)
					callback();
			});
		});
	};
	
	this._runVideo = function(video_name, callback)
	{
//		if (callback)
//			callback();
//		return;
			
		var video = self.resources.get(video_name), $cont = $('#video_container');
		
		video.addEventListener('ended', function(){
			this.removeEventListener('ended', arguments.callee, false);
			$('#video_container').html('');
			if (callback)
				callback();
		});
		
		$cont.append(video);
		$cont.show();
		video.play();
	};
}

$(function(){
	var img = new Image();
	img.src = 'images/interface/load-screen.png';
	img.onload = function(){
		game = new GameShell();
		game.init();
	};
	
	$('.moovable').click(function(){
		var $this = $(this);
		game.navigate($this.attr('data-to'), $this.attr('data-way'));
	});
});