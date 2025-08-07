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
		
		var queue = this,
			sound = game.resources.get(this._queue[0]);

		sound.volume = game.resources.soundVolume;

		console.log('InterfaceSoundQueue', this._queue.length )

		function ended(){
			sound.removeEventListener('ended', arguments.callee, false);
			queue._queue.shift();
			queue.playNext();
		}

		sound.play().then(() => {
			this._now_playing = true;
		}).catch(function () {
			console.warn('failed to play', sound.src);
			ended();
		});
		
		sound.addEventListener('ended', function () {
			ended();
		});
	}
};