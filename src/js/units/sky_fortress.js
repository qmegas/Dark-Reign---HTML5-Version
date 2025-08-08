function SkyFortressUnit(pos_x, pos_y, player)
{
	this._proto = SkyFortressUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
	
	this.drawSelection = function(is_onmouse)
	{
		this._drawStandardSelection(is_onmouse);
		
		var top_x = this.position.x - game.viewport_x + 0.5 - this._proto.parts[0].hotspots[this.parts[0].direction][0].x, 
			top_y = this.position.y - game.viewport_y + this._proto.parts[0].image_size.y - 12.5,
			sel_width = this._proto.parts[0].image_size.x, health_width = parseInt(sel_width*0.63),
			ammo_proc = Math.min(1, this.parts[0].weapon.getDelayState());
		
		top_x += parseInt((sel_width - health_width)/2) + 0.5;
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y-1.5, health_width, 4);
		
		if (ammo_proc < 1)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y-0.5, health_width - 2, 2);
		}
		
		game.viewport_ctx.fillStyle = (ammo_proc == 1) ? '#00a5ff' : '#ffffff';
		game.viewport_ctx.fillRect(top_x + 1, top_y-0.5, (health_width - 2)*ammo_proc, 2);
	};
}

AbstractUnit.setUnitCommonOptions(SkyFortressUnit);

SkyFortressUnit.obj_name = 'Sky Fortress';
SkyFortressUnit.resource_key = 'sky_fortress';
SkyFortressUnit.parts = [
	{
		rotations: 8,
		image_size: {x: 45, y: 45},
		stand: {frames: 1},
		attack: {frames: 2},
		hotspots: [
			[{x: 12, y: 15}, {x: 10, y: 7}, {x: 11, y: 7}, {x: 28, y: 5}, {x: 4, y: -7}],
			[{x: 12, y: 15}, {x: 10, y: 7}, {x: 11, y: 7}, {x: 20, y: -7}, {x: -2, y: -1}],
			[{x: 12, y: 15}, {x: 10, y: 7}, {x: 11, y: 7}, {x: 14, y: -7}, {x: 0, y: 7}],
			[{x: 12, y: 15}, {x: 10, y: 7}, {x: 11, y: 7}, {x: 1, y: -6}, {x: 11, y: 13}],
			[{x: 12, y: 15}, {x: 10, y: 7}, {x: 11, y: 7}, {x: -6, y: 4}, {x: 23, y: 10}],
			[{x: 12, y: 15}, {x: 10, y: 7}, {x: 11, y: 7}, {x: -5, y: 15}, {x: 26, y: 2}],
			[{x: 12, y: 15}, {x: 10, y: 7}, {x: 11, y: 7}, {x: 7, y: 19}, {x: 22, y: -5}],
			[{x: 12, y: 15}, {x: 10, y: 7}, {x: 11, y: 7}, {x: 21, y: 18}, {x: 12, y: -10}]
		],
		weapon: 'FortressCannon'
	}
];
SkyFortressUnit.shadow = {
	stand: {
		size: {x: 45, y: 45},
		padding: {x: -18, y: 0}
	}
};

SkyFortressUnit.select_sounds = ['gvskysl0', 'gvskysl2', 'gvskyal3', 'gvskyal4'];
SkyFortressUnit.response_sounds = ['gvskyrl0', 'gvskyrl1', 'gvskyrl2', 'gvskyrl3'];

SkyFortressUnit.cost = 2500;
SkyFortressUnit.health_max = 266;
SkyFortressUnit.speed = 1.518;
SkyFortressUnit.shield_type = 'FlyingArmour';
SkyFortressUnit.move_mode = MOVE_MODE_FLY;
SkyFortressUnit.mass = 10;

SkyFortressUnit.health_explosions = {
	0: 'death_with_sparks_explosion',
	30: 'smallfired_explosion',
	60: 'smor_explosion'
};

SkyFortressUnit.require_building = [AssemblyPlantBuilding, RearmingDeckBuilding, IMHeadquarter3Building];

SkyFortressUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
SkyFortressUnit.construction_time = 50;