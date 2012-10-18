function ResourseLoader()
{
	this.total = 0;
	this.loaded = 0;
	this.items = {};
	
	this.onLoaded = function(){}
	this.onComplete = function(){}
	
	this.addImage = function(key, image_path)
	{
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
	
	this.get = function(key)
	{
		return this.items[key];
	}
}