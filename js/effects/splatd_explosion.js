function SplatDEffect(unit_pos_pixel)
{
	this._proto = SplatDEffect;
	
	this.init(unit_pos_pixel);
}

AbstractSimpleEffect.setCommonOptions(SplatDEffect);

SplatDEffect.resource_key = 'splatd_explosion';
SplatDEffect.image_size = {width: 50, height: 50};
SplatDEffect.frames = 12;