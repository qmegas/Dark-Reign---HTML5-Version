var InterfaceMusicPlayer = {
	_volume: GAMECONFIG.defaultMusicVolume,
	_tracks: (GAMECONFIG.playMusic) ? ['track1','track2','track3','track4','track5','track6','track7','track8'] : [],
	_player: null,
	_current_track: -1,
	
	start: function()
	{
		if (this._tracks.length == 0)
			return;
		
		this._player = new Audio();
		this._player.autoplay = true;
		this._player.addEventListener('ended', function(){
			InterfaceMusicPlayer.nextTrack();
		});
		
		this.nextTrack();
		this.setVolume(GAMECONFIG.defaultMusicVolume);
	},
		
	setVolume: function(volume)
	{
		if (this._tracks.length == 0)
			return;
		
		if (volume == 0)
		{
			if (this._volume > 0)
				this._player.pause();
		}
		else
		{
			if (this._volume == 0)
				this._player.play();
		}
		
		this._volume = volume;
		this._player.volume = volume;
	},
		
	setTrack: function(trackid)
	{
		this._player.src = 'music/' + this._tracks[trackid] + '.' + AUDIO_TYPE;
	},
		
	nextTrack: function()
	{
		var track;
		//do {
			track = parseInt(Math.random() * this._tracks.length);
		//} while (track != this._current_track);
		
		this._current_track = track;
		this.setTrack(this._current_track);
	}
};