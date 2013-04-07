function PolyAcidEffect()
{
	this._proto = PolyAcidEffect;
}

AbstractWeaponEffect.setCommonOptions(PolyAcidEffect);

PolyAcidEffect.resource_key = 'poly_acid';

PolyAcidEffect.images = {
	bulet: {
		size: {x: 4, y: 3},
		padding: {x: 2, y: 1},
		frames: 1
	},
	blast: {
		size: {x: 60, y: 49},
		padding: {x: 25, y: 23},
		frames: 50
	}
};