function CycloneUnit(pos_x, pos_y, player)
{
	this._proto = CycloneUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
	
	this.drawSelection = function(is_onmouse)
	{
		this._drawStandardSelection(is_onmouse);
		
		var top_x = this.position.x - game.viewport_x + 0.5 - this._proto.parts[0].hotspots[this.parts[0].direction][0].x, 
			top_y = this.position.y - game.viewport_y + this._proto.parts[0].image_size.y - 7.5,
			sel_width = this._proto.parts[0].image_size.x, health_width = parseInt(sel_width*0.63),
			ammo_proc = this.parts[0].weapon.getAmmoState();
		
		top_x += parseInt((sel_width - health_width)/2) + 0.5;
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y-1.5, health_width, 4);
		
		if (ammo_proc < 1)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y-0.5, health_width - 2, 2);
		}
		
		game.viewport_ctx.fillStyle = '#00a5ff';
		game.viewport_ctx.fillRect(top_x + 1, top_y-0.5, (health_width - 2)*ammo_proc, 2);
	};
	
	this.orderRearm = function(rearming_deck, play_sound)
	{
		if (play_sound)
			this._playSound(this._proto.response_sounds);
		
		if (this.parts[0].weapon.getAmmoState() == 1)
			return;
		
		var pos = rearming_deck.getCell();
		pos.x += 1;
		
		this.action = {
			type: 'go_rearm',
			target_position: pos,
			target_id: rearming_deck.uid
		};
		this._move(pos.x, pos.y, false);
	};
	
	this.onStopMovingCustom = function()
	{
		if (this.action.type != 'go_rearm')
			return;
		
		var cell = this.getCell();
		if (cell.x==this.action.target_position.x && cell.y==this.action.target_position.y)
		{
			this.state = UNIT_STATE_REARMING;
			ActionsHeap.add(this.uid, 'arming', 0);
		}
		else
			this.orderWait(500);
	};
	
	this.afterWaitingCustom = function()
	{
		if (this.action.type != 'go_rearm')
			return;
		
		if (AbstractBuilding.isExists(this.action.target_id))
			this.orderStop();
		else
			this._move(this.action.target_position.x, this.action.target_position.y, false);
	};
	
	this.onArmed = function()
	{
		this.parts[0].weapon.reArm();
		var pos = PathFinder.findNearestEmptyCell(this.action.target_position.x + 6, this.action.target_position.y, this._proto.move_mode);
		this.orderMove(pos.x, pos.y, false);
	};
}

AbstractUnit.setUnitCommonOptions(CycloneUnit);

CycloneUnit.obj_name = 'Cyclone';
CycloneUnit.resource_key = 'cyclone';
CycloneUnit.die_effect = 'death_with_sparks_animation';
CycloneUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 45, y: 45},
		stand: {frames: 1},
		attack: {frames: 1},
		hotspots: [
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 21, y: 13}, {x: 0, y: 5}, {x: 9, y: 14}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 19, y: 10}, {x: -1, y: 9}, {x: 11, y: 13}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 18, y: 7}, {x: -2, y: 14}, {x: 14, y: 14}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 15, y: 6}, {x: 2, y: 17}, {x: 14, y: 15}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 13, y: 6}, {x: 6, y: 21}, {x: 16, y: 13}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 10, y: 8}, {x: 12, y: 21}, {x: 16, y: 13}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 8, y: 8}, {x: 18, y: 22}, {x: 16, y: 12}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 5, y: 11}, {x: 23, y: 20}, {x: 15, y: 11}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 7, y: 13}, {x: 27, y: 16}, {x: 15, y: 9}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 6, y: 15}, {x: 29, y: 12}, {x: 15, y: 9}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 8, y: 16}, {x: 28, y: 7}, {x: 13, y: 8}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 11, y: 17}, {x: 24, y: 4}, {x: 12, y: 9}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 14, y: 17}, {x: 21, y: 1}, {x: 11, y: 9}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 15, y: 18}, {x: 15, y: 1}, {x: 7, y: 10}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 17, y: 16}, {x: 8, y: 1}, {x: 7, y: 12}],
			[{x: 10, y: 10}, {x: 12, y: 11}, {x: 19, y: 14}, {x: 3, y: 3}, {x: 8, y: 12}]
		],
		weapon: 'CycloneCannon'
	}
];
CycloneUnit.shadow = {
	stand: {
		size: {x: 45, y: 45},
		padding: {x: -20, y: -5}
	}
};

CycloneUnit.select_sounds = ['gvcycsl0', 'gvcycsl1', 'gvcycsl2'];
CycloneUnit.response_sounds = ['gvcycrl0', 'gvcycrl1', 'gvcycrl2', 'gvcycrl3'];

CycloneUnit.cost = 1500;
CycloneUnit.health_max = 150;
CycloneUnit.speed = 3.48;
CycloneUnit.shield_type = 'FlyingArmour';
CycloneUnit.move_mode = MOVE_MODE_FLY;
CycloneUnit.mass = 10;

CycloneUnit.require_building = [AssemblyPlantBuilding, RearmingDeckBuilding, Headquarter3Building];

CycloneUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
CycloneUnit.construction_time = 30;