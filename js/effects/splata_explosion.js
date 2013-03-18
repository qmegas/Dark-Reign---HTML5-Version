function SplatAEffect(unit_pos_pixel)
{
	this._proto = SplatAEffect;
	
	this.init(unit_pos_pixel);
}

AbstractSimpleEffect.setCommonOptions(SplatAEffect);

SplatAEffect.resource_key = 'splata_explosion';
SplatAEffect.image_size = {width: 40, height: 40};
SplatAEffect.frames = 15;