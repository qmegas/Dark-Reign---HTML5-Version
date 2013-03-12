function PlasmaRifleWeapon()
{
	this._proto = PlasmaRifleWeapon;
}

AbstractWeapon.setCommonOptions(PlasmaRifleWeapon);

PlasmaRifleWeapon.effect = PlasmaRifleEffect;

PlasmaRifleWeapon.can_shoot_flyer = true;
PlasmaRifleWeapon.offence = {
	type: 'E3',
	strength: 1800
};