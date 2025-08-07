var BUILDING_STATE_NORMAL = 1;
var BUILDING_STATE_CONSTRUCTION = 2;
var BUILDING_STATE_SELL = 3;
var BUILDING_STATE_ATTACK = 4;
var BUILDING_STATE_ATTACKING = 5;
var BUILDING_STATE_CHARGING = 6;
var BUILDING_STATE_PRODUCING = 7;
var BUILDING_STATE_UPGRADING = 8;

function AbstractBuilding()
{
	this.uid = -1;
	this.player = 0;
	this.health = 0;
	this._proto = null;
	this.state = BUILDING_STATE_CONSTRUCTION;
	this.progress_bar = 0;
	this.weapon = null;
	this.action = null;
	this.tactic_group = -1;

	this.is_effect = false;
	this.is_building = true;
	this.is_selected = false;
	this._is_have_weapon = false;
	
	this.position = {x: 0, y: 0};
	
	//For carry units
	this._carry_units = [];
	this._carry_spaces = 0;
	
	//Building animation
	this._draw_last_frame_change = 0;
	this._draw_cur_frame = 0;
	this._object_color = '';
	
	//Repairing
	this._is_repairing = false;
	this._repairing_effect_id = 0;
	
	//Active part
	this.weapon_direction = 0;
	this.anim_attack_frame = 0;
	this.start_animation = 0;
	
	this.damage_animator = null;
	
	this._last_scan_time = 0;
	
	this.init = function(pos_x, pos_y, player)
	{
		this.player = player;
		
		this.position = MapCell.cellToPixel({x: pos_x, y: pos_y});
		
		if (player != PLAYER_NEUTRAL)
			this._object_color = game.players[this.player].getUnitColor();
		
		if (this._proto.weapon != '')
		{
			this.weapon = new WeaponHolder(this._proto.weapon);
			this.weapon.init(this);
			this._is_have_weapon = true;
		}
	};
	
	this.applyFix = function(fix)
	{
		var aplly = Math.min(this._proto.health_max-this.health, fix),
			new_health = this.health + aplly, 
			animation_index;
		
		if (this.damage_animator !== null)
		{
			animation_index = this._findDamageAnimation(this.health, new_health);
			if (animation_index !== -1)
				this.damage_animator.stop();
		}
			
		this.health = new_health;
		return aplly;
	};
	
	this.applyDamage = function(damage)
	{
		if (this.health <= 0)
			return; //Already destroyed
		
		var new_health = this.health - damage, animation_index = this._findDamageAnimation(new_health, this.health);
		
		this.health = new_health;
		if (animation_index !== -1)
			this._animateDamage(animation_index);
		
		if (this.health <= 0)
		{
			if (this._proto.crater > -1)
				CraterEffect.create(this);
			
			if (this._proto.death_sound != '')
				game.resources.playOnPosition(this._proto.death_sound, false, this.position, true);
			
			this._removingRecalc(this._proto);
			InterfaceConstructManager.recalcUnitAvailability(this.player);
			
			game.kill_objects.push(this.uid);
		}
	};
	
	this._findDamageAnimation = function(min_health, max_health)
	{
		if (this._proto.health_explosions.length == 0)
			return -1;
		
		var j, i, proc_min = Math.ceil(min_health/this._proto.health_max * 100),
			proc_max = Math.ceil(max_health/this._proto.health_max * 100);
		
		for (i in this._proto.health_explosions)
		{
			j = parseInt(i);
			if ((j >= proc_min) && (j < proc_max))
				return j;
		}
		return -1;
	};
	
	this.getCell = function()
	{
		return MapCell.pixelToCell(this.position);
	};
	
	this.drawSelection = function(is_onmouse)
	{
		this._drawSelectionStandart(is_onmouse);
	};
	
	this._drawSelectionStandart = function(is_onmouse)
	{
		var top_x = this.position.x - game.viewport_x,
			top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y + 10  - game.viewport_y;
		
		if (this.player == PLAYER_NEUTRAL)
			game.viewport_ctx.strokeStyle = '#ffff00';
		else if (this.player == PLAYER_HUMAN)
			game.viewport_ctx.strokeStyle = (this.is_selected) ? '#ffffff' : '#393939';
		else
			game.viewport_ctx.strokeStyle = '#fc0800'; //Change it later to support aliances
		
		game.viewport_ctx.lineWidth = 1;
		
		game.viewport_ctx.beginPath();
		game.viewport_ctx.moveTo(top_x - 3, top_y - 8);
		game.viewport_ctx.lineTo(top_x, top_y + 0.5);
		game.viewport_ctx.lineTo(top_x + CELL_SIZE*this._proto.cell_size.x, top_y + 0.5);
		game.viewport_ctx.lineTo(top_x + CELL_SIZE*this._proto.cell_size.x + 3, top_y - 8);
		game.viewport_ctx.stroke();
		
		//Health
		var health_width = Math.round(CELL_SIZE*this._proto.cell_size.x*0.66);
		top_x += Math.round(health_width/4);
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y-2, health_width, 4);
		
		if (this.health < this._proto.health_max)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y - 1, health_width - 2, 2);
		}

		var health_proc = this.health / this._proto.health_max;
		if (health_proc > 0.66)
			game.viewport_ctx.fillStyle = '#51FA00';
		else if (health_proc > 0.33)
			game.viewport_ctx.fillStyle = '#FCFC00';
		else
			game.viewport_ctx.fillStyle = '#FC0000';
		game.viewport_ctx.fillRect(top_x + 1, top_y - 1, (health_width - 2)*health_proc, 2);
		
		//Draw name
		top_y = this.position.y - this._proto.images.normal.padding.y - 16.5 - game.viewport_y;
		top_x = this.position.x - 0.5 + health_width/4 - game.viewport_x;
		
		if (this.player == PLAYER_HUMAN)
		{
			if (this.state == BUILDING_STATE_CONSTRUCTION || this.state == BUILDING_STATE_SELL || this.state == BUILDING_STATE_UPGRADING)
			{
				var text = 'Under Construction';
				
				if (this.state == BUILDING_STATE_SELL)
					text = 'Demolishing';
				else if (this.state == BUILDING_STATE_UPGRADING)
					text = 'Upgrading';
					
				this._drawProgressBar(this.progress_bar, text);
				top_y -= 15;
			}
			
			if (this.state == BUILDING_STATE_CHARGING)
			{
				this._drawProgressBar(this.progress_bar, 'Charging');
				top_y -= 15;
			}

			if (this.state == BUILDING_STATE_PRODUCING)
			{
				var info = ProducingQueue.getProductionInfo(this.uid);
				this._drawProgressBar(info.progress, info.name);
				top_y -= 15;
			}
			
			if (this._proto.upgradable && this._proto.can_upgrade_now[this.player])
			{
				var up_top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y - 8.5 - game.viewport_y;;
				game.fontDraw.drawOnCanvas(
					'Upgrade ' + this._proto.upgrade_to.cost + 'c', game.viewport_ctx, top_x, up_top_y, 
					'yellow', 'center', health_width
				);
			}
		}
		
		if (is_onmouse)
			game.fontDraw.drawOnCanvas(
				this._proto.obj_name, game.viewport_ctx, top_x, top_y, 
				'yellow', 'center', health_width
			);
	};
	
	this._drawProgressBar = function(proc, title)
	{
		var bar_width = Math.round(CELL_SIZE*this._proto.cell_size.x*0.66), 
			top_x = this.position.x - game.viewport_x + Math.round(bar_width/4),
			top_y = this.position.y - this._proto.images.normal.padding.y - game.viewport_y;
			
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y-2, bar_width, 4);
		game.viewport_ctx.fillStyle = '#bbbbbb';
		game.viewport_ctx.fillRect(top_x + 1, top_y - 1, bar_width - 2, 2);
		game.viewport_ctx.fillStyle = '#FCFC00';
		game.viewport_ctx.fillRect(top_x + 1, top_y - 1, (bar_width - 2)*proc, 2);
		
		top_y = this.position.y - this._proto.images.normal.padding.y - 16.5 - game.viewport_y;
		
		game.fontDraw.drawOnCanvas(
			title, game.viewport_ctx, top_x + 0.5, top_y, 
			'yellow', 'center', bar_width
		);
	};
	
	this._animateDamage = function(state)
	{
		if (this.damage_animator !== null)
			this.damage_animator.stop();
		
		this.damage_animator = new Animator();
		this.damage_animator.animate(this.uid, this._proto.health_explosions[state]);
	};
	
	this.canBeSelected = function()
	{
		return true;
	};
	
	this.select = function(is_select, play_sound)
	{
		this.is_selected = is_select;
	};
	
	this.markCellsOnMap = function(userid)
	{
		var i = -1, x, y, cell = this.getCell(), cell_type = (userid==-1) ? CELL_TYPE_EMPTY : CELL_TYPE_BUILDING;
		for (x=0; x<this._proto.cell_size.x; ++x)
			for (y=0; y<this._proto.cell_size.y; ++y)
			{
				++i;
				if (this._proto.move_matrix[i] == 1)
					CurrentLevel.map_cells[cell.x+x][cell.y+y].type = cell_type;
				
				if (this._proto.cell_matrix[i] == 1)
					CurrentLevel.map_cells[cell.x+x][cell.y+y].building = userid;
				
			}
	};
	
	this.run = function() 
	{
		if (this instanceof FGLaserTurretBuilding) {
			
		}

		switch (this.state)
		{
			case BUILDING_STATE_ATTACK:
				if (this.weapon.canShoot() && this.weapon.isTargetAlive())
				{
					if (this.weapon.canReach(false))
					{
						this.state = BUILDING_STATE_ATTACKING;
						this.anim_attack_frame = 0;
						this.start_animation = 0;
					}
					else
						this.state = BUILDING_STATE_NORMAL;
				}
				break;
				
			case BUILDING_STATE_ATTACKING:
				if (this.weapon.isTargetAlive())
				{
					var can_shoot = true;
					if (this._proto.images.weapon.animated)
					{
						this.anim_attack_frame++;
						if (this.anim_attack_frame < this._proto.images.weapon.frames)
							can_shoot = false;
					}				
					if (can_shoot)
					{
						this.weapon.shoot();
						this.state = BUILDING_STATE_ATTACK;
					}
				}
				else
					this.state = BUILDING_STATE_NORMAL;
				break;
		}


		
		var time = performance.now();
		if  ((time - this._last_scan_time) > UNIT_SCAN_INTERVAL)
		{
			this._last_scan_time = time;
			DefenseAI.regularScan(this);
		}
	};
	
	this.sell = function()
	{
		if (this.state!=BUILDING_STATE_NORMAL && this.state!=BUILDING_STATE_CHARGING)
			return;
		
		this.state = BUILDING_STATE_SELL;
		var time = (game.debug.quick_build) ? 2 : this._proto.sell_time;
		ActionsHeap.add(this.uid, 'sell', {
			steps: time,
			current: 0
		});
	};
	
	this.repair = function()
	{
		if (this._proto.is_bridge)
			return;
		
		if (this._is_repairing)
		{
			this._is_repairing = false;
			ActionsHeap.remove(this.uid, 'repair');
			game.deleteEffect(this._repairing_effect_id);
		}
		else
		{
			if (this.state == BUILDING_STATE_CONSTRUCTION)
				return;
			
			if (this.health >= this._proto.health_max)
				return;
			
			this._is_repairing = true;
			ActionsHeap.add(this.uid, 'repair', 0);
			
			this._repairing_effect_id = SimpleEffect.quickCreate('repricon_animation', {
				looped: true,
				pos: {
					x: this.position.x + CELL_SIZE*this._proto.cell_padding.x,
					y: this.position.y + CELL_SIZE*this._proto.cell_padding.y
				}
			});
		}
	};
	
	this.draw = function(cur_time)
	{
		if (this.state == BUILDING_STATE_CONSTRUCTION || this.state == BUILDING_STATE_UPGRADING)
		{
			if (this._proto.images.shadow !== null)
				this._drawShadow(0, 0);
			this._drawSprite(DRAW_LAYER_GBUILD, 0, 0);
			this._drawSprite(DRAW_LAYER_TBUILD, 1, 0);
		}
		else
		{
			if ((this.health / this._proto.health_max) < 0.33)
			{
				if (this._proto.images.shadow !== null)
					this._drawShadow(0, 2);
				this._drawSprite(DRAW_LAYER_GBUILD, 0, 2);
				this._drawSprite(DRAW_LAYER_TBUILD, 1, 2);
			}
			else
			{
				if (this._proto.images.shadow !== null)
					this._drawShadow(0, 1);
				this._drawSprite(DRAW_LAYER_GBUILD, 0, 1);

				if (this._proto.images.normal.animated)
				{
					this._drawSprite(DRAW_LAYER_TBUILD, this._proto.images.normal.frames[this._draw_cur_frame], 1);

					if ((cur_time - this._draw_last_frame_change)>200)
					{
						++this._draw_cur_frame;
						this._draw_cur_frame %= this._proto.images.normal.frames.length;
						this._draw_last_frame_change = cur_time;
					}
				}
				else
					this._drawSprite(DRAW_LAYER_TBUILD, 1, 1);
			}
			
			if (this.weapon !== null)
			{
				if (this.state == BUILDING_STATE_ATTACKING && this._proto.images.weapon.animated)
					this._drawWeapon('attack', parseInt((cur_time - this.start_animation) / ANIMATION_SPEED) % this._proto.images.weapon.frames);
				else
					this._drawWeapon('weapon', 0);
			}
		}
	};
	
	this.setWeaponDirection = function(angle)
	{
		if (this._proto.images.weapon.no_direction)
			return;
		
		this.weapon_direction = Math.calcFrameByAngle(angle, 16);
	};
	
	this._drawWeapon = function(key, frame)
	{
		game.objDraw.addElement(DRAW_LAYER_ABUILD, this.position.y, {
			res_key: this._proto.res_key + '_' + key, 
			src_x: this._proto.images.weapon.size.x * this.weapon_direction,
			src_y: this._proto.images.weapon.size.y * frame,
			src_width: this._proto.images.weapon.size.x,
			src_height: this._proto.images.weapon.size.y,
			x: this.position.x - this._proto.images.weapon.padding.x - game.viewport_x,
			y: this.position.y - this._proto.images.weapon.padding.y - game.viewport_y
		});
	};
	
	this._drawSprite = function(layer, frame_x, frame_y)
	{
		var key = this._proto.res_key;
		if (this._proto.res_multicolor)
			key += this._object_color;
		
		game.objDraw.addElement(layer, this.position.y, {
			res_key: key, 
			src_x: this._proto.images.normal.size.x * frame_x,
			src_y: this._proto.images.normal.size.y * frame_y,
			src_width: this._proto.images.normal.size.x,
			src_height: this._proto.images.normal.size.y,
			x: this.position.x - this._proto.images.normal.padding.x - game.viewport_x,
			y: this.position.y - this._proto.images.normal.padding.y - game.viewport_y
		});
	};
	
	this._drawShadow = function(frame_x, frame_y)
	{
		game.objDraw.addElement(DRAW_LAYER_SHADOWS, this.position.y, {
			res_key: this._proto.res_key + '_shadow',
			src_x: (this._proto.images.shadow.static_img) ? 0 : this._proto.images.shadow.size.x * frame_x,
			src_y: (this._proto.images.shadow.static_img) ? 0 : this._proto.images.shadow.size.y * frame_y,
			src_width: this._proto.images.shadow.size.x,
			src_height: this._proto.images.shadow.size.y,
			x: this.position.x - this._proto.images.shadow.padding.x - game.viewport_x,
			y: this.position.y - this._proto.images.shadow.padding.y - game.viewport_y
		});
	};
	
	this.canAttackGround = function()
	{
		if (this.weapon === null)
			return false;
		return this.weapon.canAttackGround();
	};
	
	this.canAttackFly = function()
	{
		if (this.weapon === null)
			return false;
		return this.weapon.canAttackFly();
	};
	
	this.orderAttack = function(target)
	{
		if (this.weapon === null)
			return;
		
		if (this.state != BUILDING_STATE_NORMAL && this.state != BUILDING_STATE_ATTACK)
			return;

		if (this.weapon.canAttackTarget(target))
			this.weapon.setTarget(target);
		
		this.state = BUILDING_STATE_ATTACK;
		this.action = {
			type: 'attack',
			target: target
		};
	};

	this.isCanAttackTarget = function(target, callback)
	{
		if (!this._is_have_weapon)
			return false;
		
		var ret = false;
		if (this.weapon && this.weapon.canAttackTarget(target))
		{
			if (callback)
				callback(this.weapon);
			
			ret = true;
		}
		
		return ret;
	};
	
	this.orderStop = function()
	{
		this.action = {type: ''};
		
		if (this.state == BUILDING_STATE_ATTACK || this.state == BUILDING_STATE_ATTACKING)
			this.state = BUILDING_STATE_NORMAL;
	};
	
	this._removingRecalc = function(obj_proto)
	{
		obj_proto.count[this.player]--;
		game.players[this.player].energyAddCurrent(-1*obj_proto.energy);
		
		if (obj_proto.upgrade_from !== null)
			this._removingRecalc(obj_proto.upgrade_from);
	};
	
	this.produce = function(obj)
	{
		var cell = this.getCell(), unit = AbstractUnit.createNew(obj, cell.x + 2, cell.y + 2, this.player); //@todo: change position?
		cell = PathFinder.findNearestEmptyCell(cell.x, cell.y + 5, unit._proto.move_mode);
		unit.orderMove(cell);
	};
	
	this.isUpgradePossible = function()
	{
		return (this._proto.upgradable && this._proto.can_upgrade_now[this.player] && this.state==BUILDING_STATE_NORMAL);
	};
	
	this.isHuman = function()
	{
		return false;
	};
	
	this.isHealer = function()
	{
		return this._proto.is_healer;
	};
	
	this.isFixer = function()
	{
		return this._proto.is_fixer;
	};
	
	this.isTeleport = function()
	{
		return this._proto.is_teleport;
	};
	
	this.canHarvest = function()
	{
		return false;
	};
	
	this.isHarvestPlatform = function()
	{
		return false;
	};
	
	//Buildings with ability to carry 
	
	this.canCarry = function()
	{
		return (this._proto.carry !== null);
	};
	
	this.haveInsideUnits = function()
	{
		return (this._carry_spaces < this._proto.carry.places);
	};
	
	this.haveFreeSpace = function(min_mass)
	{
		return (this._carry_spaces>0 && this._proto.carry.max_mass>=min_mass && (this.state==BUILDING_STATE_NORMAL || this.state==BUILDING_STATE_CHARGING));
	};
	
	this.extractCarry = function()
	{
		if (!this.haveInsideUnits())
			return;
		
		var i, pos, unit, mypos = this.getCell();
		for (i in this._carry_units)
		{
			unit = game.objects[this._carry_units[i]];
			pos = PathFinder.findNearestStandCell(mypos.x + 1, mypos.y + 2);
			unit.setCell(pos);
			CurrentLevel.map_cells[pos.x][pos.y].ground_unit = unit.uid;
			unit.changeFogState(1);
		}
		
		this._carry_units = [];
		this._carry_spaces = this._proto.carry.places;
	};
	
	this.inputCarry = function(unit)
	{
		unit.orderStop();
		
		if (!this.haveFreeSpace(unit._proto.mass))
			return;
		
		var pos = unit.getCell();
		game.unselectUnit(unit.uid);
		CurrentLevel.map_cells[pos.x][pos.y].ground_unit = -1;
		unit.changeFogState(-1);
		unit.position = {x: -100, y: -100};
		this._carry_units.push(unit.uid);
		this._carry_spaces--;
	};
	
	//Functions for resource containing buildings
	//Need to move it to another abstract object
	
	this.isResFull = function()
	{
		return (this.res_now >= this.res_max);
	};
	
	this.decreaseRes = function(amount)
	{
		if (this.res_now < amount)
			amount = this.res_now;
		
		this.res_now -= amount;
		return amount;
	};
	
	this.increaseRes = function(amount)
	{
		return this._standardIncreaseRes(amount);
	};
	
	this._standardIncreaseRes = function(amount)
	{
		if ((this.res_now+amount) > this.res_max)
			amount = this.res_max - this.res_now;
		
		this.res_now += amount;
		return amount;
	};
	
	this.changeFogState = function(state)
	{
		if (this.player != PLAYER_HUMAN)
			return;
		
		if (!GAMECONFIG.fog && state<1)
			return;
		
		var x, y, pos = this.getCell();
		
		pos.x += this._proto.cell_padding.x;
		pos.y += this._proto.cell_padding.y;
		
		for (x = pos.x - this._proto.seeing_range + 1; x < pos.x + this._proto.seeing_range; ++x)
		{
			if (!MapCell.isCorrectX(x))
				continue;
			
			for (y = pos.y - this._proto.seeing_range + 1; y < pos.y + this._proto.seeing_range; ++y)
			{
				if (!MapCell.isCorrectY(y))
					continue;
				
				if ((Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)) < this._proto.seeing_range))
					CurrentLevel.map_cells[x][y].fog_new_state += state;
			}
		}
		
		InterfaceFogOfWar.need_redraw = true;
	};
	
	//Event functions
	
	this.triggerEvent = function(event, params)
	{
		DefenseAI.handleUnitEvent(this, event, params);
	};
	
	this.onObjectDeletion = function() 
	{
		this.markCellsOnMap(-1);
		this.onObjectDeletionCustom();
		this.changeFogState(-1);
	};
	
	this.onConstructed = function() 
	{
		this._proto.count[this.player]++;
		
		if (this.state == BUILDING_STATE_CONSTRUCTION)
			InterfaceSoundQueue.addSound('construction_complete');
		if (this.state == BUILDING_STATE_UPGRADING)
			InterfaceSoundQueue.addSound('construction_complete');
			this.health = this._proto.health_max;
		
		InterfaceConstructManager.recalcUnitAvailability(this.player);

		game.players[this.player].energyAddCurrent(this._proto.energy);
		this.state = BUILDING_STATE_NORMAL;

		if (this._proto.is_built_from_edge && game.started)
		{
			var cell = this.getCell(), pos = PathFinder.findNearestStandCell(cell.x, cell.y);
			AbstractUnit.createNew(ConstructionRigUnit, pos.x, pos.y, this.player, true);
		}

		this.onConstructedCustom();
	};
	
	this.onSold = function() 
	{
		var cell = this.getCell();
			
		this._removingRecalc(this._proto);
		InterfaceConstructManager.recalcUnitAvailability(this.player);

		game.players[this.player].addMoney(this._proto.sell_cost);

		if (!this._proto.is_built_from_edge)
		{
			var pos = PathFinder.findNearestStandCell(cell.x + 2, cell.y + 2);
			AbstractUnit.createNew(ConstructionRigUnit, pos.x, pos.y, this.player, true);
		}
		
		if (this.damage_animator !== null)
			this.damage_animator.stop();

		game.kill_objects.push(this.uid);
	};
	
	this.onObjectDeletionCustom = function() {};
	this.onConstructedCustom = function() {};
}

