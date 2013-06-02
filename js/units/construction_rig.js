function ConstructionRigUnit(pos_x, pos_y, player)
{
	this._proto = ConstructionRigUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
	
	this.orderBuild = function(x, y, build)
	{
		this.action = {
			type: 'build',
			object: build,
			position: {x: x, y: y}
		};
		
		if (this._isBuldingCell(this.getCell()))
			this._startBuild();
		else
		{
			this._playSound(this._proto.response_sounds);
			var pos = PathFinder.findNearestStandCell(x + build.cell_padding.x, y + build.cell_padding.y);
			if (pos !== null)
				this._move(pos.x, pos.y);
		}
	};
	
	this._isBuldingCell = function(pos)
	{
		if ((pos.x < this.action.position.x) || (pos.x >= (this.action.position.x + this.action.object.cell_size.x)))
			return false;
		if ((pos.y < this.action.position.y) || (pos.y >= (this.action.position.y + this.action.object.cell_size.y)))
			return false;
		return true;
	};
	
	this._startBuild = function()
	{
		if (AbstractBuilding.canBuild(this.action.object, this.action.position.x, this.action.position.y, this.uid))
		{
			AbstractBuilding.createNew(this.action.object, this.action.position.x, this.action.position.y, this.player);
			if (this.is_selected)
				InterfaceConstructManager.drawUnits();
			game.kill_objects.push(this.uid);
		}
	};
	
	this.onStopMovingCustom = function()
	{
		if (this.action.type == 'build')
		{
			var pos = cloneObj(this.getCell());
			if (this._isBuldingCell(pos))
				this._startBuild();
			else
			{
				//Allow to stand near building site for bridges
				//@todo Move it into _isBuldingCell function
				if (this.action.object.is_bridge)
				{
					pos.x++; //Right
					if (this._isBuldingCell(pos))
						return this._startBuild();
					pos.x -= 2; //Left
					if (this._isBuldingCell(pos))
						return this._startBuild();
					pos.y--; pos.x++; //Top
					if (this._isBuldingCell(pos))
						return this._startBuild();
					pos.y += 2; //Bottom
					if (this._isBuldingCell(pos))
						return this._startBuild();
				}
			}
			
			this.state = UNIT_STATE_STAND;
		}
	};
	
	this.beforeMoveNextCellCustom = function()
	{
		if (this.action.type == 'build')
		{
			if (this._isBuldingCell(this.getCell()))
				this.move_path = [];
		}
	};
}

AbstractUnit.setUnitCommonOptions(ConstructionRigUnit);

ConstructionRigUnit.obj_name = 'Construction Rig';
ConstructionRigUnit.resource_key = 'construction_rig';
ConstructionRigUnit.parts = [
	{
		rotations: 8,
		image_size: {x: 35, y: 35},
		stand: {frames: 1},
		move: {frames: 6},
		hotspots: [
			[{x: 7, y: 7}],
			[{x: 7, y: 7}],
			[{x: 7, y: 7}],
			[{x: 7, y: 7}],
			[{x: 7, y: 7}],
			[{x: 7, y: 7}],
			[{x: 7, y: 7}],
			[{x: 7, y: 7}]
		]
	}
];
ConstructionRigUnit.shadow = {
	stand: {
		size: {x: 37, y: 24},
		padding: {x: 4, y: -11}
	},
	move: {
		size: {x: 39, y: 24},
		padding: {x: 5, y: -10}
	}
};
ConstructionRigUnit.select_sounds = ['gvicnsl0', 'gvicnsl1', 'gvicnsl2'];
ConstructionRigUnit.response_sounds = ['gvicnrl0', 'gvicnrl1', 'gvicnrl2'];

ConstructionRigUnit.cost = 300;
ConstructionRigUnit.shield_type = 'TankPlatingWet';

ConstructionRigUnit.require_building = [HeadquarterBuilding];

ConstructionRigUnit.construction_building = [HeadquarterBuilding, Headquarter2Building, Headquarter3Building];
ConstructionRigUnit.construction_time = 6;