function WeaponHolder(config_name)
{
	var config, position, unit, target = null, last_shoot = 0, partid = 0, current_ammo = -1;
	
	this.init = function(obj, obj_partid)
	{
		unit = obj;
		partid = obj_partid;
		config = WeaponConfig[config_name];
		
		if (config.ammo)
			current_ammo = config.ammo;
		
		this.updatePosition();
	};
	
	this.getAmmoState = function()
	{
		if (config.ammo)
			return current_ammo / config.ammo;
		return 1;
	};
	
	this.getDelayState = function()
	{
		return ((new Date()).getTime() - last_shoot) / config.firedelay;
	};
	
	this.reArm = function()
	{
		if (config.ammo)
			current_ammo = config.ammo;
	};
	
	this.updatePosition = function()
	{
		if (unit.is_building)
		{
			position = {
				x: parseInt(unit.position.x - unit._proto.images.weapon.padding.x + unit._proto.images.weapon.size.x/2),
				y: parseInt(unit.position.y - unit._proto.images.weapon.padding.y + unit._proto.images.weapon.size.y/2)
			};
		}
		else
		{
			position = {
				x: unit.position.x + 12,
				y: unit.position.y + 12
			};
		}
	};
	
	this.canAttackTarget = function(target)
	{
		if (target.type == 'object')
		{
			if (unit.uid == target.objid)
				return false;
			
			if (game.objects[target.objid]._proto.move_mode == MOVE_MODE_FLY)
				return config.can_shoot_flyer;
			else
				return config.can_shoot_ground;
		}
		
		if (target.type == 'ground')
			return config.can_shoot_ground;
		
		return false;
	};
	
	this.setTarget = function(trg)
	{
		target = trg;
	};
	
	//Can shoot now?
	this.canShoot = function()
	{
		if (current_ammo == 0)
		{
			unit.triggerEvent('no_ammo');
			return false;
		}
		
		return (this.getDelayState() >= 1);
	};
	
	this.isTargetAlive = function()
	{
		if (target.type == 'object')
			if (game.objects[target.objid] === undefined)
			{
				if (unit.is_building)
					unit.state = BUILDING_STATE_NORMAL;
				else
					unit.state = 'STAND';
				target = null;
				return false;
			}
		return true;
	};
	
	this.getTargetPosition = function()
	{
		var pos = target, obj;
		
		if (target.type == 'object')
		{
			obj = game.objects[target.objid];
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
	
	this.getTargetLayer = function()
	{
		return (target.type == 'object' && game.objects[target.objid]._proto.move_mode == MOVE_MODE_FLY) ? MOVE_MODE_FLY : MOVE_MODE_GROUND;
	};
	
	this._getDistance = function()
	{
		var target_pos = this.getTargetPosition();
		return Math.sqrt(Math.pow((position.x - target_pos.x)/CELL_SIZE, 2) + Math.pow((position.y - target_pos.y)/CELL_SIZE, 2));
	};
	
	this.getMinRange = function()
	{
		return config.minimum_range;
	};
	
	this.getMaxRange = function()
	{
		return config.maximum_range;
	};
	
	this.canReach = function(trigger_events)
	{
		var distance = this._getDistance();
		
		if (distance < config.minimum_range)
		{
			if (trigger_events)
				unit.triggerEvent('standing_too_close', partid);
			return false;
		}
		
		if (distance > config.maximum_range)
		{
			if (trigger_events)
				unit.triggerEvent('standing_too_far', partid);
			return false;
		}
		
		return true;
	};
	
	this.shoot = function()
	{
		var position_from = position, to = this.getTargetPosition();
		
		last_shoot = (new Date()).getTime();
		
		//Decrease ammo
		if (config.ammo)
			current_ammo--;
		
		//Rotate unit
		if (unit.is_building)
			unit.setWeaponDirection(Math.getAngle(to.y - position.y, to.x - position.x));
		else
		{
			var x = unit.position.x, y = unit.position.y;
			unit.setDirection(Math.getAngle(to.y - position.y, to.x - position.x));
			if (partid > 0)
			{
				x += unit._proto.parts[0].hotspots[unit.parts[0].direction][1].x;
				y += unit._proto.parts[0].hotspots[unit.parts[0].direction][1].y;
			}
			
			position_from = {
				x: x + unit._proto.parts[partid].hotspots[unit.parts[partid].direction][2].x, 
				y: y + unit._proto.parts[partid].hotspots[unit.parts[partid].direction][2].y
			};
		}
		
		//Create bulet
		var uid = game.objects.length, bulet = new Bulet(config_name, this.getTargetLayer());
		bulet.uid = uid;
		game.objects.push(bulet);
		bulet.init(position_from, to, unit.uid);
	};
	
	this.canAttackGround = function()
	{
		return config.can_shoot_ground;
	};
	
	this.canAttackFly = function()
	{
		return config.can_shoot_flyer;
	};
}

WeaponHolder.loadResources = function()
{
	for (var i in WeaponConfig)
	{
		if (WeaponConfig[i].fire_sound)
			game.resources.addSound(WeaponConfig[i].fire_sound, 'sounds/weapon/' + WeaponConfig[i].fire_sound + '.' + AUDIO_TYPE);
		if (WeaponConfig[i].hit_sound)
			game.resources.addSound(WeaponConfig[i].hit_sound, 'sounds/weapon/' + WeaponConfig[i].hit_sound + '.' + AUDIO_TYPE);
	}
};