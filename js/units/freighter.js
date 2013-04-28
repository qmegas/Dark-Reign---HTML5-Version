function FreighterUnit(pos_x, pos_y, player)
{
	this._proto = FreighterUnit;
	this.player = player;
	this.health = 15;
	
	this.action = {
		type: '',
		building: -1,
		well: -1,
		target_position: null
	};
	this._res_type = RESOURCE_WATER;
	this._res_now = 0;
	this._res_max = 50;
	this._load_speed = 0;
	this._unload_speed = 0;
	
	this.init(pos_x, pos_y);
	
	this.runCustom = function() 
	{
		var obj;
		
		switch (this.state)
		{
			case UNIT_STATE_LOADING:
				if (this.action.type == 'loading')
				{
					obj = AbstractBuilding.getById(this.action.well);
					if (obj === null)
					{
						this.orderStop();
						return;
					}
					this._res_now += obj.decreaseRes(this._load_speed);
				
					if (this._res_now >= this._res_max)
					{
						this._res_now = this._res_max;
						this._moveBase();
					}
				}
				else
				{
					//Uloading
					obj = AbstractBuilding.getById(this.action.building);
					if (obj===null || obj.isResFull())
					{
						this.orderStop();
						return;
					}
					this._res_now -= obj.increaseRes(this._unload_speed);

					if (this._res_now <= 0)
					{
						this._res_now = 0;
						this._moveWell();
					}
				}
				break;
		}
	};
	
	this.drawSelection = function(is_onmouse)
	{
		this._drawStandardSelection(is_onmouse);
		
		var top_x = this.position.x - game.viewport_x - 1 - this._proto.parts[0].hotspots[this.parts[0].direction][0].x, 
			top_y = this.position.y - game.viewport_y + 5 - this._proto.parts[0].hotspots[this.parts[0].direction][0].y,
			bar_size = Math.floor((this._res_now/this._res_max)*28);
			
			
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y, 4, 30);
		
		if (this._res_now < this._res_max)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y + 1, 2, 28);
		}
		
		game.viewport_ctx.fillStyle = (this._res_type == RESOURCE_WATER) ? '#00a5ff' : '#ffff00';
		game.viewport_ctx.fillRect(top_x + 1, top_y + 29 - bar_size, 2, bar_size);
	};
	
	this.canHarvest = function()
	{
		return true;
	};
	
	this.orderHarvest = function(obj, play_sound)
	{
		var cell = this.getCell(), tmp;
		
		if (play_sound)
			this._playSound(this._proto.response_sounds);
		
		if (obj instanceof TaelonPowerBuilding)
		{
			if (this._res_now>0 && this._res_type==RESOURCE_WATER)
				return;
			
			this._res_type = RESOURCE_TAELON;
			this.action.building = obj.uid;
			tmp = game.findNearestInstance(TaelonMineBuilding, PLAYER_NEUTRAL, cell.x, cell.y);
			
			if (tmp === null)
				return;
			
			this.action.well = tmp.uid;
		}
		else if (obj instanceof TaelonMineBuilding)
		{
			if (this._res_now>0 && this._res_type==RESOURCE_WATER)
				return;
			
			this._res_type = RESOURCE_TAELON;
			this.action.well = obj.uid;
			tmp = game.findNearestInstance(TaelonPowerBuilding, this.player, cell.x, cell.y);
			
			if (tmp === null)
				return;
			
			this.action.building = tmp.uid;
		}
		else if (obj instanceof WaterLaunchPadBuilding)
		{
			if (this._res_now>0 && this._res_type==RESOURCE_TAELON)
				return;
			
			this._res_type = RESOURCE_WATER;
			this.action.building = obj.uid;
			tmp = game.findNearestInstance(WaterWellBuilding, PLAYER_NEUTRAL, cell.x, cell.y);
			
			if (tmp === null)
				return;
			
			this.action.well = tmp.uid;
		}
		else if (obj instanceof WaterWellBuilding)
		{
			if (this._res_now>0 && this._res_type==RESOURCE_TAELON)
				return;
				
			this._res_type = RESOURCE_WATER;
			this.action.well = obj.uid;
			tmp = game.findNearestInstance(WaterLaunchPadBuilding, this.player, cell.x, cell.y);
			
			if (tmp === null)
				return;
			
			this.action.building = tmp.uid;
		}
		else
			return;
		
		if (this._res_now > 0)
			this._moveBase();
		else
			this._moveWell();
	};
	
	this._moveBase = function()
	{
		var obj = AbstractBuilding.getById(this.action.building);
		
		if (obj === null)
		{
			this.state = UNIT_STATE_STAND;
			return;
		}
		
		this.action.target_position = obj.getCell();
		if (this._res_type == RESOURCE_TAELON)
		{
			this.action.target_position.x += 1;
			this.action.target_position.y += 2;
		}
		else
		{
			this.action.target_position.x += 3;
			this.action.target_position.y += 1;
		}
		this.action.type = 'go_base';
		this._move(this.action.target_position.x, this.action.target_position.y, false);
	};
	
	this._moveWell = function()
	{
		var obj = AbstractBuilding.getById(this.action.well), tmp;
		
		if (obj === null)
		{
			this.orderStop();
			return;
		}
		
		tmp = obj.getCell();
		tmp.x += 1;
		tmp.y += 1;
		this.action.type = 'go_well';
		this.action.target_position = tmp;
		this._move(tmp.x, tmp.y, false);
	};
	
	this.onStopMovingCustom = function()
	{
		var cell = this.getCell();
		if (cell.x==this.action.target_position.x && cell.y==this.action.target_position.y)
		{
			if (this.action.type == 'go_well')
				this.action.type = 'loading';
			else
				this.action.type = 'unloading';
			
			this.state = UNIT_STATE_LOADING;
			this._setLoadSpeed();
			this.startAnimation = (new Date).getTime();
			this.setDirection(4); //NW
		}
		else
			this.orderWait(1000); //Wait 1 second
	};
	
	this.afterWaitingCustom = function()
	{
		var obj_id = (this.action.type == 'go_well') ? this.action.well : this.action.building;
		if (AbstractBuilding.isExists(obj_id))
			this._move(this.action.target_position.x, this.action.target_position.y, false);
		else
			this.orderStop();
	};
	
	this._setLoadSpeed = function()
	{
		if (this.res_type == RESOURCE_TAELON)
		{
			this._load_speed = 0.2;
			this._unload_speed = 0.5;
		}
		else
		{
			this._load_speed = 0.36;
			this._unload_speed = 0.36;
		}
	};
}

