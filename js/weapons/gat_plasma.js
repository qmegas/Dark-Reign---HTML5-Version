function GatPlasmaWeapon()
{
	this._proto = GatPlasmaWeapon;
}

AbstractWeapon.setCommonOptions(GatPlasmaWeapon);

GatPlasmaWeapon.effect = GatPlasmaEffect;

GatPlasmaWeapon.maximum_range = 5;
GatPlasmaWeapon.firedelay = 108;
GatPlasmaWeapon.can_shoot_flyer = true;
GatPlasmaWeapon.offence = {
	type: 'E3',
	strength: 10
};