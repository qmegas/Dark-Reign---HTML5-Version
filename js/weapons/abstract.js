function AbstractWeapon()
{
	this._proto = null;
	this._last_shoot = 0;
	this._target = null;
	this._unit = null;
	this._position = null;
	
	this.init = function(unit)
	{
		this._unit = unit;
		this.updatePosition();
	};
	
	this.updatePosition = function()
	{
		if (this._unit.is_building)
		{
			this._position = {
				x: parseInt(this._unit.position.x - this._unit._proto.images.weapon.padding.x + this._unit._proto.images.weapon.size.x/2),
				y: parseInt(this._unit.position.y - this._unit._proto.images.weapon.padding.y + this._unit._proto.images.weapon.size.y/2)
			};
		}
		else
		{
			this._position = {
				x: this._unit.position.x + 12,
				y: this._unit.position.y + 12
			};
		}
	};
	
	this.isTargetAlive = function()
	{
		if (this._target.type == 'object')
			if (game.objects[this._target.objid] === undefined)
			{
				if (this._unit.is_building)
					this._unit.state = 'NORMAL';
				else
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
			pos = {x: obj.position.x, y: obj.position.y};
			if (obj.is_building)
			{
				pos.x += obj._proto.cell_padding.x * CELL_SIZE;
				pos.y += obj._proto.cell_padding.y * CELL_SIZE;
			}
		}
		
		return {
			x: pos.x + 12,
			y: pos.y + 12
		};
	};
	
	this.canAttackTarget = function(target)
	{
		if (target.type == 'object')
		{
			if (this._unit.uid == target.objid)
				return false;
			
			if (game.objects[target.objid]._proto.move_mode == MOVE_MODE_FLY)
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
		var distance = this._getDistance();
		return ((distance >= this._proto.minimum_range) && (distance <= this._proto.maximum_range));
	};
	
	this.shoot = function()
	{
		var uid, effect, to = this.getTargetPosition();
		
		this._last_shoot = (new Date()).getTime();
		
		//Rotate unit
		if (this._unit.is_building)
			this._unit.weapon_direction = 8 - parseInt(Math.atan2(this._position.y - to.y, this._position.x - to.x)*(180/Math.PI)/23.5);
		else
			this._unit.move_direction = 4 - parseInt(Math.atan2(this._position.y - to.y, this._position.x - to.x)*(180/Math.PI)/45);
		
		effect = new this._proto.effect();
		effect.init(this._position, to, this._proto.offence);
		uid = game.addEffect(effect);
		effect.uid = uid;
	};
	
	this._getDistance = function()
	{
		var target_pos = this.getTargetPosition();
		return Math.sqrt(Math.pow((this._position.x - target_pos.x)/CELL_SIZE, 2) + Math.pow((this._position.y - target_pos.y)/CELL_SIZE, 2))
	};
}

AbstractWeapon.setCommonOptions = function(obj)
{
	obj.prototype = new AbstractWeapon();

	obj.effect = null;      //Must redeclare
	
	obj.minimum_range = 0;  //SetAttributes(minimum_range, maximum_range, ?maxammo?, firedelay, energypershot)
	obj.maximum_range = 4;
	obj.firedelay = 270;    //shoot per msec. Calculation: 33.75*cfg_firedelay
	obj.can_shoot_ground = true;
	obj.can_shoot_flyer = false;
	obj.offence = {         //SetOffense(type strength ?area_effect?)
		type: 'E2',
		strength: 11
	};

	obj.loadResources = function()
	{
		this.effect.loadResources();
	};
};