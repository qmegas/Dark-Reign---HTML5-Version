function LaserRifleWeapon(unit)
{
	this._proto = LaserRifleWeapon;
	this._last_shoot = 0;
	this._target = null;
	this._unit = unit;
	
	this.isTargetAlive = function()
	{
		if (this._target.type == 'object')
			if (typeof game.objects[this._target.objid] === 'undefined')
			{
				this._unit.state = 'STAND';
				this._target = null;
				return false;
			}
		return true;
	};
	
	this.getTargetPosition = function()
	{
		var pos = this._target, obj;
		
		if (this._target.type == 'object')
		{
			obj = game.objects[this._target.objid];
			pos = obj.getCell();
			if (obj.is_building)
			{
				pos.x += obj._proto.cell_padding.x;
				pos.y += obj._proto.cell_padding.y;
			}
		}
		return pos;
	};
	
	this.canAttackTarget = function(target)
	{
		if (target.type == 'object')
		{
			if (game.objects[target.objid].is_fly)
				return this._proto.can_shoot_flyer;
			else
				return this._proto.can_shoot_ground;
		}
		
		if (target.type == 'ground')
			return this._proto.can_shoot_ground;
		
		return false;
	};
	
	this.setTarget = function(target)
	{
		this._target = target;
	};
	
	//Can shoot now?
	this.canShoot = function()
	{
		return ((this._last_shoot + this._proto.firedelay) < (new Date()).getTime());
	};
	
	this.canReach = function()
	{
		var unit_pos = this._unit.getCell(), target_pos = this.getTargetPosition(), 
			distance = MapCell.getCellDistance(unit_pos.x, unit_pos.y, target_pos.x, target_pos.y);
		
		return ((distance >= this._proto.minimum_range) && (distance <= this._proto.maximum_range));
	};
	
	this.shoot = function()
	{
		var pos = this._unit.getCell(), uid, effect, to = this.getTargetPosition();
		
		this._last_shoot = (new Date()).getTime();
		
		//Rotate unit
		this._unit.move_direction = 4 - parseInt(Math.atan2(pos.y - to.y, pos.x - to.x)*(180/Math.PI)/45);
		
		effect = new this._proto.effect(pos.x, pos.y, to.x, to.y, this._proto.offence);
		uid = game.addEffect(effect);
		effect.uid = uid;
	};
}

LaserRifleWeapon.effect = LaserRifleEffect;

LaserRifleWeapon.minimum_range = 0;
LaserRifleWeapon.maximum_range = 4;
LaserRifleWeapon.firedelay = 270; //shoot per msec. Calculation: 33.75*cfg_firedelay
LaserRifleWeapon.can_shoot_ground = true;
LaserRifleWeapon.can_shoot_flyer = false;
LaserRifleWeapon.offence = {
	type: 'E2',
	strength: 11
};
	
LaserRifleWeapon.loadResources = function()
{
	this.effect.loadResources();
};