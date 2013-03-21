function NeutronAssWeapon()
{
	this._proto = NeutronAssWeapon;
}

AbstractWeapon.setCommonOptions(NeutronAssWeapon);

NeutronAssWeapon.effect = NeutronAssEffect;

NeutronAssWeapon.maximum_range = 9;
NeutronAssWeapon.firedelay = 1080;
NeutronAssWeapon.offence = {
	type: 'E3',
	strength: 180
};