//Static methods
AbstractBuilding.drawBuildMouse = function(obj, x, y)
{				
	// TODO Requesting unexisting resource: clr resources.js:140 
	if (obj.is_bridge)
	{
		BridgeTypeBuilding.drawBuildMouse(obj, x, y);
		return
	}
		
	var i = -1, color_type = obj.res_multicolor ? 'yellow' : '';

	MousePointer.mouse_ctx.drawImage(
		game.resources.get(obj.res_key + color_type), 0, obj.images.normal.size.y, 
		obj.images.normal.size.x, obj.images.normal.size.y, 
		x*CELL_SIZE - game.viewport_x - obj.images.normal.padding.x + 12, 
		y*CELL_SIZE - game.viewport_y - obj.images.normal.padding.y + 12, 
		obj.images.normal.size.x, obj.images.normal.size.y
	);
	MousePointer.mouse_ctx.drawImage(
		game.resources.get(obj.res_key + color_type), obj.images.normal.size.x, obj.images.normal.size.y, 
		obj.images.normal.size.x, obj.images.normal.size.y, 
		x*CELL_SIZE - game.viewport_x - obj.images.normal.padding.x + 12, 
		y*CELL_SIZE - game.viewport_y - obj.images.normal.padding.y + 12, 
		obj.images.normal.size.x, obj.images.normal.size.y
	);
	
	MousePointer.mouse_ctx.save();
	MousePointer.mouse_ctx.globalCompositeOperation = "overlay";
	MousePointer.mouse_ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
	for (var xx = 0; xx<obj.cell_size.x; ++xx)
	{
		var xxx = xx+x;
		if (!MapCell.isCorrectX(xxx))
			continue;
		
		for (var yy = 0; yy<obj.cell_size.y; ++yy)
		{
			++i;
			if (obj.cell_matrix[i] == 0)
				continue;
			
			var yyy = yy+y;
			if (!MapCell.isCorrectY(yyy))
				continue;
			
			var cell = CurrentLevel.map_cells[xxx][yyy], unitid = MapCell.getSingleUserId(cell);
			if (cell.type!=CELL_TYPE_EMPTY || cell.shroud==1 || (unitid!=-1 && unitid!=game.action_state_options.requested_unit))
			{
				MousePointer.mouse_ctx.fillRect(xxx*CELL_SIZE - game.viewport_x + 12, yyy*CELL_SIZE - game.viewport_y + 12, CELL_SIZE, CELL_SIZE);
			}
		}
	}
	MousePointer.mouse_ctx.restore();
};