AbstractUnit.setUnitCommonOptions(FreighterUnit);

FreighterUnit.obj_name = 'Freighter';
FreighterUnit.resource_key = 'freighter';
FreighterUnit.die_effect = 'death_with_sparks_animation';
FreighterUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 40, y: 40},
		stand: {frames: 1},
		move: {frames: 3},
		load: {frames: 15},
		hotspots: [
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 31, y: 26}, {x: 5, y: 14}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 30, y: 22}, {x: 6, y: 17}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 31, y: 19}, {x: 6, y: 22}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 31, y: 14}, {x: 10, y: 23}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 28, y: 11}, {x: 14, y: 25}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 23, y: 10}, {x: 19, y: 28}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 13, y: 9}, {x: 26, y: 25}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 10, y: 12}, {x: 30, y: 23}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 8, y: 14}, {x: 34, y: 20}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 8, y: 18}, {x: 36, y: 17}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 7, y: 20}, {x: 34, y: 13}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 10, y: 25}, {x: 33, y: 9}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 13, y: 24}, {x: 26, y: 6}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 19, y: 26}, {x: 20, y: 5}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 24, y: 26}, {x: 11, y: 5}],
			[{x: 8, y: 8}, {x: 18, y: 22}, {x: 27, y: 26}, {x: 7, y: 8}]
		]
	}
];

FreighterUnit.select_sounds = ['gvig1sl0', 'gvig1sl1', 'gvig1sl2', 'gvig1sl5'];
FreighterUnit.response_sounds = ['gvig1rl0', 'gvig1rl1', 'gvig1rl2', 'gvig1rl3'];

FreighterUnit.cost = 1000;
FreighterUnit.health_max = 750;
FreighterUnit.speed = 1.5;
FreighterUnit.shield_type = 'TankPlatingWet';

FreighterUnit.require_building = [AssemblyPlantBuilding];

FreighterUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
FreighterUnit.construction_time = 4;