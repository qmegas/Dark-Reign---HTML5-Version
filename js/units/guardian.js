function GuardianUnit(pos_x, pos_y, player)
{
	this._proto = GuardianUnit;
	this.player = player;
	
	this.health = 5;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(GuardianUnit);

GuardianUnit.obj_name = 'Guardian';
GuardianUnit.resource_key = 'guardian';
GuardianUnit.image_size = {width: 26, height: 26};
GuardianUnit.image_padding = {x: 1, y: 1};

GuardianUnit.cost = 150;
GuardianUnit.health_max = 5;
GuardianUnit.speed = 1.371;
GuardianUnit.weapon = LaserRifleWeapon;
GuardianUnit.is_human = true;

GuardianUnit.require_building = [TrainingFacilityBuilding];

GuardianUnit.construction_building = [TrainingFacilityBuilding, TrainingFacility2Building];
GuardianUnit.construction_time = 4;