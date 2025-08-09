function ResourseLoader()
{
	var self = this;
	
	this.soundVolume = GAMECONFIG.defaultSoundVolume;
	this.total = 0;
	this.loaded = 0;
	this.items = {};

	// Audio node management
	const MAX_AUDIO_NODES_PER_KEY = 10;
	this.audioPools = {}; // Pool of reusable audio nodes per key
	this.activeAudioNodes = {}; // Track currently playing nodes per key
	
	this.onLoaded = function(){};
	this.onComplete = function(){};
	
	this._counterUp = function()
	{
		//console.debug('ResourseLoader._counterUp', self.loaded, self.total)
		self.loaded++;
		self.onLoaded(self.loaded, self.total);

		if (self.loaded == self.total){
			self.onComplete();
		}
	};
	
	this._makeColoredImage = function(source_img, key, color)
	{
		var codes = {}, rgb_code,
			img = self.get(source_img), 
			canvas = document.createElement('canvas'), 
			ctx = canvas.getContext('2d');
		
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
		//console.log('ResourseLoader:addImage', key, mage_path, multicolor)
		if (!image_path) {
			console.warn('failed add image', key);
			return;
		}

		var skey = multicolor ? key + 'yellow' : key;

		if (self.isSet(skey))
			return;
		
		var img = new Image();
			
		img.onload = function(){
			if (multicolor)
				self._makeColoredImage(skey, key, 'red');
			self._counterUp();
		};

		img.onerror = function() {
			console.warn('failed to load', img.src);

			if (image_path.includes('/snow/')) {
				image_path = image_path.replace('/snow/', '/jungle/')
				img.src = image_path;
				debugger;
			}
		};

		img.src = image_path;

		self.items[skey] = img;
		self.total++;
	};
	
	this.addSound = function(key, sound_path)
	{
		//console.log('ResourseLoader:addSound', key, sound_path)
		if (self.isSet(key))
			return;
	
		var audio = new Audio();

		audio.onerror = function(){
			console.warn('failed to load', audio.src);
		};
		
		audio.addEventListener('loadedmetadata', function(){
			self._counterUp();
		});

		audio.src = sound_path;

		self.items[key] = audio;
		self.total++;
	};
	
	this.addVideo = function(key, video_path, class_name)
	{
		//console.log('ResourseLoader:addVideo', key, video_path, class_name)
		if (self.isSet(key))
			return;
		
		var video = document.createElement('video'), source = document.createElement('source');
		$(video).attr({
			id: 'example_video_test',
			'class': class_name,
			preload: 'auto',
			autoplay: false,
			playsinline: true,
			muted: true
		});

		video.onerror = function(){
			console.warn('failed to load', video.src);
		};

		video.addEventListener('abort', function(event){
			console.warn('abort to load', video.src);
		});
		
		video.addEventListener('loadedmetadata', function(){
			self._counterUp();
		});

		$(source).attr({
			// TODO check codec
			type: 'video/webm',
			src: video_path
		});

		$(video).append(source);
		
		self.items[key] = video;
		self.total++;

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

	// Initialize arrays for a key if they don't exist
	this._initializeAudioArrays = function(key)
	{
		if (!self.audioPools[key]) {
			self.audioPools[key] = [];
		}
		if (!self.activeAudioNodes[key]) {
			self.activeAudioNodes[key] = [];
		}
	};
	
	// Get an available audio node (recycled or new)
	this._getAudioNode = function(key)
	{
		self._initializeAudioArrays(key);
		
		var pool = self.audioPools[key];
		var active = self.activeAudioNodes[key];
		
		// First, try to find a recycled node that's not playing
		for (var i = 0; i < pool.length; i++) {
			var node = pool[i];
			if (node.paused || node.ended) {
				// Reset the recycled node
				console.count('_getAudioNode:resuse')
				node.currentTime = 0;
				return node;
			}
		}
		
		// If we haven't reached the limit, create a new node
		var totalNodes = pool.length + active.length;
		if (totalNodes < MAX_AUDIO_NODES_PER_KEY) {
			var originalAudio = self.get(key);
			var newNode = originalAudio.cloneNode(true);
			
			// Set up recycling when audio ends
			newNode.addEventListener('ended', function() {
				console.count('_getAudioNode:ended')
				self._recycleAudioNode(key, newNode);
			});
			
			return newNode;
		}
		
		// If we've reached the limit, recycle the oldest active node
		if (active.length > 0) {
			var oldestNode = active.shift();
			oldestNode.pause();
			oldestNode.currentTime = 0;
			console.count('_getAudioNode:recycle')
			return oldestNode;
		}
		
		// Fallback: should never reach here, but return first pool node if it exists
		if (pool.length > 0) {
			var fallbackNode = pool[0];
			fallbackNode.pause();
			fallbackNode.currentTime = 0;
			return fallbackNode;
		}
		
		// Last resort: create a new node (shouldn't happen)
		return self.get(key).cloneNode(true);
	};
	
	// Move a node from active to recycled pool
	this._recycleAudioNode = function(key, audioNode)
	{
		var active = self.activeAudioNodes[key];
		var pool = self.audioPools[key];
		
		// Remove from active list
		var activeIndex = active.indexOf(audioNode);
		if (activeIndex !== -1) {
			active.splice(activeIndex, 1);
		}
		
		// Add to recycled pool (if not already there)
		if (pool.indexOf(audioNode) === -1) {
			pool.push(audioNode);
		}
	};
	
	// Add a node to the active list
	this._addToActive = function(key, audioNode)
	{
		self.activeAudioNodes[key].push(audioNode);
	};
	
	// Optional: Method to clear all audio pools (useful for cleanup)
	this.clearAudioPools = function()
	{
		for (var key in self.audioPools) {
			var pool = self.audioPools[key];
			for (var i = 0; i < pool.length; i++) {
				var node = pool[i];
				node.pause();
				node.currentTime = 0;
				if (node.disconnect) {
					node.disconnect();
				}
			}
		}
		
		for (var key in self.activeAudioNodes) {
			var active = self.activeAudioNodes[key];
			for (var i = 0; i < active.length; i++) {
				var node = active[i];
				node.pause();
				node.currentTime = 0;
				if (node.disconnect) {
					node.disconnect();
				}
			}
		}
		
		self.audioPools = {};
		self.activeAudioNodes = {};
	};
	
	this.play = function(key, volume, multiple)
	{
		var item;
		
		if (multiple)
		{
			// Get a recycled or new audio node
			item = self._getAudioNode(key);
			
			// Add to active list
			self._addToActive(key, item);
		}
		else
		{
			item = self.get(key);
		}
		
		if (volume)
			item.volume = volume * self.soundVolume;
		else
			item.volume = self.soundVolume;
		
		item.play().catch((e) => {
			console.warn(key, e)
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
		
		len =  Math.sqrt(
			Math.pow((game.viewport_x + VIEWPORT_SIZE_X/2) - position.x, 2) + 
			Math.pow((game.viewport_y + VIEWPORT_SIZE_Y/2) - position.y, 2)
		);
		
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