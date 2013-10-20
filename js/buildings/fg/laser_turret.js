function FGLaserTurretBuilding(pos_x, pos_y, player)
{
	this._proto = FGLaserTurretBuilding;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(FGLaserTurretBuilding);

FGLaserTurretBuilding.res_key = 'fg_laser_turret';
FGLaserTurretBuilding.obj_name = 'Laser Turret';
FGLaserTurretBuilding.cost = 500;
FGLaserTurretBuilding.build_time = 15;
FGLaserTurretBuilding.sell_cost = 250;
FGLaserTurretBuilding.sell_time = 5;
FGLaserTurretBuilding.health_max = 400;
FGLaserTurretBuilding.energy = 50;
FGLaserTurretBuilding.can_build = true;
FGLaserTurretBuilding.crater = 0;
FGLaserTurretBuilding.weapon = 'GatLaser';

FGLaserTurretBuilding.cell_size = {x: 2, y: 2};
FGLaserTurretBuilding.cell_matrix = [1,1,1,1];
FGLaserTurretBuilding.move_matrix = [1,1,1,1];
FGLaserTurretBuilding.cell_padding = {x: 1, y: 1};
FGLaserTurretBuilding.images = {
	normal: {
		size: {x: 48, y: 48},
		padding: {x: -1, y: -1}
	},
	shadow: {
		size: {x: 48, y: 48},
		padding: {x: -1, y: -1}
	},
	weapon: {
		size: {x: 48, y: 48},
		padding: {x: -1, y: 11},
		animated: true,
		frames: 1
	}
};
FGLaserTurretBuilding.hotpoints = [
	{x: 24, y: 24}
];
FGLaserTurretBuilding.health_explosions = {
	0: 'building_0_explosion',
	60: 'building_60_explosion',
	80: 'building_80_explosion'
};