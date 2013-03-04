function SparksExplosionEffect(unit_pos_pixel)
{
	this._proto = SparksExplosionEffect;
	
	this.initCustom = function() 
	{
		this._position_now = {
			x: unit_pos_pixel.x - 50,
			y: unit_pos_pixel.y - 50
		};
	};
	
	this.init();
}

AbstractSimpleEffect.setCommonOptions(SparksExplosionEffect);

SparksExplosionEffect.resource_key = 'death_with_sparks_explosion';
SparksExplosionEffect.image_size = {width: 100, height: 100};
SparksExplosionEffect.frames = 13;