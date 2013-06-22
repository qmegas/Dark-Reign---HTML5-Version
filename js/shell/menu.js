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
		this.resources.addImage('css3', 'images/shell/objective.png');
		this.resources.addImage('css4', 'images/shell/objective-fg.png');
		this.resources.addImage('css5', 'images/shell/objective-imp.png');
		this.resources.addImage('css6', 'images/shell/launch-btn.png');
		this.resources.addImage('css7', 'images/shell/arrows.png');
		this.resources.addImage('css8', 'images/shell/scroll.png');
		
		this.resources.addImage('font-normal', 'images/shell/font-normal.png');
		this.resources.addImage('font-red', 'images/shell/font-red.png');
		this.resources.addImage('font-white', 'images/shell/font-white.png');
		this.resources.addImage('font-game', 'images/font.png');
		
		this.resources.addSound('bridge_sound', 'sounds/shell/bridge.' + AUDIO_TYPE);
		for (var i = 1; i <= PUNKT_SOUNDS; ++i)
			this.resources.addSound('punct_sound' + i, 'sounds/shell/punct_' + i + '.' + AUDIO_TYPE);
		
		if (GAMECONFIG.playVideo)
		{
			this.resources.addVideo('cube_in', 'videos/cube_in.webm', 'menu_video');
			this.resources.addVideo('cube01', 'videos/cube01.webm', 'menu_video');
			this.resources.addVideo('cube02', 'videos/cube02.webm', 'menu_video');
			this.resources.addVideo('cube03', 'videos/cube03.webm', 'menu_video');
			this.resources.addVideo('cube04', 'videos/cube04.webm', 'menu_video');
			this.resources.addVideo('cube05', 'videos/cube05.webm', 'menu_video');
			this.resources.addVideo('brief_fg', 'videos/brief_fg.webm');
			this.resources.addVideo('brief_imp', 'videos/brief_imp.webm');
		}
		this.resources.addVideo('ring0', 'videos/m_ring00.webm', 'ring');
		
		
		this.resources.onLoaded = function(loaded, total){
			var progress = parseInt(500/total*loaded);
			$('#progress-bar').css({width: progress+'px'});
		};
		
		this.resources.onComplete = function(){
			var game_font = new FontDraw('font-game', 14);
			
			$('.load-screen').hide();
			
			self.fontNormal = new FontDraw('font-normal', 18);
			self.fontRed = new FontDraw('font-red', 20);
			
			$('#link_archive_text, #link_archive2_text').css('background-image', self.makeLinkImage('ARCHIVE'));
			$('#link_back_text, #link_lan_back_text').css('background-image', self.makeLinkImage('BACK'));
			$('#link_mession_text').css('background-image', self.makeLinkImage('MISSION'));
			$('#link_main_text').css('background-image', self.makeLinkImage('MAIN INTERFACE'));
			$('#link_fg_text').css('background-image', self.makeLinkImage('FREEDOM GUARD'));
			$('#link_imp_text').css('background-image', self.makeLinkImage('IMPERIUM'));
			$('#link_launch_text').css('background-image', self.makeLinkImage('LAUNCH'));
			
			$('#level_name').css('background-image', 'url("' + self.fontRed.getDataUrl('2JUNGLE TEST LEVEL') + '")');
			$('#archive_up').css('background-image', 'url("' + game_font.getDataUrl('UP ONE LEVEL') + '")');
			
			ShellArchive.init();
			
			self.videoIntro();
		};
	};
	
	this.playPunktSound = function()
	{
		var i = Math.ceil(Math.random() * PUNKT_SOUNDS);
		self.resources.play('punct_sound'+i);
	};
	
	this.navigate = function(nav_to, animation, params)
	{
		if (nav_to == 'back')
			nav_to = self.prev_screen;
		
		if (self.curr_srcreen != '')
			$('#' + self.curr_srcreen).hide();
		
		var callback = function(){
			if (nav_to == 'archive')
				ShellArchive.restart();
			else if (nav_to == 'objective')
				$('#level_name_obj').css('background-image', 'url("' + self.fontRed.getDataUrl('2JUNGLE TEST LEVEL') + '")');
			else if (nav_to == 'launch')
			{
				$('#launch').removeClass('imp fg').addClass(params);
				self._runVideo('brief_'+params, function(){
					$('#' + nav_to).show();
				});
			}
			
			if (params === undefined)
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
			new Howl({
				urls: ['sounds/shell/bridge.' + AUDIO_TYPE],
				autoplay: true,
				loop: true
			});

			setInterval(self.playPunktSound, 13000);

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
		if (!GAMECONFIG.playVideo)
		{
			if (callback)
				callback();
			return;
		}
			
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
	
	this.makeLinkImage = function(text)
	{
		var size = self.fontNormal.getSize(text),
			tmp_canvas = $('<canvas width="' + size + '" height="54"></canvas>'),
			ctx = tmp_canvas.get(0).getContext('2d');
		
		self.fontNormal.drawOnCanvas(text, ctx, 0, 0);
		self.fontNormal.drawOnCanvas(text, ctx, 0, 18, 'red');
		self.fontNormal.drawOnCanvas(text, ctx, 0, 36, 'green');
		
		return 'url("' + tmp_canvas.get(0).toDataURL() + '")';
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
		game.navigate($this.attr('data-to'), $this.attr('data-way'), $this.attr('data-param'));
	});
	$('#launch_btn').click(function(){
		document.location.href = 'game.html';
	});
	$('#archive_up').click(function(){
		ShellArchive.pageUp();
	});
	$('#archive_content .text').live('click', function(){
		ShellArchive.viewPage($(this).attr('data-node'));
	});
});