function GatPlasmaEffect()
{
	this._proto = GatPlasmaEffect;
}

AbstractWeaponEffect.setCommonOptions(GatPlasmaEffect);

GatPlasmaEffect.resource_key = 'gat_plasma';

GatPlasmaEffect.images = {
	bulet: {
		size: {x: 20, y: 18},
		padding: {x: 10, y: 9},
		frames: 4
	},
	blast: {
		size: {x: 50, y: 42},
		padding: {x: 23, y: 22},
		frames: 16
	}
};