AbstractBuilding.createNew = function(obj, x, y, player, instant_build)
{
	var uid = game.objects.length, new_obj;
	game.objects.push(new obj(x, y, player));
	new_obj = game.objects[uid];
	new_obj.uid = uid;
	new_obj.markCellsOnMap(uid);
	new_obj.changeFogState(1);
	
	if (instant_build)
	{
		new_obj.state = BUILDING_STATE_NORMAL;
		new_obj.health = obj.health_max;
		new_obj.onConstructed();
		obj.count[player]++;
	}
	else
	{
		InterfaceSoundQueue.addSound('construction_under_way');
		var time = (game.debug.quick_build) ? 2 : obj.build_time;
		ActionsHeap.add(uid, 'construct', {
			steps: time,
			current: 0,
			money: parseInt(obj.cost / time),
			health: Math.ceil(obj.health_max / time)
		});
	}
};

AbstractBuilding.canBuild = function(obj, x, y, unit)
{
	if (!game.players[PLAYER_HUMAN].haveEnoughMoney(obj.cost))
		return false;
	
	if (!obj.enabled[PLAYER_HUMAN])
		return false;
	
	if (obj.is_bridge)
		return BridgeTypeBuilding.canBuild(obj, x, y, unit);
	
	var i = -1;
	
	for (var xx = 0; xx<obj.cell_size.x; ++xx)
	{
		var xxx = xx+x;
		
		if (!MapCell.isCorrectX(xxx))
			return false;
		
		for (var yy = 0; yy<obj.cell_size.y; ++yy)
		{
			++i;
			if (obj.cell_matrix[i] == 0)
				continue;
			
			var yyy = yy+y;
			if (!MapCell.isCorrectY(yyy))
				return false;
			
			var cell = CurrentLevel.map_cells[xxx][yyy], unitid = MapCell.getSingleUserId(cell);
			if (cell.type!=CELL_TYPE_EMPTY || cell.shroud==1 || (unitid!=-1 && unitid!=unit))
				return false;
		}
	}
	
	return true;
};

