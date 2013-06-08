var PUNKT_SOUNDS = 6;

function GameShell()
{
	var self = this;
	
	this.resources = new ResourseLoader();
	
	this.init = function()
	{
		this.resources.addImage('css1', 'images/shell/level_select_tmp.png');
		this.resources.addImage('css2', 'images/shell/archive.png');
		
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
			self.videoIntro();
		};
	};
	
	this.playPunktSound = function()
	{
		var i = Math.ceil(Math.random() * PUNKT_SOUNDS);
		self.resources.play('punct_sound'+i);
	};
	
	this.showLevelSelectScreen = function()
	{
		var video = self.resources.get('ring0');
		$('#level_select')
			.show()
			.append(video);
		
		$(video).attr('loop', true);
		video.play();
	};
	
	this.showArchive = function()
	{
		$('#archive').show();
	};
	
	this.videoRight = function(callback)
	{
		self._moveCube('cube03', callback);
	};
	
	this.videoLeft = function(callback)
	{
		self._moveCube('cube02', callback);
	};
	
	this.videoUp = function(callback)
	{
		self._moveCube('cube04', callback);
	};
	
	this.videoDown = function(callback)
	{
		self._moveCube('cube05', callback);
	};
	
	this.videoIntro = function()
	{
		self._runVideo('cube_in', function(){
			new Howl({
				urls: ['sounds/shell/bridge.' + AUDIO_TYPE],
				autoplay: true,
				loop: true
			});

			setInterval(self.playPunktSound, 13000);

			self.showLevelSelectScreen();
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
		var video = self.resources.get(video_name), $cont = $('#video_container');
		
		video.addEventListener('ended', function(){
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
		game_shell = new GameShell();
		game_shell.init();
	};
	
	$('#test').click(function(){
		$('#level_select').hide();
		game_shell.videoRight(function(){
			game_shell.showArchive();
		});
	});
});