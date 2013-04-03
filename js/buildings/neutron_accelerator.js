function NeutronAcceleratorBuilding(pos_x, pos_y, player)
{
	this._proto = NeutronAcceleratorBuilding;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(NeutronAcceleratorBuilding);

NeutronAcceleratorBuilding.res_key = 'neutron_accelerator';
NeutronAcceleratorBuilding.obj_name = 'Neutron Accelerator';
NeutronAcceleratorBuilding.cost = 1700;
NeutronAcceleratorBuilding.build_time = 34;
NeutronAcceleratorBuilding.sell_cost = 850;
NeutronAcceleratorBuilding.sell_time = 17;
NeutronAcceleratorBuilding.health_max = 550;
NeutronAcceleratorBuilding.energy = 100;
NeutronAcceleratorBuilding.enabled = false;
NeutronAcceleratorBuilding.can_build = true;
NeutronAcceleratorBuilding.crater = 1;
NeutronAcceleratorBuilding.weapon = NeutronAssWeapon;

NeutronAcceleratorBuilding.cell_size = {x: 3, y: 3};
NeutronAcceleratorBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1];
NeutronAcceleratorBuilding.move_matrix = [1,1,1,1,1,1,1,1,1];
NeutronAcceleratorBuilding.cell_padding = {x: 1, y: 1};
NeutronAcceleratorBuilding.images = {
	normal: {
		size: {x: 72, y: 67},
		padding: {x: 0, y: -5}
	},
	shadow: {
		size: {x: 56, y: 32},
		padding: {x: -25, y: -40}
	},
	weapon: {
		size: {x: 70, y: 55},
		padding: {x: -1, y: 12},
		animated: true,
		frames: 2
	}
};