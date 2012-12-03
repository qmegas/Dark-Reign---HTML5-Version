function ResourseLoader()
{
	this.total = 0;
	this.loaded = 0;
	this.items = {};
	
	this.onLoaded = function(){}
	this.onComplete = function(){}
	
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
		}
	}
	
	this.addSound = function(key, sound_path)
	{
		if (this.isSet(key))
			return;
		
		var audio = new Audio(), obj = this;;
		audio.src = sound_path;
		this.items[key] = audio;
		this.total++;
		
		audio.addEventListener('canplaythrough', function(){ //Cross-browsing? Change to: audio.addEventListener('canplaythrough', callback, false);
			obj.loaded++;
			obj.onLoaded(obj.loaded, obj.total);
			if (obj.loaded == obj.total)
				obj.onComplete();
		});
	}
	
	this.addDirect = function(key, obj)
	{
		this.items[key] = obj;
	}
	
	this.isSet = function(key)
	{
		return (typeof this.items[key] !== 'undefined');
	}
	
	this.get = function(key)
	{
		if (!this.isSet(key))
			console.log('Requesting unexisting resource: ' + key);
		
		return this.items[key];
	}
}