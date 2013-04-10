function AbstractSimpleEffect()
{
	this.uid = -1;
	this.is_effect = true;
	this._proto = null;
	this._position_now = null;
	this._start_animation = 0;
	this._stop_animation = 0;
	
	this.init = function(pos)
	{
		this._start_animation = (new Date).getTime();
		this._stop_animation = this._start_animation + this._proto.frames*this._proto.frame_speed;
		this._position_now = {
			x: pos.x - parseInt(this._proto.image_size.width / 2),
			y: pos.y - parseInt(this._proto.image_size.height / 2)
		};
		this.initCustom(pos);
	};
	
	this.run = function()
	{
		if (!this._proto.is_infine)
		{
			if ((new Date).getTime() > this._stop_animation)
				game.deleteEffect(this.uid);
		}
	};
	
	this.draw = function(current_time)
	{
		if (!this._checkOnScreen())
			return;
		
		var diff = parseInt((current_time - this._start_animation) / this._proto.frame_speed);
		if (!this._proto.is_infine && (diff >= this._proto.frames))
			return;
		
		diff %= this._proto.frames;
			
		game.objDraw.addElement(DRAW_LAYER_EFFECTS, this._position_now.x, {
			res_key: this._proto.resource_key,
			src_x: 0,
			src_y: diff * this._proto.image_size.height,
			src_width: this._proto.image_size.width,
			src_height: this._proto.image_size.height,
			x: parseInt(this._position_now.x - game.viewport_x),
			y: parseInt(this._position_now.y - game.viewport_y)
		});
	};
	
	this._checkOnScreen = function()
	{
		if ((game.viewport_x > (this._position_now.x + this._proto.image_size.width)) || 
			(game.viewport_y > (this._position_now.y + this._proto.image_size.height)) ||
			((game.viewport_x + VIEWPORT_SIZE) < this._position_now.x) ||
			((game.viewport_y + VIEWPORT_SIZE) < this._position_now.y))
			return false;
		
		return true;
	};
	
	this.onObjectDeletion = function() {};
	this.initCustom = function() {};
}

AbstractSimpleEffect.loadResources = function(obj)
{
	game.resources.addImage(obj.resource_key, 'images/effects/' + obj.resource_key + '/sprite.png');
};

AbstractSimpleEffect.setCommonOptions = function(obj)
{
	obj.prototype = new AbstractSimpleEffect();

	obj.resource_key = '';      //Must redeclare
	obj.image_size = {};        //Must redeclare
	obj.frames = 0;
	obj.frame_speed = 100;
	obj.is_infine = false;

	obj.loadResources = function() 
	{
		AbstractSimpleEffect.loadResources(this);
	};
};