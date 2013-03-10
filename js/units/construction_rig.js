function ConstructionRigUnit(pos_x, pos_y, player)
{
	this._proto = ConstructionRigUnit;
	this.player = player;
	
	this.health = 5;
	
	this.init(pos_x, pos_y);
	
	this.orderBuild = function(x, y, build)
	{
		this.action = {
			type: 'build',
			object: build,
			position: {x: x, y: y}
		};
		
		if (this._isBuldingCell())
			this._startBuild();
		else
		{
			this._move(x + build.cell_padding.x, y + build.cell_padding.y);
			this._playSound('move');
		}
	}
	
	this._isBuldingCell = function()
	{
		var pos = this.getCell();
		if ((pos.x < this.action.position.x) || (pos.x >= (this.action.position.x + this.action.object.cell_size.x)))
			return false;
		if ((pos.y < this.action.position.y) || (pos.y >= (this.action.position.y + this.action.object.cell_size.y)))
			return false;
		return true;
	}
	
	this._startBuild = function()
	{
		if (AbstractBuilding.canBuild(this.action.object, this.action.position.x, this.action.position.y, this.uid))
		{
			AbstractBuilding.createNew(this.action.object, this.action.position.x, this.action.position.y, this.player);
			if (this.is_selected)
				game.constructor.drawUnits();
			game.kill_objects.push(this.uid);
		}
	}
	
	this.onStopMovingCustom = function()
	{
		if (this.action.type == 'build')
		{
			if (this._isBuldingCell())
				this._startBuild();
			this.state = 'STAND';
		}
	}
	
	this.beforeMoveNextCellCustom = function()
	{
		if (this.action.type == 'build')
		{
			if (this._isBuldingCell())
				this.move_path = [];
		}
	}
}

AbstractUnit.setUnitCommonOptions(ConstructionRigUnit);

ConstructionRigUnit.obj_name = 'Construction Rig';
ConstructionRigUnit.resource_key = 'construction_rig';
ConstructionRigUnit.images = {
	selection: {
		size: {x: 35, y: 35},
		padding: {x: 7, y: 7}
	},
	stand: {
		size: {x: 35, y: 35},
		padding: {x: 7, y: 7}
	},
	move: {
		size: {x: 35, y: 35},
		padding: {x: 7, y: 7},
		frames: 6
	},
	shadow: {
		stand: {
			size: {x: 37, y: 24},
			padding: {x: 4, y: -11}
		},
		move: {
			size: {x: 39, y: 24},
			padding: {x: 5, y: -10}
		}
	}
};
ConstructionRigUnit.sound_count = 3;

ConstructionRigUnit.cost = 300;
ConstructionRigUnit.speed = 0.87;
ConstructionRigUnit.shield_type = 'TankPlatingWet';

ConstructionRigUnit.require_building = [HeadquarterBuilding];

ConstructionRigUnit.construction_building = [HeadquarterBuilding, Headquarter2Building, Headquarter3Building];
ConstructionRigUnit.construction_time = 6;