AbstractBuilding.loadResources = function(obj)
{
	var img_path = 'images/buildings/' + CurrentLevel.theme + '/' + obj.res_key + '/';
	
	game.resources.addImage(obj.res_key, img_path + 'sprite.png', obj.res_multicolor);
	
	if (typeof obj.require_building == 'undefined')
		game.resources.addImage(obj.res_key + '_box', img_path + 'box.png');
	
	if (obj.images.shadow !== null)
		game.resources.addImage(obj.res_key + '_shadow', img_path + 'shadow.png');
	
	if (obj.death_sound != '')
		game.resources.addSound(obj.death_sound,   'sounds/' + obj.death_sound + '.' + AUDIO_TYPE);
	
	if (obj.can_build && obj.upgrade_from===null)
		game.resources.addImage(obj.res_key + '_box', img_path + 'box.png');
	
	if (obj.weapon != '')
	{
		game.resources.addImage(obj.res_key + '_weapon', img_path + 'weapon.png');
		if (obj.images.weapon.animated)
			game.resources.addImage(obj.res_key + '_attack', img_path + 'attack.png');
	}
};

AbstractBuilding.getById = function(obj_id)
{
	if (game.objects[obj_id] === undefined)
		return null;
		
	if (!game.objects[obj_id].is_building)
		return null;
	
	return game.objects[obj_id];
};

