function PolyAcidWeapon()
{
	this._proto = PolyAcidWeapon;
}

AbstractWeapon.setCommonOptions(PolyAcidWeapon);

PolyAcidWeapon.effect = PolyAcidEffect;

PolyAcidWeapon.maximum_range = 5;
PolyAcidWeapon.firedelay = 675;
PolyAcidWeapon.offence = {
	type: 'M3',
	strength: 15
};