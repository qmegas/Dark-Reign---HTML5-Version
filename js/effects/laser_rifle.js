function LaserRifleEffect()
{
	this._proto = LaserRifleEffect;
}

AbstractWeaponEffect.setCommonOptions(LaserRifleEffect);

LaserRifleEffect.resource_key = 'laser_rifle';

LaserRifleEffect.images = {
	bulet: {
		size: {x: 8, y: 8},
		padding: {x: 4, y: 4},
		frames: 3
	},
	blast: {
		size: {x: 22, y: 25},
		padding: {x: 6, y: 18},
		frames: 13
	}
};