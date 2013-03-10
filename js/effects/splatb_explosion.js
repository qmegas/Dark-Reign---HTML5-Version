function SplatBEffect(unit_pos_pixel)
{
	this._proto = SplatBEffect;
	
	this.initCustom = function() 
	{
		this._position_now = {
			x: unit_pos_pixel.x - 20,
			y: unit_pos_pixel.y - 20
		};
	};
	
	this.init();
}

AbstractSimpleEffect.setCommonOptions(SplatBEffect);

SplatBEffect.resource_key = 'splatb_explosion';
SplatBEffect.image_size = {width: 40, height: 40};
SplatBEffect.frames = 15;