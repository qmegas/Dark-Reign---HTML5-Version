function LaserRifleWeapon(unit)
{
	this._proto = LaserRifleWeapon;
	this._last_shoot = 0;
	this._target = null;
	this._unit = unit;
	
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
	}
	
	this.setTarget = function(target)
	{
		this._target = target;
	}
	
	//Can shoot now?
	this.canShoot = function()
	{
		return ((this._last_shoot + this._proto.firedelay) < (new Date()).getTime());
	}
	
	this.canReach = function()
	{
		//@todo check if target is reachable
		return true;
	}
	
	this.shoot = function()
	{
		var pos = this._unit.getCell(), uid, effect, to;
		
		this._last_shoot = (new Date()).getTime();
		
		if (this._target.type == 'object')
			to = game.objects[this._target.objid].getCell();
		
		if (this._target.type == 'ground')
			to = {x: this._target.x, y: this._target.y};
		
		//Rotate unit
		this._unit.move_direction = 4 - parseInt(Math.atan2(pos.y - to.y, pos.x - to.x)*(180/Math.PI)/45);
		
		effect = new this._proto.effect(pos.x, pos.y, to.x, to.y);
		uid = game.addEffect(effect);
		effect.uid = uid;
	}
}

LaserRifleWeapon.effect = LaserRifleEffect;

LaserRifleWeapon.minimum_range = 0;
LaserRifleWeapon.maximum_range = 4;
LaserRifleWeapon.firedelay = 270; //shoot per msec. Calculation: 33.75*cfg_firedelay
LaserRifleWeapon.can_shoot_ground = true;
LaserRifleWeapon.can_shoot_flyer = false;
	
LaserRifleWeapon.loadResources = function()
{
	this.effect.loadResources();
}