function FieldHospitalBuilding(pos_x, pos_y, player)
{
	this._proto = FieldHospitalBuilding;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(FieldHospitalBuilding);

FieldHospitalBuilding.res_key = 'field_hospital';
FieldHospitalBuilding.obj_name = 'Field Hospital';
FieldHospitalBuilding.cost = 500;
FieldHospitalBuilding.build_time = 10;
FieldHospitalBuilding.sell_cost = 250;
FieldHospitalBuilding.sell_time = 5;
FieldHospitalBuilding.health_max = 720;
FieldHospitalBuilding.energy = 100;
FieldHospitalBuilding.enabled = false;
FieldHospitalBuilding.can_build = true;
FieldHospitalBuilding.crater = 2;

FieldHospitalBuilding.cell_size = {x: 4, y: 3};
FieldHospitalBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1,0,1,1];
FieldHospitalBuilding.move_matrix = [1,1,0,1,0,1,1,1,1,0,1,1];
FieldHospitalBuilding.cell_padding = {x: 2, y: 1};
FieldHospitalBuilding.images = {
	normal: {
		size: {x: 96, y: 69},
		padding: {x: -2, y: -2}
	},
	shadow: {
		size: {x: 97, y: 72},
		padding: {x: -2, y: 0}
	}
};
FieldHospitalBuilding.hotpoints = [
	{x: 13, y: 12},
	{x: 11, y: 31},
	{x: 66, y: 28}
];