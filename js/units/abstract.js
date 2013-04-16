function AbstractUnit(pos_x, pos_y, player)
{
	this.uid = -1;
	this.player = player;
	
	this._proto = null;
	
	this.health = 100;
	this.is_selected = false;
	this.is_building = false;
	this.is_effect = false;
	this.position = null;
	this.weapon = null;
	
	this.move_direction = 0; //[E, NE, N,    NW,     W,    SW, S, SE]
	this.direction_matrix =    [3,  4, 5, -1, 2, -1, 6, -1, 1, 0,  7];
	this.move_path = [];
	
	this.startAnimation = 0; 
	this.anim_attack_frame = 0;
	
	this.action = {type: ''};
	this.state = 'STAND';
	this.substate = '';
	
	this.init = function(pos_x, pos_y)
	{
		this.position = MapCell.cellToPixel({x: pos_x, y: pos_y});
		
		this.health = this._proto.health_max;
		
		if (this._proto.weapon != '')
		{
			this.weapon = new WeaponHolder(this._proto.weapon);
			this.weapon.init(this);
		}
	};
	
	this.getCell = function()
	{
		return MapCell.pixelToCell(this.position);
	};
	
	this.applyHeal = function(heal)
	{
		this.health += heal;
		if (this.health > this._proto.health_max)
			this.health = this._proto.health_max;
	};
	
	this.applyDamage = function(damage)
	{
		if (this.health <= 0)
			return; //Already killed
		
		this.health -= damage;
		if (this.health <= 0)
		{
			var ucenter = {
				x: (this.position.x - this._proto.images.stand.padding.x) + parseInt(this._proto.images.stand.size.x / 2),
				y: (this.position.y - this._proto.images.stand.padding.y) + parseInt(this._proto.images.stand.size.y / 2)
			};
			SimpleEffect.quickCreate(this._proto.die_effect, {pos: ucenter});
			game.kill_objects.push(this.uid);
		}
	};
	
	this.orderMove = function(x, y, play_sound)
	{
		this.action = {type: ''};
		
		this._move(x, y);
		
		if (this.move_path.length>0 && play_sound)
			this._playSound(this._proto.response_sounds);
	};
	
	this.orderStop = function()
	{
		this.action = {type: ''};
		
		if (this.state == 'MOVE')
			this.move_path = this.move_path.slice(0, 1);
		else
			this.state = 'STAND';
	};
	
	this.orderAttack = function(target)
	{
		if (this.weapon === null)
			return;
		
		if (this.weapon.canAttackTarget(target))
			this.weapon.setTarget(target);
		
		if (this.state == 'MOVE')
			this.orderStop();
		else
			this.state = 'ATTACK';
		
		this.action = {
			type: 'attack',
			target: target
		};
	};
	
	this.orderHeal = function(hospital, play_sound)
	{
		if (play_sound)
			this._playSound(this._proto.response_sounds);
		
		if (this.health >= this._proto.health_max)
			return;
		
		var pos = hospital.getCell();
		pos.y += 2;
		
		this.action = {
			type: 'go_heal',
			target_position: pos,
			target_id: hospital.uid
		};
		this._move(pos.x, pos.y, false);
	};
	
	this.orderFix = function(fixer, play_sound)
	{
		if (play_sound)
			this._playSound(this._proto.response_sounds);
		
		if (this._proto.is_human)
			return;
		
		if (this.health >= this._proto.health_max)
			return;
		
		var pos = fixer.getCell();
		pos.x += 1;
		pos.y += 2;
		
		this.action = {
			type: 'go_heal',
			target_position: pos,
			target_id: fixer.uid
		};
		this._move(pos.x, pos.y, false);
	};
	
	this.orderToTeleport = function(teleport, play_sound)
	{
		if (play_sound)
			this._playSound(this._proto.response_sounds);
		
		if (this._proto.move_mode == MOVE_MODE_FLY)
			return;
		
		var pos = teleport.getCell();
		pos.x += 1;
		pos.y += 1;
		
		this.action = {
			type: 'go_teleport',
			target_position: pos,
			target_id: teleport.uid
		};
		this._move(pos.x, pos.y, false);
	};
	
	this.orderWait = function(time)
	{
		this.state = 'WAITING';
		this.action.wait_till = (new Date).getTime() + time;
	};
	
	this._move = function(x, y) 
	{
		var pos, need_move = false, tmp_path;
		
		if (typeof y === 'undefined')
		{
			y = x.y;
			x = x.x;
		}
		
		if (this.move_path.length != 0)
		{
			this.move_path = this.move_path.slice(0, 1);
			pos = this.move_path[0];
		}
		else
		{
			pos = this.getCell();
			need_move = true;
		}
		
		tmp_path = PathFinder.findPath(pos.x, pos.y, x, y, this._proto.move_mode, false);
		
		this.move_path = this.move_path.concat(tmp_path);
		this.state = 'MOVE';
		
		if (need_move && this.move_path.length>0)
			this._moveToNextCell();
	};
	
	this.run = function() 
	{
		switch (this.state)
		{
			case 'MOVE':
				this._runStandartMoving();
				break;
				
			case 'WAITING':
				if ((new Date).getTime() > this.action.wait_till)
					this.afterWaiting();
				break;
			
			case 'HEALING':
			case 'STAND':
				break;
				
			case 'ATTACK':
				if (this.weapon.canShoot() && this.weapon.isTargetAlive())
				{
					if (this.weapon.canReach())
					{
						this.state = 'ATTACKING';
						this.anim_attack_frame = 0;
						this.startAnimation = 0;
					}
					else
					{
						var pos = MapCell.pixelToCell(this.weapon.getTargetPosition());
						pos = PathFinder.findNearestEmptyCell(pos.x, pos.y, this._proto.move_mode);
						if (pos !== null)
							this._move(pos.x, pos.y);
						else
							this.state = 'STAND';
					}
				}
				break;
				
			case 'ATTACKING':
				if (this.weapon.isTargetAlive())
				{
					this.anim_attack_frame++;
					if (this.anim_attack_frame == this._proto.images.attack.frames)
					{
						this.weapon.shoot();
						this.state = 'ATTACK';
					}
				}
				else
					this.state = 'STAND';
				break;
				
			default:
				this.runCustom();
		}
	};
	
	this._runStandartMoving = function()
	{
		if (this.move_path.length == 0)
		{
			this.onStopMoving();
			return;
		}
		var next_cell = this.move_path[0], x_movement = 0, y_movement = 0, next_x = next_cell.x * CELL_SIZE + 12, 
			next_y = next_cell.y * CELL_SIZE + 12, change;

		if (next_x != this.position.x)
		{
			x_movement = (next_x>this.position.x) ? 1 : -1;
			change = Math.min(this._proto.speed, Math.abs(next_x - this.position.x));
			this.position.x += x_movement * change;
		}
		if (next_y != this.position.y)
		{
			y_movement = (next_y>this.position.y) ? 1 : -1;
			change = Math.min(this._proto.speed, Math.abs(next_y - this.position.y));
			this.position.y += y_movement * change;
		}

		this.move_direction = this.direction_matrix[(x_movement+1)*4 + y_movement + 1];

		if (next_x==this.position.x && next_y==this.position.y)
		{
			this.move_path.shift();
			
			this.beforeMoveNextCell();

			if (this.move_path.length != 0)
				this._moveToNextCell();
		}
	};
	
	this._moveToNextCell = function()
	{
		var curr_pos = this.getCell();
		
		//Check if next cell is not empty or wrong ground type. If not empty then 
		if (!MapCell.canStepInto(this.move_path[0].x, this.move_path[0].y, this._proto.move_mode) || 
			(MapCell.getIdByType(this.move_path[0].x, this.move_path[0].y, (this._proto.move_mode == MOVE_MODE_FLY)) != -1))
		{
			//Stop
			if (this.move_path.length == 1)
			{
				this.move_path = [];
				return;
			}
			//recalculate route
			var last_point = this.move_path.pop();
			this.move_path = PathFinder.findPath(curr_pos.x, curr_pos.y, last_point.x, last_point.y, this._proto.move_mode, true);
		}

		//Move user to next cell + Remove from current
		if (this.move_path.length > 0)
		{
			if (this._proto.move_mode == MOVE_MODE_FLY)
			{
				game.level.map_cells[this.move_path[0].x][this.move_path[0].y].fly_unit = this.uid;
				game.level.map_cells[curr_pos.x][curr_pos.y].fly_unit = -1;
			}
			else
			{
				game.level.map_cells[this.move_path[0].x][this.move_path[0].y].ground_unit = this.uid;
				game.level.map_cells[curr_pos.x][curr_pos.y].ground_unit = -1;
			}
		}
	};
	
	this.draw = function(current_time) 
	{
		var diff, top_x = this.position.x - game.viewport_x, top_y = this.position.y - game.viewport_y,
			layer = (this._proto.move_mode == MOVE_MODE_FLY) ? DRAW_LAYER_FUNIT : DRAW_LAYER_GUNIT;
		
		//Draw unit
		switch (this.state)
		{
			case 'MOVE':
				diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % this._proto.images.move.frames);
				if (this._proto.images.shadow)
				{
					game.objDraw.addElement(DRAW_LAYER_SHADOWS, this.position.x, {
						res_key: this._proto.resource_key + '_move_shadow',
						src_x: (this._proto.images.shadow.move.static_img) ? 0 : this.move_direction * this._proto.images.shadow.move.size.x,
						src_y: (this._proto.images.shadow.move.static_img) ? 0 : diff * this._proto.images.shadow.move.size.y,
						src_width: this._proto.images.shadow.move.size.x,
						src_height: this._proto.images.shadow.move.size.y,
						x: top_x - this._proto.images.shadow.move.padding.x,
						y: top_y - this._proto.images.shadow.move.padding.y
					});
				}
				game.objDraw.addElement(layer, this.position.x, {
					res_key: this._proto.resource_key + '_move',
					src_x: this.move_direction * this._proto.images.move.size.x,
					src_y: diff * this._proto.images.move.size.y,
					src_width: this._proto.images.move.size.x,
					src_height: this._proto.images.move.size.y,
					x: top_x - this._proto.images.move.padding.x,
					y: top_y - this._proto.images.move.padding.y
				});
				break;
				
			case 'ATTACKING':
				diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % this._proto.images.attack.frames);
				if (this._proto.images.shadow)
				{
					game.objDraw.addElement(DRAW_LAYER_SHADOWS, this.position.x, {
						res_key: this._proto.resource_key + '_attack_shadow',
						src_x: (this._proto.images.shadow.attack.static_img) ? 0 : this.move_direction * this._proto.images.shadow.attack.size.x,
						src_y: (this._proto.images.shadow.attack.static_img) ? 0 : diff * this._proto.images.shadow.attack.size.y,
						src_width: this._proto.images.shadow.attack.size.x,
						src_height: this._proto.images.shadow.attack.size.y,
						x: top_x - this._proto.images.shadow.attack.padding.x,
						y: top_y - this._proto.images.shadow.attack.padding.y
					});
				}
				game.objDraw.addElement(layer, this.position.x, {
					res_key: this._proto.resource_key + '_attack',
					src_x: this.move_direction * this._proto.images.attack.size.x,
					src_y: diff * this._proto.images.attack.size.y,
					src_width: this._proto.images.attack.size.x,
					src_height: this._proto.images.attack.size.y,
					x: top_x - this._proto.images.attack.padding.x,
					y: top_y - this._proto.images.attack.padding.y
				});
				break;
				
			default:
				if (this._proto.images.shadow)
				{
					game.objDraw.addElement(DRAW_LAYER_SHADOWS, this.position.x, {
						res_key: this._proto.resource_key + '_stand_shadow',
						src_x: (this._proto.images.shadow.stand.static_img) ? 0 : this.move_direction * this._proto.images.shadow.stand.size.x,
						src_y: 0,
						src_width: this._proto.images.shadow.stand.size.x,
						src_height: this._proto.images.shadow.stand.size.y,
						x: top_x - this._proto.images.shadow.stand.padding.x,
						y: top_y - this._proto.images.shadow.stand.padding.y
					});
				}
				game.objDraw.addElement(layer, this.position.x, {
					res_key: this._proto.resource_key + '_stand',
					src_x: this.move_direction * this._proto.images.stand.size.x,
					src_y: 0,
					src_width: this._proto.images.stand.size.x,
					src_height: this._proto.images.stand.size.y,
					x: top_x - this._proto.images.stand.padding.x,
					y: top_y - this._proto.images.stand.padding.y
				});
				break;
		}
	};
	
	//Draw Selection
	this.drawSelection = function(is_onmouse)
	{
		this._drawStandardSelection(is_onmouse);
	};
	
	this._drawStandardSelection = function(is_onmouse)
	{
		var top_x = this.position.x - game.viewport_x + 0.5 - this._proto.images.selection.padding.x, 
			top_y = this.position.y - game.viewport_y - 2.5  - this._proto.images.selection.padding.y,
			sel_width = this._proto.images.selection.size.x, health_width = parseInt(sel_width*0.63);
			
		if (this.player == PLAYER_NEUTRAL)
			game.viewport_ctx.strokeStyle = '#ffff00';
		else if (this.player == PLAYER_HUMAN)
			game.viewport_ctx.strokeStyle = '#ffffff';
		else
			game.viewport_ctx.strokeStyle = '#fc0800'; //Change it later to support aliances
		
		game.viewport_ctx.lineWidth = 1;
		
		game.viewport_ctx.beginPath();
		game.viewport_ctx.moveTo(top_x, top_y + 8);
		game.viewport_ctx.lineTo(top_x, top_y);
		game.viewport_ctx.lineTo(top_x + sel_width, top_y);
		game.viewport_ctx.lineTo(top_x + sel_width, top_y + 8);
		game.viewport_ctx.moveTo(top_x + sel_width, top_y + sel_width - 3);
		game.viewport_ctx.lineTo(top_x + sel_width, top_y + sel_width + 5);
		game.viewport_ctx.lineTo(top_x, top_y + sel_width + 5);
		game.viewport_ctx.lineTo(top_x, top_y + sel_width - 3);
		game.viewport_ctx.stroke();
		
		//Health
		var health_top_x = top_x + parseInt((sel_width - health_width)/2) - 0.5;
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(health_top_x, top_y-1.5, health_width, 4);

		if (this.health < this._proto.health_max)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(health_top_x + 1, top_y-0.5, health_width - 2, 2);
		}

		var health_proc = this.health / this._proto.health_max;
		if (health_proc > 0.66)
			game.viewport_ctx.fillStyle = '#51FA00';
		else if (health_proc > 0.33)
			game.viewport_ctx.fillStyle = '#FCFC00';
		else
			game.viewport_ctx.fillStyle = '#FC0000';
		game.viewport_ctx.fillRect(health_top_x + 1, top_y-0.5, (health_width - 2)*health_proc, 2);
		
		//Draw name
		if (is_onmouse)
			game.fontDraw.drawOnCanvas(this._proto.obj_name, game.viewport_ctx, top_x, top_y - 16, 'yellow', 'center', sel_width);
	};
	
	this.canBeSelected = function()
	{
		return (this.player == PLAYER_HUMAN);
	};
	
	this.select = function(is_select, play_sound)
	{
		this.is_selected = is_select;
		if (this.is_selected)
		{
			if (play_sound)
				this._playSound(this._proto.select_sounds);
		}
	};
	
	this._playSound = function(snd_array)
	{
		var cnt = snd_array.length, i = Math.floor(Math.random()*cnt);
		game.resources.play('sound_' + snd_array[i]);
	};
	
	this.markCellsOnMap = function(unitid)
	{
		var cell = this.getCell();
		
		if (unitid == -1)
		{
			if (this._proto.move_mode == MOVE_MODE_FLY)
			{
				if (game.level.map_cells[cell.x][cell.y].fly_unit == this.uid)
					game.level.map_cells[cell.x][cell.y].fly_unit = -1;
			}
			else
			{
				if (game.level.map_cells[cell.x][cell.y].ground_unit == this.uid)
					game.level.map_cells[cell.x][cell.y].ground_unit = -1;
			}
		}
		else
		{
			if (this._proto.move_mode == MOVE_MODE_FLY)
				game.level.map_cells[cell.x][cell.y].fly_unit = unitid;
			else
				game.level.map_cells[cell.x][cell.y].ground_unit = unitid;
		}
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
	
	this.canHarvest = function()
	{
		return false;
	};
	
	this.isHuman = function()
	{
		return this._proto.is_human;
	};
	
	this.isHealer = function()
	{
		return false;
	};
	
	this.isFixer = function()
	{
		return false;
	};
	
	this.isTeleport = function()
	{
		return false;
	};
	
	//Events
	
	this.beforeMoveNextCell = function()
	{
		if (this.weapon !== null)
			this.weapon.updatePosition();
		
		switch (this.action.type)
		{
			case 'attack':
				if (!this.weapon.isTargetAlive() || this.weapon.canReach())
					this.move_path = [];
				break;
			default:
				this.beforeMoveNextCellCustom();
		}
	};
	
	this.onStopMoving = function()
	{
		switch (this.action.type)
		{
			case '':
				this.state = 'STAND';
				break;
				
			case 'attack':
				this.state = 'ATTACK';
				break;
				
			case 'go_heal':
				var cell = this.getCell();
				if (cell.x==this.action.target_position.x && cell.y==this.action.target_position.y)
				{
					this.state = 'HEALING';
					ActionsHeap.add(this.uid, 'heal', 0);
				}
				else
					this.orderWait(1000);
				break;
				
			case 'go_teleport':
				if (!AbstractBuilding.isExists(this.action.target_id))
				{
					this.orderStop();
					return;
				}
				
				var cell = this.getCell();
				if (cell.x==this.action.target_position.x && cell.y==this.action.target_position.y)
				{
					game.objects[this.action.target_id].input(this);
					this.orderStop();
				}
				else
				{
					if (!game.objects[this.action.target_id].haveFreeSpace())
						this.orderStop();
					else
						this.orderWait(1000);
				}
				break;
				
			default:
				this.onStopMovingCustom();
		}
	};
	
	this.onObjectDeletion = function() 
	{
		this.markCellsOnMap(-1);
	};
	
	this.afterWaiting = function()
	{
		switch (this.action.type)
		{
			case 'go_heal':
				if (AbstractBuilding.isExists(this.action.target_id))
					this._move(this.action.target_position.x, this.action.target_position.y, false);
				else
					this.orderStop();
				break;
				
			case 'go_teleport':
				if (!AbstractBuilding.isExists(this.action.target_id) || !game.objects[this.action.target_id].haveFreeSpace())
					this.orderStop();
				else
					this._move(this.action.target_position.x, this.action.target_position.y, false);
				break;
				
			default:
				this.afterWaitingCustom();
				break;
		}
	};
	
	this.onHealed = function()
	{
		var sound_key = (this.isHuman()) ? 'healing' : 'fixed';
		game.resources.playOnPosition(sound_key, false, this.position, true);
		var pos = PathFinder.findNearestEmptyCell(this.action.target_position.x + 5, this.action.target_position.y, this._proto.move_mode);
		this.orderMove(pos.x, pos.y);
	};
	
	//Abstract functions
	this.onStopMovingCustom = function(){};
	this.beforeMoveNextCellCustom = function(){};
	this.runCustom = function(){};
	this.afterWaitingCustom = function(){};
}

