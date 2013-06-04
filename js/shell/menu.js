var PUNKT_SOUNDS = 6;

function GameShell()
{
	this.resources = new ResourseLoader();
	
	this.init = function()
	{
		this.resources.addImage('level_select_screen', 'images/shell/level_select_tmp.png');
		
		this.resources.addSound('bridge_sound', 'sounds/shell/bridge.' + AUDIO_TYPE); //Just for preload
		for (i = 1; i <= PUNKT_SOUNDS; ++i)
			this.resources.addSound('punct_sound' + i, 'sounds/shell/punct_' + i + '.' + AUDIO_TYPE);
		
		this.resources.addVideo('cube_in', 'videos/cube_in.webm', 'menu_video');
		this.resources.addVideo('ring0', 'videos/m_ring00.webm', 'ring');
		
		this.resources.onLoaded = function(loaded, total){
			var progress = parseInt(500/total*loaded);
			$('#progress-bar').css({width: progress+'px'});
		};
		
		this.resources.onComplete = function(){
			$('.load-screen').hide();
			
			game_shell._runVideo('cube_in', function(){
				var sound = new Howl({
					urls: ['sounds/shell/bridge.' + AUDIO_TYPE],
					autoplay: true,
					loop: true
				});
				
				setInterval(game_shell.playPunktSound, 13000);
				
				game_shell.showLevelSelectScreen();
			});
		};
	};
	
	this.playPunktSound = function()
	{
		var i = Math.ceil(Math.random() * PUNKT_SOUNDS);
		game_shell.resources.play('punct_sound'+i);
	};
	
	this.showLevelSelectScreen = function()
	{
		var video = game_shell.resources.get('ring0');
		$('#level_select')
			.show()
			.append(video);
		
		$(video).attr('loop', true);
		video.play();
	};
	
	this._runVideo = function(video_name, callback)
	{
		var video = game_shell.resources.get(video_name), $cont = $('#video_container');
		
		video.addEventListener('ended', function(){
			$('#video_container').html('');
			if (callback)
				callback();
		});
		
		$cont.append(video);
		$cont.show();
		video.play();
	};
	
	this._copyVideoImage = function(ctx, video)
	{
		if(video.paused || video.ended) 
			return false;
		ctx.drawImage(video, 0, 0, 640, 480);
		setTimeout(game_shell._copyVideoImage(ctx, video), 50);
	};
}

$(function(){
	var img = new Image();
	img.src = 'images/interface/load-screen.png';
	img.onload = function(){
		game_shell = new GameShell();
		game_shell.init();
	};
});