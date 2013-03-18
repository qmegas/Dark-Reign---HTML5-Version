function SparksExplosionEffect(unit_pos_pixel)
{
	this._proto = SparksExplosionEffect;
	
	this.init(unit_pos_pixel);
}

AbstractSimpleEffect.setCommonOptions(SparksExplosionEffect);

SparksExplosionEffect.resource_key = 'death_with_sparks_explosion';
SparksExplosionEffect.image_size = {width: 100, height: 100};
SparksExplosionEffect.frames = 13;