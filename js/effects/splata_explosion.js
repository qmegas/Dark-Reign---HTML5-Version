function SplatAEffect(unit_pos_pixel)
{
	this._proto = SplatAEffect;
	
	this.initCustom = function() 
	{
		this._position_now = {
			x: unit_pos_pixel.x - 20,
			y: unit_pos_pixel.y - 20
		};
	};
	
	this.init();
}

AbstractSimpleEffect.setCommonOptions(SplatAEffect);

SplatAEffect.resource_key = 'splata_explosion';
SplatAEffect.image_size = {width: 40, height: 40};
SplatAEffect.frames = 15;