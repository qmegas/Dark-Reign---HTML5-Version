function FreighterUnit(pos_x, pos_y, player)
{
	this._proto = FreighterUnit;
	this.player = player;
	this.health = 15;
	
	this._res_now = 0;
	this._res_max = 50;
	this._res_type = RESOURCE_WATER;
	this._harvest_well = 0;
	this._harvest_building = 0;
	this._harvest_target = null;
	this._harvest_wait = 0;
	this._load_speed = 0;
	this._unload_speed = 0;
	
	this.init(pos_x, pos_y);
	
	this.run = function() 
	{
		var obj;
		
		switch (this.state)
		{
			case 'MOVE_WELL':
			case 'MOVE_COLLECTOR':
			case 'MOVE':
				this._runStandartMoving();
				break;
				
			case 'MOVE_WAIT':
				if ((new Date).getTime() > this._harvest_wait)
				{
					this.move(this._harvest_target.x, this._harvest_target.y, false);
					this.state = this.substate;
					this.substate = '';
				}
				break;
				
			case 'RESOURCE_GET':
				obj = this._getBuilding(this._harvest_well);
				if (obj === null)
				{
					this.state = 'STAND';
					return;
				}
				
				this._res_now += obj.decreaseRes(this._load_speed);
				
				if (this._res_now >= this._res_max)
				{
					this._res_now = this._res_max;
					this._moveBase();
				}
				break;
				
			case 'RESOURCE_PUT':
				obj = this._getBuilding(this._harvest_building);
				if (obj===null || obj.isResFull())
				{
					this.state = 'STAND';
					return;
				}
				
				this._res_now -= obj.increaseRes(this._unload_speed);
				
				if (this._res_now <= 0)
				{
					this._res_now = 0;
					this._moveWell();
				}
				break;
		}
	}
	
	this.draw = function(current_time) 
	{
		var top_x = this.position.x - game.viewport_x, top_y = this.position.y - game.viewport_y, diff;
		
		switch (this.state)
		{
			case 'MOVE_WELL':
			case 'MOVE_COLLECTOR':
			case 'MOVE':
				diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % 3);
				game.objDraw.addElement(DRAW_LAYER_GUNIT, this.position.x, {
					res_key: this._proto.resource_key + '_move',
					src_x: this.move_direction * this._proto.images.move.size.x,
					src_y: diff * this._proto.images.move.size.y,
					src_width: this._proto.images.move.size.x,
					src_height: this._proto.images.move.size.y,
					x: top_x - this._proto.images.move.padding.x,
					y: top_y - this._proto.images.move.padding.y
				});
				break;
				
			case 'RESOURCE_GET':
			case 'RESOURCE_PUT':
				diff = (parseInt((current_time - this.startAnimation) / (ANIMATION_SPEED*2)) % 15);
				game.objDraw.addElement(DRAW_LAYER_GUNIT, this.position.x, {
					res_key: this._proto.resource_key + '_load',
					src_x: 0,
					src_y: diff * this._proto.images.load.size.y,
					src_width: this._proto.images.load.size.x,
					src_height: this._proto.images.load.size.y,
					x: top_x - this._proto.images.load.padding.x,
					y: top_y - this._proto.images.load.padding.y
				});
				break;
				
			default:
				game.objDraw.addElement(DRAW_LAYER_GUNIT, this.position.x, {
					res_key: this._proto.resource_key + '_move',
					src_x: this.move_direction * this._proto.images.move.size.x,
					src_y: 0,
					src_width: this._proto.images.move.size.x,
					src_height: this._proto.images.move.size.y,
					x: top_x - this._proto.images.move.padding.x,
					y: top_y - this._proto.images.move.padding.y
				});
				break;
		}
	}
	
	this.drawSelection = function(is_onmouse)
	{
		this._drawStandardSelection(is_onmouse);
		
		var top_x = this.position.x - game.viewport_x - 1 - this._proto.images.selection.padding.x, 
			top_y = this.position.y - game.viewport_y + 5 - this._proto.images.selection.padding.y,
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
	}
	
	this.canHarvest = function()
	{
		return true;
	}
	
	this.harvest = function(obj, silently)
	{
		var cell = this.getCell();
		
		if (!silently)
			this._playSound('move');
		
		if (obj instanceof TaelonPowerBuilding)
		{
			if (this._res_now>0 && this._res_type==RESOURCE_WATER)
				return;
			
			this._res_type = RESOURCE_TAELON;
			this._harvest_building = obj.uid;
			this._harvest_well = game.findNearestInstance(TaelonMineBuilding, PLAYER_NEUTRAL, cell.x, cell.y);
			
			if (this._harvest_well === null)
				return;
			
			this._harvest_well = this._harvest_well.uid;
		}
		else if (obj instanceof TaelonMineBuilding)
		{
			if (this._res_now>0 && this._res_type==RESOURCE_WATER)
				return;
				
			this._res_type = RESOURCE_TAELON;
			this._harvest_well = obj.uid;
			this._harvest_building = game.findNearestInstance(TaelonPowerBuilding, this.player, cell.x, cell.y);
			
			if (this._harvest_building === null)
				return;
			
			this._harvest_building = this._harvest_building.uid;
		}
		else if (obj instanceof WaterLaunchPadBuilding)
		{
			if (this._res_now>0 && this._res_type==RESOURCE_TAELON)
				return;
			
			this._res_type = RESOURCE_WATER;
			this._harvest_building = obj.uid;
			this._harvest_well = game.findNearestInstance(WaterWellBuilding, PLAYER_NEUTRAL, cell.x, cell.y);
			
			if (this._harvest_well === null)
				return;
			
			this._harvest_well = this._harvest_well.uid;
		}
		else if (obj instanceof WaterWellBuilding)
		{
			if (this._res_now>0 && this._res_type==RESOURCE_TAELON)
				return;
				
			this._res_type = RESOURCE_WATER;
			this._harvest_well = obj.uid;
			this._harvest_building = game.findNearestInstance(WaterLaunchPadBuilding, this.player, cell.x, cell.y);
			
			if (this._harvest_building === null)
				return;
			
			this._harvest_building = this._harvest_building.uid;
		}
		else
			return;
		
		if (this._res_now > 0)
			this._moveBase();
		else
			this._moveWell();
	}
	
	this._getBuilding = function(id)
	{
		if (game.objects[id] === undefined)
			return null;
		
		return game.objects[id];
	}
	
	this._moveBase = function()
	{
		var obj = this._getBuilding(this._harvest_building);
		
		if (obj === null)
		{
			this.state = 'STAND';
			return;
		}
		
		this._harvest_target = obj.getCell();
		if (this._res_type == RESOURCE_TAELON)
		{
			this._harvest_target.x += 1;
			this._harvest_target.y += 2;
		}
		else
		{
			this._harvest_target.x += 3;
			this._harvest_target.y += 1;
		}
		
		this.move(this._harvest_target.x, this._harvest_target.y, false);
		this.state = 'MOVE_COLLECTOR';
	}
	
	this._moveWell = function()
	{
		var obj = this._getBuilding(this._harvest_well);
		
		if (obj === null)
		{
			this.state = 'STAND';
			return;
		}
		
		this._harvest_target = obj.getCell();
		this._harvest_target.x += 1;
		this._harvest_target.y += 1;
		this.move(this._harvest_target.x, this._harvest_target.y, false);
		this.state = 'MOVE_WELL';
	}
	
	this.onStopMoving = function()
	{
		if (this.state == 'MOVE_WELL' || this.state == 'MOVE_COLLECTOR')
		{
			var cell = this.getCell(), time_now = (new Date).getTime();
			
			if (cell.x==this._harvest_target.x && cell.y==this._harvest_target.y)
			{
				this.state = (this.state == 'MOVE_WELL') ? 'RESOURCE_GET' : 'RESOURCE_PUT';
				this._setLoadSpeed();
				this.startAnimation = time_now;
				this.move_direction = 4;
			}
			else
			{
				this.substate = this.state;
				this.state = 'MOVE_WAIT';
				this._harvest_wait = time_now + 1000; //Wait 1 second
			}
			return true;
		}
		
		return false;
	}
	
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
	}
}

