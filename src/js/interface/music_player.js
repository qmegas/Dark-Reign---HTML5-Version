var InterfaceMusicPlayer = {
	_volume: GAMECONFIG.defaultMusicVolume,
	_tracks: (GAMECONFIG.playMusic) ? ['track1','track2','track3','track4','track5','track6','track7','track8'] : [],
	_player: null,
	_current_track: -1,
	playing: false,
	
	start: function()
	{
		if (this.playing || this._tracks.length == 0)
			return;
		
		this.nextTrack();
		this.setVolume(GAMECONFIG.defaultMusicVolume);

		this.playing = true;
	},

	stop() {

	    if (this._player) {
	    	this._player.stop();
	    	this._player = null;
	    }

		this.playing = false;
	},

	toggle() {

		if (this.playing) {
			this.stop();
		} else {
			this.start();
		}
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
		this._player.volume(volume);
	},
		
	setTrack: function(trackid)
	{
		var self = this,	
			track = parseInt(Math.random() * this._tracks.length) + 1;

		this._player = new Howl({
			src: ['music/track' + track + '.' + AUDIO_TYPE],
			volume: this.volume,
			autoplay: true,
			loop: false
		});
		// Fires when the sound finishes playing.
		this._player.on('end', function(){
			if (this.playing) {
				self.nextTrack();
			}  
		});
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