function SoundQueue()
{
	this._queue = [];
	this.now_playing = false;
	
	this.addSound = function(key)
	{
		if (this._queue.indexOf(key) == -1)
		{
			this._queue.push(key);
			if (!this.now_playing)
				this.playNext();
		}
	};
	
	this.addIfEmpty = function(key)
	{
		if (this._queue.length == 0)
			this.addSound(key);
	};
	
	this.playNext = function()
	{
		if (this._queue.length == 0)
		{
			this.now_playing = false;
			return;
		}
		
		var sound = game.resources.get(this._queue[0]), queue = this;
		sound.play();
		this.now_playing = true;
		
		sound.addEventListener('ended', function(){
			this.removeEventListener('ended', arguments.callee, false);
			queue._queue.shift();
			queue.playNext();
		});
	};
}