AbstractUnit.setUnitCommonOptions(FreighterUnit);

FreighterUnit.obj_name = 'Freighter';
FreighterUnit.resource_key = 'freighter';
FreighterUnit.images = {
	selection: {
		size: {x: 40, y: 40},
		padding: {x: 8, y: 8}
	},
	stand: {
		size: {x: 40, y: 40},
		padding: {x: 8, y: 8}
	},
	move: {
		size: {x: 40, y: 40},
		padding: {x: 8, y: 8}
	},
	load: {
		size: {x: 40, y: 40},
		padding: {x: 8, y: 8}
	}
};

FreighterUnit.cost = 1000;
FreighterUnit.health_max = 15;
FreighterUnit.speed = 1.5;

FreighterUnit.require_building = [AssemblyPlantBuilding];

FreighterUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
FreighterUnit.construction_time = 4;

FreighterUnit.loadResources = function() 
{
	game.resources.addImage(this.resource_key + '_move',  'images/units/' + this.resource_key + '/move.png');
	game.resources.addImage(this.resource_key + '_load', 'images/units/' + this.resource_key + '/load.png');
	
	//Use same sounds as guardian
	for (var i=1; i<=this.sound_count; ++i)
	{
		game.resources.addSound(this.resource_key + '_move' + i,   'sounds/units/guardian/move' + i + '.' + AUDIO_TYPE);
		game.resources.addSound(this.resource_key + '_select' + i, 'sounds/units/guardian/select' + i + '.' + AUDIO_TYPE);
	}
}