function SplatBEffect(unit_pos_pixel)
{
	this._proto = SplatBEffect;
	
	this.init(unit_pos_pixel);
}

AbstractSimpleEffect.setCommonOptions(SplatBEffect);

SplatBEffect.resource_key = 'splatb_explosion';
SplatBEffect.image_size = {width: 40, height: 40};
SplatBEffect.frames = 15;