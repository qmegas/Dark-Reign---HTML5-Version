function GuardianUnit(pos_x, pos_y, player)
{
	this._proto = GuardianUnit;
	this.player = player;
	
	this.health = 100;
	
	this.setPosition(pos_x, pos_y);
}

GuardianUnit.prototype = new AbstractUnit();

GuardianUnit.obj_name = 'Guardian';
GuardianUnit.resource_key = 'guardian';
GuardianUnit.image_size = {width: 26, height: 26};
GuardianUnit.image_padding = {x: 1, y: 1};
GuardianUnit.sound_count = 4;

GuardianUnit.cost = 150;
GuardianUnit.health_max = 100;
GuardianUnit.speed = 1.371;
GuardianUnit.weapon = LaserRifleWeapon;
GuardianUnit.enabled = false;

GuardianUnit.require_building = [TrainingFacilityBuilding];

GuardianUnit.construction_building = [TrainingFacilityBuilding, TrainingFacility2Building];
GuardianUnit.construction_time = 4;
GuardianUnit.construction_queue = 0;
GuardianUnit.construction_progress = 0;

GuardianUnit.loadResources = function() 
{
	AbstractUnit.loadResources(this);
}