AbstractBuilding.isExists = function(obj_id)
{
	return (AbstractBuilding.getById(obj_id) !== null);
};

AbstractBuilding.canSelectedProduce = function(obj)
{
	if (game.selected_info.is_building)
		return (obj.construction_building.indexOf(game.objects[game.selected_objects[0]]._proto) != -1);

	return true;
};

AbstractBuilding.setBuildingCommonOptions = function(obj)
{
	obj.prototype = new AbstractBuilding();
	
	obj.res_key = '';  //Must redeclare
	obj.res_multicolor = true;
	obj.obj_name = ''; //Must redeclare
	obj.cost = 0;
	obj.build_time = 0; //config_speed / 1.5
	obj.sell_cost = 0;
	obj.sell_time = 0;  //config_speed / 1.5
	obj.health_max = 100;
	obj.energy = 0;
	obj.enabled = Array.factory(PLAYERS_COUNT, false);
	obj.can_build = false;
	obj.count = Array.factory(PLAYERS_COUNT, 0);
	obj.is_bridge = false;
	obj.shield_type = 'BuildingArmour';
	obj.crater = -1;
	obj.is_built_from_edge = false;
	obj.weapon = '';
	obj.is_healer = false;
	obj.is_fixer = false;
	obj.is_teleport = false;
	obj.seeing_range = 8;
	
	obj.carry = null;

	obj.cell_size = null;       //Must redeclare
	obj.cell_matrix = null;     //Must redeclare
	obj.move_matrix = null;     //Must redeclare
	obj.cell_padding = null;    //Must redeclare
	obj.images = null;          //Must redeclare
	obj.hotpoints = [];
	obj.health_explosions = {
		0: 'building_0_explosion',
		33: 'building_33_explosion',
		60: 'building_60_explosion',
		80: 'building_80_explosion'
	};
	obj.death_sound = 'gxexpoc1';
	
	obj.require_building = [];

	obj.upgradable = false;
	obj.upgrade_from = null;
	obj.can_upgrade_now = Array.factory(PLAYERS_COUNT, false);
	obj.upgrade_to = null;
	
	obj.loadResources = function(){
		AbstractBuilding.loadResources(this);
	};
};
