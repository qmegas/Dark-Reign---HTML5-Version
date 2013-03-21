function NeutronAssEffect()
{
	this._proto = NeutronAssEffect;
}

AbstractWeaponEffect.setCommonOptions(NeutronAssEffect);

NeutronAssEffect.resource_key = 'neutron_ass';

NeutronAssEffect.speed = 2000;

NeutronAssEffect.images = {
	bulet: {
		size: {x: 12, y: 12},
		padding: {x: 6, y: 6},
		frames: 4
	},
	blast: {
		size: {x: 55, y: 55},
		padding: {x: 27, y: 30},
		frames: 22
	}
};