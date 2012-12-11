function ConstructionRigUnit(pos_x, pos_y, player)
{
	this._proto = ConstructionRigUnit;
	this.player = player;
	
	this.health = 5;
	
	this.build_pos = {};
	this.build_obj = {};
	
	this.init(pos_x, pos_y);
	
	this.onStopMoving = function()
	{
		if (this.substate == 'BUILD')
		{
			var cell = this.getCell();
			if (cell.x==this.build_pos.x && cell.y==this.build_pos.y)
			{
				if (AbstractBuilding.canBuild(this.build_obj, cell.x, cell.y, this.uid))
				{
					AbstractBuilding.createNew(this.build_obj, cell.x, cell.y, this.player);
					if (this.is_selected)
						game.constructor.drawUnits();
					game.kill_objects.push(this.uid);
				}
			}
		}
		
		return false;
	}
}

AbstractUnit.setUnitCommonOptions(ConstructionRigUnit);

ConstructionRigUnit.obj_name = 'Construction Rig';
ConstructionRigUnit.resource_key = 'construction_rig';
ConstructionRigUnit.image_size = {width: 35, height: 35};
ConstructionRigUnit.image_padding = {x: 7, y: 7};
ConstructionRigUnit.sound_count = 3;

ConstructionRigUnit.cost = 300;
ConstructionRigUnit.speed = 0.87;

ConstructionRigUnit.require_building = [HeadquarterBuilding];

ConstructionRigUnit.construction_building = [HeadquarterBuilding, Headquarter2Building, Headquarter3Building];
ConstructionRigUnit.construction_time = 6;