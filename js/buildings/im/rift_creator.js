function RiftCreatorBuilding(pos_x, pos_y, player)
{
	this._proto = RiftCreatorBuilding;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(RiftCreatorBuilding);

RiftCreatorBuilding.res_key = 'rift_creator';
RiftCreatorBuilding.obj_name = 'Rift Creator';
RiftCreatorBuilding.cost = 8000;
RiftCreatorBuilding.build_time = 160;
RiftCreatorBuilding.sell_cost = 4000;
RiftCreatorBuilding.sell_time = 80;
RiftCreatorBuilding.health_max = 1000;
RiftCreatorBuilding.energy = 200;
RiftCreatorBuilding.enabled = true;
RiftCreatorBuilding.can_build = true;
RiftCreatorBuilding.crater = 4;
//RiftCreatorBuilding.weapon = 'IMPriftCreator';

RiftCreatorBuilding.cell_size = {x: 4, y: 4};
RiftCreatorBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1];
RiftCreatorBuilding.move_matrix = [0,0,1,1,0,1,1,1,0,1,1,1,0,0,1,1];
RiftCreatorBuilding.cell_padding = {x: 2, y: 2};
RiftCreatorBuilding.images = {
	normal: {
		size: {x: 96, y: 89},
		padding: {x: 0, y: -7},
		animated: true,
		frames: [1,2,3,4,5]
	},
	shadow: {
		size: {x: 39, y: 42},
		padding: {x: -79, y: -59}
	}
};
RiftCreatorBuilding.hotpoints = [
	{x: 12, y: 12},
	{x: 72, y: 46},
	{x: 9, y: 66}
];