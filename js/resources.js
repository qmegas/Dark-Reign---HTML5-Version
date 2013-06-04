function ResourseLoader()
{
	this.soundVolume = 1;
	this.total = 0;
	this.loaded = 0;
	this.items = {};
	
	this.onLoaded = function(){};
	this.onComplete = function(){};
	
	this.setSoundVolume = function(vol)
	{
		this.soundVolume = vol;
	};
	
	this.addImage = function(key, image_path)
	{
		if (this.isSet(key))
			return;
		
		var img = new Image(), obj = this;
		img.src = image_path;
		this.items[key] = img;
		this.total++;
			
		img.onload = function(){
			obj.loaded++;
			obj.onLoaded(obj.loaded, obj.total);
			if (obj.loaded == obj.total)
				obj.onComplete();
		};
	};
	
	this.addSound = function(key, sound_path)
	{
		if (this.isSet(key))
			return;
		
		var audio = new Audio(), obj = this;
		audio.src = sound_path;
		this.items[key] = audio;
		this.total++;
		
		audio.addEventListener('canplaythrough', function(){
			obj.loaded++;
			obj.onLoaded(obj.loaded, obj.total);
			if (obj.loaded == obj.total)
				obj.onComplete();
		});
	};
	
	this.addVideo = function(key, video_path, class_name)
	{
		if (this.isSet(key))
			return;
		
		var video = document.createElement('video'), source = document.createElement('source'), obj = this;
		$(video).attr({
			id: 'example_video_test',
			class: class_name,
			preload: 'auto'
		});
		$(source).attr({
			type: 'video/webm',
			src: video_path
		});
		$(video).append(source);
		
		this.items[key] = video;
		this.total++;
		
		video.addEventListener('canplaythrough', function(){
			obj.loaded++;
			obj.onLoaded(obj.loaded, obj.total);
			if (obj.loaded == obj.total)
				obj.onComplete();
		});
	};
	
	this.addDirect = function(key, obj)
	{
		this.items[key] = obj;
	};
	
	this.isSet = function(key)
	{
		return (typeof this.items[key] !== 'undefined');
	};
	
	this.get = function(key)
	{
		if (!this.isSet(key))
			console.log('Requesting unexisting resource: ' + key);
		
		return this.items[key];
	};
	
	this.play = function(key, volume, multiple)
	{
		var item = this.get(key);
		
		if (multiple)
			item = item.cloneNode(true);
		
		if (volume)
			item.volume = volume * this.soundVolume;
		else
			item.volume = this.soundVolume;
		
		item.play();
	};
	
	this.playOnPosition = function(key, multiple, position, pos_pixels)
	{
		var len, half_screen_size = 316, volume;
		
		if (!pos_pixels)
			position = {
				x: position.x * CELL_SIZE,
				y: position.y * CELL_SIZE
			};
		
		len =  Math.sqrt(Math.pow((game.viewport_x + VIEWPORT_SIZE/2) - position.x, 2) + Math.pow((game.viewport_y + VIEWPORT_SIZE/2) - position.y, 2));
		
		if (len < half_screen_size)
			volume = 1;
		else if (len > half_screen_size*2)
			volume = 0;
		else
			volume = (1 - (len-half_screen_size)/half_screen_size);
		
		if (volume == 0)
			return;
		
		this.play(key, volume, multiple);
	};
}