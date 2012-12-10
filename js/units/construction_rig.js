function ConstructionRigUnit(pos_x, pos_y, player)
{
	this._proto = ConstructionRigUnit;
	this.player = player;
	
	this.health = 5;
	
	this.build_pos = {};
	this.build_obj = {};
	
	this.init(pos_x, pos_y);
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