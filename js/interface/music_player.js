var InterfaceMusicPlayer = {
	_volume: 1,
	_tracks: [], //['track1','track2','track3','track4','track5','track6','track7','track8'],
	_player: null,
	_current_track: 0,
	
	start: function()
	{
		if (this._tracks.length == 0)
			return;
		
		this._player = new Audio();
		this._player.autoplay = true;
		this._player.addEventListener('ended', function(){
			InterfaceMusicPlayer.nextTrack();
		});
		
		this.setTrack(0);
	},
		
	setVolume: function(volume)
	{
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
		if (this._tracks.length == 1)
			this._player.play();
		else
		{
			this._current_track++;
			if (this._current_track == this._tracks.length)
				this._current_track = 0;
			
			this.setTrack(this._current_track);
		}
	}
};