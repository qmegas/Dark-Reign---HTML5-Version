function PlasmaRifleEffect()
{
	this._proto = PlasmaRifleEffect;
}

AbstractWeaponEffect.setCommonOptions(PlasmaRifleEffect);

PlasmaRifleEffect.resource_key = 'plasma_rifle';

PlasmaRifleEffect.images = {
	bulet: {
		size: {x: 12, y: 10},
		padding: {x: 6, y: 5},
		frames: 4
	},
	blast: {
		size: {x: 40, y: 40},
		padding: {x: 16, y: 22},
		frames: 16
	}
};