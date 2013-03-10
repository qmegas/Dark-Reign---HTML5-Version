function AbstractSimpleEffect()
{
	this.uid = -1;
	this.is_effect = true;
	this._proto = null;
	this._position_now = null;
	this._start_animation = 0;
	this._stop_animation = 0;
	
	this.init = function()
	{
		this._start_animation = (new Date).getTime();
		this._stop_animation = this._start_animation + this._proto.frames*this._proto.frame_speed;
		this.initCustom();
	};
	
	this.run = function()
	{
		if ((new Date).getTime() > this._stop_animation)
			game.deleteEffect(this.uid);
	};
	
	this.draw = function(current_time)
	{
		if (!this._checkOnScreen())
			return;
		
		var diff = parseInt((current_time - this._start_animation) / this._proto.frame_speed);
		if (diff >= this._proto.frames)
			return;
			
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

	obj.loadResources = function() 
	{
		AbstractSimpleEffect.loadResources(this);
	};
};

AbstractSimpleEffect.createUnitKillEffect = function(unit_proto, pos_pixel)
{
	var effect, eid, ucenter = {
		x: pos_pixel.x + parseInt(unit_proto.images.stand.size.x / 2),
		y: pos_pixel.y + parseInt(unit_proto.images.stand.size.y / 2)
	};
	
	switch(unit_proto.die_effect)
	{
		case 'death_with_sparks_explosion':
			effect = new SparksExplosionEffect(ucenter);
			break;
		case 'splata_explosion':
			effect = new SplatAEffect(ucenter);
			break;
		case 'splatb_explosion':
			effect = new SplatBEffect(ucenter);
			break;
		case 'splatd_explosion':
			effect = new SplatDEffect(ucenter);
			break;
		default:
			return;
	}
	
	eid = game.addEffect(effect);
	effect.uid = eid;
};