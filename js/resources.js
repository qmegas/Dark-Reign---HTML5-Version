function ResourseLoader()
{
	var self = this;
	
	this.soundVolume = GAMECONFIG.defaultSoundVolume;
	this.total = 0;
	this.loaded = 0;
	this.items = {};
	
	this.onLoaded = function(){};
	this.onComplete = function(){};
	
	this._counterUp = function()
	{
		self.loaded++;
			self.onLoaded(self.loaded, self.total);
			if (self.loaded == self.total)
				self.onComplete();
	};
	
	this._makeColoredImage = function(source_img, key, color)
	{
		var img = self.get(source_img), canvas = document.createElement('canvas'), ctx = canvas.getContext('2d'),
			codes = {}, rgb_code;
		
		codes[1396609] = {red: {r: 136, g: 7, b: 0}};
		codes[2385097] = {red: {r: 187, g: 7, b: 14}};
		codes[950783]  = {red: {r: 223, g: 28, b: 28}};
		codes[961791]  = {red: {r: 255, g: 36, b: 36}};
		codes[973055]  = {red: {r: 255, g: 43, b: 43}};
		codes[2883583] = {red: {r: 255, g: 57, b: 57}};
		codes[7602175] = {red: {r: 255, g: 72, b: 115}};
		codes[12320767] = {red: {r: 255, g: 108, b: 158}};
		
		canvas.width = img.width;
		canvas.height = img.height;
		
		ctx.drawImage(img, 0, 0);
		
		var data = ctx.getImageData(0, 0, img.width, img.height), i, total = img.width * img.height * 4;
		for (i = 0; i < total; i += 4)
		{
			if (data.data[i + 3] == 0)
				continue;

			rgb_code = data.data[i + 2] * 65536 + data.data[i + 1] * 256 + data.data[i];
			if (codes[rgb_code])
			{
				data.data[i] = codes[rgb_code][color].r;
				data.data[i + 1] = codes[rgb_code][color].g;
				data.data[i + 2] = codes[rgb_code][color].b;
			}
		}
		ctx.putImageData(data, 0, 0);
		
		var img2 = new Image();
		img2.src = canvas.toDataURL();
		self.items[key + color] = img2;
	};
	
	this.setSoundVolume = function(vol)
	{
		this.soundVolume = vol;
	};
	
	this.addImage = function(key, image_path, multicolor)
	{
		var skey = multicolor ? key + 'yellow' : key;
		if (self.isSet(skey))
			return;
		
		if (!image_path)
			debugger;
		
		var img = new Image();
		img.src = image_path;
		self.items[skey] = img;
		self.total++;
			
		img.onload = function(){
			if (multicolor)
				self._makeColoredImage(skey, key, 'red');
			self._counterUp();
		};
	};
	
	this.addSound = function(key, sound_path)
	{
		if (self.isSet(key))
			return;
		
		var audio = new Audio();
		audio.src = sound_path;
		self.items[key] = audio;
		self.total++;
		
		audio.addEventListener('canplaythrough', function(){
			self._counterUp();
		});
	};
	
	this.addVideo = function(key, video_path, class_name)
	{
		if (self.isSet(key))
			return;
		
		var video = document.createElement('video'), source = document.createElement('source');
		$(video).attr({
			id: 'example_video_test',
			'class': class_name,
			preload: 'auto'
		});
		$(source).attr({
			type: 'video/webm',
			src: video_path
		});
		$(video).append(source);
		
		self.items[key] = video;
		self.total++;
		
		video.addEventListener('canplaythrough', function(){
			self._counterUp();
		});
	};
	
	this.addDirect = function(key, obj)
	{
		self.items[key] = obj;
	};
	
	this.isSet = function(key)
	{
		return (typeof self.items[key] !== 'undefined');
	};
	
	this.get = function(key)
	{
		if (!self.isSet(key))
			console.log('Requesting unexisting resource: ' + key);
		
		return self.items[key];
	};
	
	this.play = function(key, volume, multiple)
	{
		var item = self.get(key);
		
		if (multiple)
			item = item.cloneNode(true);
		
		if (volume)
			item.volume = volume * self.soundVolume;
		else
			item.volume = self.soundVolume;
		
		item.play().catch((e) => {
			console.warn(e)
		});
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
		
		self.play(key, volume, multiple);
	};
	
	this.loadScript = function(file, callback)
	{
		$.get(file, function(js){
			eval(js);
			if (callback)
				callback();
		});
	};
}