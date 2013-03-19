function NeutronAcceleratorBuilding(pos_x, pos_y, player)
{
	this._proto = NeutronAcceleratorBuilding;
	this.player = player;
	
	this.init(pos_x, pos_y);
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
NeutronAcceleratorBuilding.weapon = 123;

NeutronAcceleratorBuilding.cell_size = {x: 3, y: 3};
NeutronAcceleratorBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1];
NeutronAcceleratorBuilding.move_matrix = [1,1,1,1,1,1,1,1,1];
NeutronAcceleratorBuilding.cell_padding = {x: 1, y: 1};
NeutronAcceleratorBuilding.image_size = {x: 72, y: 67};
NeutronAcceleratorBuilding.image_padding = {x: 0, y: -5};
NeutronAcceleratorBuilding.shadow_image_size = {x: 56, y: 32};
NeutronAcceleratorBuilding.shadow_image_padding = {x: -25, y: -40};
NeutronAcceleratorBuilding.weapon_image_size = {x: 70, y: 55};
NeutronAcceleratorBuilding.weapon_image_padding = {x: -1, y: 12};