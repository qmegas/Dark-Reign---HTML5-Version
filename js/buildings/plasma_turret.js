function PlasmaTurretBuilding(pos_x, pos_y, player)
{
	this._proto = PlasmaTurretBuilding;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractBuilding.setBuildingCommonOptions(PlasmaTurretBuilding);

PlasmaTurretBuilding.res_key = 'plasma_turret';
PlasmaTurretBuilding.obj_name = 'Plasma Turret';
PlasmaTurretBuilding.cost = 500;
PlasmaTurretBuilding.build_time = 15;
PlasmaTurretBuilding.sell_cost = 250;
PlasmaTurretBuilding.sell_time = 6;
PlasmaTurretBuilding.health_max = 400;
PlasmaTurretBuilding.energy = 50;
PlasmaTurretBuilding.enabled = false;
PlasmaTurretBuilding.can_build = true;
PlasmaTurretBuilding.crater = 0;
PlasmaTurretBuilding.weapon = 123;

PlasmaTurretBuilding.cell_size = {x: 2, y: 2};
PlasmaTurretBuilding.cell_matrix = [1,1,1,1];
PlasmaTurretBuilding.move_matrix = [1,1,1,1];
PlasmaTurretBuilding.cell_padding = {x: 1, y: 1};
PlasmaTurretBuilding.image_size = {x: 47, y: 47};
PlasmaTurretBuilding.image_padding = {x: -1, y: -1};
PlasmaTurretBuilding.shadow_image_size = {x: 36, y: 29};
PlasmaTurretBuilding.shadow_image_padding = {x: -18, y: -18};
PlasmaTurretBuilding.weapon_image_size = {x: 34, y: 28};
PlasmaTurretBuilding.weapon_image_padding = {x: -7, y: -10};