function WaterSellEffect(building_position)
{
	this.uid = 0;
	this.is_effect = true;
	
	this._proto = WaterSellEffect;
	
	this._position_now = {
		x: building_position.x * CELL_SIZE + 31,
		y: building_position.y * CELL_SIZE - 22
	};
	this._start_animation = (new Date).getTime();
	this._stop_animation = this._start_animation + this._proto.frames*this._proto.frame_speed;
	
	game.resources.get(this._proto.resource_key + '_sound').play();
	
	this.run = function()
	{
		if ((new Date).getTime() > this._stop_animation)
			game.deleteEffect(this.uid);
	}
	
	this.draw = function(current_time)
	{
		if (!this._checkOnScreen())
			return;
		
		var diff = (parseInt((current_time - this._start_animation) / this._proto.frame_speed) % this._proto.frames);
			
		game.objDraw.addElement(DRAW_LAYER_EFFECTS, this._position_now.x, {
			res_key: this._proto.resource_key,
			src_x: 0,
			src_y: diff * this._proto.image_size.height,
			src_width: this._proto.image_size.width,
			src_height: this._proto.image_size.height,
			x: parseInt(this._position_now.x - game.viewport_x),
			y: parseInt(this._position_now.y - game.viewport_y)
		});
	}
	
	this._checkOnScreen = function()
	{
		if ((game.viewport_x > (this._position_now.x + this._proto.image_size.width)) || 
			(game.viewport_y > (this._position_now.y + this._proto.image_size.height)) ||
			((game.viewport_x + VIEWPORT_SIZE) < this._position_now.x) ||
			((game.viewport_y + VIEWPORT_SIZE) < this._position_now.y))
			return false;
		
		return true;
	}
	
	this.onObjectDeletion = function() {}
}

WaterSellEffect.resource_key = 'water_sell';
WaterSellEffect.image_size = {width: 43, height: 96};
WaterSellEffect.frames = 7;
WaterSellEffect.frame_speed = 100;

WaterSellEffect.loadResources = function()
{
	game.resources.addImage(this.resource_key, 'images/effects/' + this.resource_key + '/sprite.png');
	game.resources.addSound(this.resource_key + '_sound', 'sounds/water_sell.' + AUDIO_TYPE);
}