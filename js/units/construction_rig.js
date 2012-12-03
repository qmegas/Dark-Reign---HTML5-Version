function ConstructionRigUnit(pos_x, pos_y, player)
{
	this._proto = ConstructionRigUnit;
	this.player = player;
	
	this.health = 100;
	
	this.build_pos = {};
	this.build_obj = {};
	
	this.setPosition(pos_x, pos_y);
}

ConstructionRigUnit.prototype = new AbstractUnit();

ConstructionRigUnit.obj_name = 'Construction Rig';
ConstructionRigUnit.resource_key = 'construction_rig';
ConstructionRigUnit.image_size = {width: 35, height: 35};
ConstructionRigUnit.image_padding = {x: 7, y: 7};
ConstructionRigUnit.sound_count = 3;

ConstructionRigUnit.cost = 300;
ConstructionRigUnit.health_max = 100;
ConstructionRigUnit.speed = 0.87;
ConstructionRigUnit.weapon = null;
ConstructionRigUnit.enabled = false;

ConstructionRigUnit.require_building = [HeadquarterBuilding];

ConstructionRigUnit.construction_building = [HeadquarterBuilding, Headquarter2Building];
ConstructionRigUnit.construction_time = 6;
ConstructionRigUnit.construction_queue = 0;
ConstructionRigUnit.construction_progress = 0;

ConstructionRigUnit.loadResources = function() 
{
	AbstractUnit.loadResources(this);
}