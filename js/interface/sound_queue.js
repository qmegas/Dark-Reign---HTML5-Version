var InterfaceSoundQueue = {
	_queue: [],
	_now_playing: false,
	
	addSound: function(key)
	{
		if (this._queue.indexOf(key) == -1)
		{
			this._queue.push(key);
			if (!this._now_playing)
				this.playNext();
		}
	},
	
	addIfEmpty: function(key)
	{
		if (this._queue.length == 0)
			this.addSound(key);
	},
	
	playNext: function()
	{
		if (this._queue.length == 0)
		{
			this._now_playing = false;
			return;
		}
		
		var sound = game.resources.get(this._queue[0]), queue = this;
		sound.volume = game.resources.soundVolume;
		sound.play();
		this._now_playing = true;
		
		sound.addEventListener('ended', function(){
			this.removeEventListener('ended', arguments.callee, false);
			queue._queue.shift();
			queue.playNext();
		});
	}
};