AbstractUnit.createNew = function(obj, x, y, player, instant_build)
{
	var uid = game.objects.length;
	game.objects.push(new obj(x, y, player));
	game.objects[uid].uid = uid;
	game.objects[uid].markCellsOnMap(uid);
	
	if (!instant_build)
		game.notifications.addSound('unit_completed');
	
	return game.objects[uid];
};

AbstractUnit.loadResources = function(obj) 
{
	var i;
	
	game.resources.addImage(obj.resource_key + '_stand', 'images/units/' + obj.resource_key + '/stand.png');
	game.resources.addImage(obj.resource_key + '_move',  'images/units/' + obj.resource_key + '/move.png');
	game.resources.addImage(obj.resource_key + '_box',  'images/units/' + obj.resource_key + '/box.png');
	
	if (obj.images.shadow)
	{
		game.resources.addImage(obj.resource_key + '_stand_shadow', 'images/units/' + obj.resource_key + '/stand_shadow.png');
		game.resources.addImage(obj.resource_key + '_move_shadow', 'images/units/' + obj.resource_key + '/move_shadow.png');
	}
	
	for (i in obj.select_sounds)
		game.resources.addSound('sound_' + obj.select_sounds[i],   'sounds/units/' + obj.select_sounds[i] + '.' + AUDIO_TYPE);
	for (i in obj.response_sounds)
		game.resources.addSound('sound_' + obj.response_sounds[i],   'sounds/units/' + obj.response_sounds[i] + '.' + AUDIO_TYPE);
	
	if (obj.weapon != '')
	{
		game.resources.addImage(obj.resource_key + '_attack',  'images/units/' + obj.resource_key + '/attack.png');
		if (obj.images.shadow)
			game.resources.addImage(obj.resource_key + '_attack_shadow', 'images/units/' + obj.resource_key + '/attack_shadow.png');
	}
};

AbstractUnit.setUnitCommonOptions = function(obj)
{
	obj.prototype = new AbstractUnit();

	obj.obj_name = '';      //Must redeclare
	obj.resource_key = '';  //Must redeclare
	obj.images = {};        //Must redeclare
	obj.select_sounds = [];
	obj.response_sounds = [];
	obj.die_effect = 'splatd_animation';

	obj.cost = 0;
	obj.health_max = 100;
	obj.speed = 0.87;      // 0.87 = 6 config speed [SetPhysics(mass speed)]
	obj.weapon = '';
	obj.enabled = false;
	obj.is_human = false;
	obj.shield_type = 'ToughHumanWet';
	obj.move_mode = MOVE_MODE_GROUND;

	obj.require_building = [];

	obj.construction_building = [];
	obj.construction_time = 0; //construction_time/1.5 [SetCost(cost construction_time)]
	
	obj.producing_progress = 0;
	obj.producing_paused = false;
	obj.producing_count = 0;
	obj.producing_building_id = 0;

	obj.loadResources = function() 
	{
		AbstractUnit.loadResources(this);
	};
};