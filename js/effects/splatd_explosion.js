function SplatDEffect(unit_pos_pixel)
{
	this._proto = SplatDEffect;
	
	this.initCustom = function() 
	{
		this._position_now = {
			x: unit_pos_pixel.x - 25,
			y: unit_pos_pixel.y - 25
		};
	};
	
	this.init();
}

AbstractSimpleEffect.setCommonOptions(SplatDEffect);

SplatDEffect.resource_key = 'splatd_explosion';
SplatDEffect.image_size = {width: 50, height: 50};
SplatDEffect.frames = 12;