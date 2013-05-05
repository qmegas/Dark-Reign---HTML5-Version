function InvaderTransportUnit(pos_x, pos_y, player)
{
	this._proto = InvaderTransportUnit;
	this.player = player;
	
	this._carry_spaces = this._proto.carry.places;
	
	this.init(pos_x, pos_y);
	
	this.drawSelection = function(is_onmouse)
	{
		this._drawStandardSelection(is_onmouse);
		
		var i, color, top_x = this.position.x - game.viewport_x - 1 - this._proto.parts[0].hotspots[this.parts[0].direction][0].x, 
			top_y = this.position.y - game.viewport_y - this._proto.parts[0].hotspots[this.parts[0].direction][0].y + this._proto.parts[0].image_size.y + 7;
		
		for (i = 0; i < this._proto.carry.places; ++i)
		{
			game.viewport_ctx.fillStyle = '#000000';
			game.viewport_ctx.fillRect(top_x + i*10, top_y, 8, 4);
			color = ((4 - this._carry_spaces)>=i) ? '#ff0000' : '#A5FF6C';
			game.viewport_ctx.fillStyle = color;
			game.viewport_ctx.fillRect(top_x + 1 + i*10, top_y + 1, 6, 2);
		}
	};
	
	this.onObjectDeletionCustom = function() 
	{
		if (this.haveInsideUnits())
			this.extract();
	};
}

AbstractUnit.setUnitCommonOptions(InvaderTransportUnit);

InvaderTransportUnit.obj_name = 'Invader Troop Transport';
InvaderTransportUnit.resource_key = 'invader_transport';
InvaderTransportUnit.die_effect = 'death_with_sparks_animation';
InvaderTransportUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 45, y: 45},
		stand: {frames: 1},
		hotspots: [
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 5, y: 10}, {x: 25, y: 7}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 7, y: 12}, {x: 27, y: 7}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 11, y: 15}, {x: 24, y: 5}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 16, y: 17}, {x: 20, y: 2}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 21, y: 15}, {x: 15, y: 0}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 24, y: 11}, {x: 11, y: 0}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 25, y: 8}, {x: 7, y: 2}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 27, y: 6}, {x: 4, y: 6}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 25, y: 4}, {x: 3, y: 9}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 22, y: 1}, {x: 3, y: 11}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 18, y: -3}, {x: 7, y: 13}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 14, y: -3}, {x: 10, y: 14}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 8, y: -2}, {x: 15, y: 16}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 5, y: -1}, {x: 19, y: 17}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 3, y: 3}, {x: 23, y: 13}],
			[{x: 8, y: 14}, {x: 15, y: 7}, {x: 2, y: 9}, {x: 26, y: 11}],
		]
	},
	{
		rotations: 16,
		image_size: {x: 44, y: 44},
		stand: {frames: 1},
		attack: {frames: 1},
		hotspots: [
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 13, y: -2}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 11, y: -6}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 9, y: -8}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 6, y: -11}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 0, y: -11}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -5, y: -11}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -8, y: -9}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -11, y: -2}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -13, y: -1}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -10, y: 4}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -7, y: 6}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -4, y: 8}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 1, y: 7}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 6, y: 7}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 11, y: 5}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 13, y: 2}]
		],
		weapon: 'LaserRifle'
	}
];

InvaderTransportUnit.select_sounds = ['gvig1sl0', 'gvig1sl1', 'gvig1sl2', 'gvig1sl3'];
InvaderTransportUnit.response_sounds = ['gvig1rl0', 'gvig1rl1', 'gvig1rl2', 'gvig1rl6'];

InvaderTransportUnit.cost = 600;
InvaderTransportUnit.health_max = 150;
InvaderTransportUnit.speed = 2.9;
InvaderTransportUnit.shield_type = 'TankPlating';
InvaderTransportUnit.move_mode = MOVE_MODE_HOVER;
InvaderTransportUnit.mass = 100;

InvaderTransportUnit.carry = {places: 5, max_mass: 4};

InvaderTransportUnit.require_building = [AssemblyPlantBuilding];

InvaderTransportUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
InvaderTransportUnit.construction_time = 12;