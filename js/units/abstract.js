var MOVE_MODE_GROUND = 0;
var MOVE_MODE_HOVER = 1;
var MOVE_MODE_FLY = 2;

var UNIT_SCAN_INTERVAL = 1000;

var UNIT_STATE_STAND = 0;
var UNIT_STATE_MOVE = 1;
var UNIT_STATE_ATTACKING = 2;
var UNIT_STATE_ATTACK = 3;
var UNIT_STATE_HEALING = 4;
var UNIT_STATE_WAITING = 5;
var UNIT_STATE_LOADING = 6; //Freighter
var UNIT_STATE_REARMING = 7; //Cyclone

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
	this.position_cell = null;
	this.weapon = null;
	this.tactic_group = -1;
	this.tactic = null;
	
	//For carry units
	this._carry_units = [];
	this._carry_spaces = 0;
	
	this.move_path = [];
	
	this.startAnimation = 0; 
	this.anim_attack_frame = 0;
	this.damage_animator = null;
	
	this.action = {type: ''};
	this.state = UNIT_STATE_STAND;
	this.parts = [];
	this._is_have_weapon = false;
	
	this._object_color = '';
	
	this._last_scan_time = 0;
	
	this.init = function(pos_x, pos_y)
	{
		this.setCell({x: pos_x, y: pos_y});
		
		this.health = this._proto.health_max;
		this.parts = [];
		
		if (game)
		{
			this.tactic = cloneObj(game.players[this.player].default_tactic);
			
			if (player != PLAYER_NEUTRAL)
				this._object_color = game.players[this.player].getUnitColor();
		}
		
		for (var i=0; i<this._proto.parts.length; ++i)
		{
			this.parts[i] = {weapon: null, direction: 0};
			
			if (this._proto.parts[i].weapon)
			{
				this.parts[i].weapon = new WeaponHolder(this._proto.parts[i].weapon);
				this.parts[i].weapon.init(this, i);
				this._is_have_weapon = true;
			}
		}
	};
	
	this.getCell = function()
	{
		return cloneObj(this.position_cell);
	};
	
	this.setCell = function(pos)
	{
		this.position_cell = cloneObj(pos);
		this.position = MapCell.cellToPixel(this.position_cell);
		
		if (this._is_have_weapon)
		{
			for (var i = 0; i < this._proto.parts.length; ++i)
				if (this.parts[i].weapon)
					this.parts[i].weapon.updatePosition();
		}
	};
	
	this.applyHeal = function(heal)
	{
		var aplly = Math.min(this._proto.health_max-this.health, heal),
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
			return; //Already killed
		
		var new_health = this.health - damage, animation_index = this._findDamageAnimation(new_health, this.health);
		
		this.health = new_health;
		if (animation_index !== -1)
			this._animateDamage(animation_index);
		
		if (this.health <= 0)
		{
			this.health = 0;
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
	
	this._animateDamage = function(state)
	{
		if (this.damage_animator !== null)
			this.damage_animator.stop();
		
		this.damage_animator = new Animator();
		this.damage_animator.animate(this.uid, this._proto.health_explosions[state]);
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
		
		if (this.state == UNIT_STATE_MOVE)
			this.move_path = this.move_path.slice(0, 1);
		else
			this.state = UNIT_STATE_STAND;
	};
	
	this.orderAttack = function(target)
	{
		var set_target = this.isCanAttackTarget(target, function(weapon){
			weapon.setTarget(target);
		});
		
		if (!set_target)
			return;
		
		if (this.state == UNIT_STATE_MOVE)
			this.orderStop();
		else
			this.state = UNIT_STATE_ATTACK;
		
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
	
	this.orderToCarry = function(carrier, play_sound)
	{
		if (play_sound)
			this._playSound(this._proto.response_sounds);
		
		if (this._proto.move_mode == MOVE_MODE_FLY)
			return;
		if (carrier._proto.carry.max_mass < this._proto.mass)
			return;
		
		var pos = carrier.getCell();
		pos.y += 1;
		if (carrier.is_building)
			pos.x += 1;
		
		this.action = {
			type: 'go_carry',
			target_position: pos,
			target_id: carrier.uid
		};
		this._move(pos.x, pos.y, false);
	};
	
	this.orderWait = function(time)
	{
		this.state = UNIT_STATE_WAITING;
		this.action.wait_till = (new Date).getTime() + time;
	};
	
	this.isCanAttackTarget = function(target, callback)
	{
		if (!this._is_have_weapon)
			return false;
		
		var ret = false;
		for (var i in this.parts)
		{
			if (this.parts[i].weapon && this.parts[i].weapon.canAttackTarget(target))
			{
				if (callback)
					callback(this.parts[i].weapon);
				
				ret = true;
			}
		}
		
		return ret;
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
		this.state = UNIT_STATE_MOVE;
		
		if (need_move && this.move_path.length>0)
			this._moveToNextCell();
	};
	
	this.run = function() 
	{
		switch (this.state)
		{
			case UNIT_STATE_MOVE:
				this._runStandartMoving();
				break;
				
			case UNIT_STATE_WAITING:
				if ((new Date).getTime() > this.action.wait_till)
					this.afterWaiting();
				break;
			
			case UNIT_STATE_HEALING:
			case UNIT_STATE_STAND:
				break;
				
			case UNIT_STATE_ATTACK:
				for (var i in this.parts)
				{
					if (!this.parts[i].weapon)
						continue;
					
					if (this.parts[i].weapon.canShoot() && this.parts[i].weapon.isTargetAlive())
					{
						if (this.parts[i].weapon.canReach(true))
						{
							this.state = UNIT_STATE_ATTACKING;
							this.anim_attack_frame = 0;
							this.startAnimation = 0;
						}
					}
				}
				break;
				
			case UNIT_STATE_ATTACKING:
				for (var i in this.parts)
				{
					if (!this.parts[i].weapon)
						continue;
					
					if (this.parts[i].weapon.isTargetAlive())
					{
						this.anim_attack_frame++;
						if (!this._proto.parts[i].attack || (this.anim_attack_frame == this._proto.parts[i].attack.frames))
						{
							this.parts[i].weapon.shoot();
							this.state = UNIT_STATE_ATTACK;
						}
					}
					else
						this.state = UNIT_STATE_STAND;
				}
				break;
				
			default:
				this.runCustom();
		}
		
		var time = (new Date()).getTime();
		if  ((time - this._last_scan_time) > UNIT_SCAN_INTERVAL)
		{
			this._last_scan_time = time;
			TacticalAI.regularScan(this);
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

		this.setDirection(Math.getAngle(y_movement, x_movement));

		if (next_x==this.position.x && next_y==this.position.y)
		{
			this.move_path.shift();
			
			this.beforeMoveNextCell();

			if (this.move_path.length != 0)
				this._moveToNextCell();
		}
	};
	
	this.setDirection = function(angle)
	{
		for (var i in this.parts)
			this.parts[i].direction = Math.calcFrameByAngle(angle, this._proto.parts[i].rotations);
		
		if (this.damage_animator != null)
			this.damage_animator.updatePosition();
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
			
			this.changeFogState(-1);
			this.position_cell = {x: this.move_path[0].x, y: this.move_path[0].y};
			this.changeFogState(1);
		}
	};
	
	this.changeFogState = function(state)
	{
		if (this.player != PLAYER_HUMAN)
			return;
		
		rangeItterator(this.position_cell.x, this.position_cell.y, this._proto.seeing_range, function(x, y){
			game.level.map_cells[x][y].fog_new_state += state;
		});
		
		InterfaceFogOfWar.need_redraw = true;
	};
	
	this._drawPartImage = function(layer, key_prefix, part, frame, x, y)
	{
		game.objDraw.addElement(layer, this.position.y, {
			res_key: this._proto.resource_key + key_prefix + part + this._object_color,
			src_x: this.parts[part].direction * this._proto.parts[part].image_size.x,
			src_y: frame * this._proto.parts[part].image_size.y,
			src_width: this._proto.parts[part].image_size.x,
			src_height: this._proto.parts[part].image_size.y,
			x: x,
			y: y
		});
	};
	
	this._drawShadow = function(key_prefix, item, frame, top_x, top_y)
	{
		game.objDraw.addElement(DRAW_LAYER_SHADOWS, this.position.y, {
			res_key: this._proto.resource_key + key_prefix,
			src_x: (item.static_img) ? 0 : this.parts[0].direction * item.size.x,
			src_y: (item.static_img) ? 0 : frame * item.size.y,
			src_width: item.size.x,
			src_height: item.size.y,
			x: top_x - item.padding.x,
			y: top_y - item.padding.y
		});
	};
	
	this.draw = function(current_time) 
	{
		var i, state, diff, top_x = this.position.x - game.viewport_x, top_y = this.position.y - game.viewport_y,
			layer = (this._proto.move_mode == MOVE_MODE_FLY) ? DRAW_LAYER_FUNIT : DRAW_LAYER_GUNIT, x, y;
		
		//Draw parts
		for (i in this.parts)
		{
			state = this.state;
			if ((state == UNIT_STATE_MOVE) && !this._proto.parts[i].move)
				state = UNIT_STATE_STAND;
			if ((state == UNIT_STATE_ATTACKING) && !this._proto.parts[i].attack)
				state = UNIT_STATE_STAND;
			if ((state == UNIT_STATE_LOADING) && !this._proto.parts[i].load)
				state = UNIT_STATE_STAND;
			
			x = top_x - this._proto.parts[i].hotspots[this.parts[i].direction][0].x;
			y = top_y - this._proto.parts[i].hotspots[this.parts[i].direction][0].y;
			
			if (i != 0)
			{
				x += this._proto.parts[0].hotspots[this.parts[0].direction][1].x;
				y += this._proto.parts[0].hotspots[this.parts[0].direction][1].y;
			}
		
			switch (state)
			{
				case UNIT_STATE_MOVE:
					diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % this._proto.parts[i].move.frames);
					this._drawPartImage(layer, 'move', i, diff, x, y);
					break;
					
				case UNIT_STATE_ATTACKING:
					diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % this._proto.parts[i].attack.frames);
					this._drawPartImage(layer, 'attack', i, diff, x, y);
					break;
					
				case UNIT_STATE_LOADING:
					diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % this._proto.parts[i].load.frames);
					this._drawPartImage(layer, 'load', i, diff, x, y);
					break;
					
				default:
					diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % this._proto.parts[i].stand.frames);
					this._drawPartImage(layer, 'stand', i, diff, x, y);
					break;
			}
		}
		
		if (this._proto.shadow)
		{
			state = this.state;
			if ((state == UNIT_STATE_MOVE) && !this._proto.shadow.move)
				state = UNIT_STATE_STAND;
			if ((state == UNIT_STATE_ATTACKING) && !this._proto.shadow.attack)
				state = UNIT_STATE_STAND;
			if ((state == UNIT_STATE_LOADING) && !this._proto.shadow.load)
				state = UNIT_STATE_STAND;
			
			switch (state)
			{
				case UNIT_STATE_MOVE:
					diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % this._proto.parts[0].move.frames);
					if (this._proto.shadow.move.static_img)
						diff = 0;
					this._drawShadow('move_shadow', this._proto.shadow.move, diff, top_x, top_y);
					break;
					
				case UNIT_STATE_ATTACKING:
					diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % this._proto.parts[0].attack.frames);
					if (this._proto.shadow.attack.static_img)
						diff = 0;
					this._drawShadow('attack_shadow', this._proto.shadow.attack, diff, top_x, top_y);
					break;
					
				default:
					diff = (parseInt((current_time - this.startAnimation) / ANIMATION_SPEED) % this._proto.parts[0].stand.frames);
					if (this._proto.shadow.stand.static_img)
						diff = 0;
					this._drawShadow('stand_shadow', this._proto.shadow.stand, diff, top_x, top_y);
					break;
			}
		}
	};
	
	//Draw Selection
	this.drawSelection = function(is_onmouse)
	{
		this._drawStandardSelection(is_onmouse);
	};
	
	this._drawStandardSelection = function(is_onmouse)
	{
		var top_x = this.position.x - game.viewport_x + 0.5 - this._proto.parts[0].hotspots[this.parts[0].direction][0].x, 
			top_y = this.position.y - game.viewport_y - 2.5  - this._proto.parts[0].hotspots[this.parts[0].direction][0].y,
			sel_width = this._proto.parts[0].image_size.x, health_width = parseInt(sel_width*0.63);
			
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
		game.viewport_ctx.moveTo(top_x + sel_width, top_y + sel_width - 2);
		game.viewport_ctx.lineTo(top_x + sel_width, top_y + sel_width + 6);
		game.viewport_ctx.lineTo(top_x, top_y + sel_width + 6);
		game.viewport_ctx.lineTo(top_x, top_y + sel_width - 2);
		game.viewport_ctx.stroke();
		
		//Health
		var health_top_x = top_x + parseInt((sel_width - health_width)/2) + 0.5;
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
		
		if (this.tactic_group != -1)
			game.fontDraw.drawOnCanvas(this.tactic_group.toString(), game.viewport_ctx, top_x + sel_width + 3, top_y  + sel_width - 7, 'yellow');
		
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
		if (!this._is_have_weapon)
			return false;
		
		for (var i in this.parts)
			if (this.parts[i].weapon && this.parts[i].weapon.canAttackGround())
				return true;
		
		return false;
	};
	
	this.canAttackFly = function()
	{
		if (!this._is_have_weapon)
			return false;
		
		for (var i in this.parts)
			if (this.parts[i].weapon && this.parts[i].weapon.canAttackFly())
				return true;
		
		return false;
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
	
	//Units with ability to carry 
	
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
		return (this._carry_spaces>0 && this._proto.carry.max_mass>=min_mass);
	};
	
	this.extractCarry = function()
	{
		if (!this.haveInsideUnits())
			return;
		
		var i, pos, unit, mypos = this.getCell();
		for (i in this._carry_units)
		{
			unit = game.objects[this._carry_units[i]];
			pos = PathFinder.findNearestStandCell(mypos.x, mypos.y);
			unit.setCell(pos);
			game.level.map_cells[pos.x][pos.y].ground_unit = unit.uid;
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
		
		var pos = unit.getCell(), mypos = this.getCell();
		if (pos.x==mypos.x && (pos.y-1)==mypos.y)
		{
			var pos = unit.getCell();
			game.unselectUnit(unit.uid);
			unit.changeFogState(-1);
			game.level.map_cells[pos.x][pos.y].ground_unit = -1;
			unit.position = {x: -100, y: -100};
			this._carry_units.push(unit.uid);
			this._carry_spaces--;
		}
		else
			unit.orderToCarry(this);
	};
	
	//Events
	
	this.beforeMoveNextCell = function()
	{
		if (this._is_have_weapon)
		{
			for (var i in this.parts)
				if (this.parts[i].weapon)
					this.parts[i].weapon.updatePosition();
		}
		
		switch (this.action.type)
		{
			case 'attack':
				for (var i in this.parts)
					if (this.parts[i].weapon)
					{
						if (!this.parts[i].weapon.isTargetAlive() || this.parts[i].weapon.canReach(false))
							this.move_path = [];
					}
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
				this.state = UNIT_STATE_STAND;
				break;
				
			case 'attack':
				this.state = UNIT_STATE_ATTACK;
				break;
				
			case 'go_heal':
				var cell = this.getCell();
				if (cell.x==this.action.target_position.x && cell.y==this.action.target_position.y)
				{
					this.state = UNIT_STATE_HEALING;
					ActionsHeap.add(this.uid, 'heal', 0);
				}
				else
					this.orderWait(1000);
				break;
				
			case 'go_carry':
				if (game.objects[this.action.target_id] === undefined)
				{
					this.orderStop();
					return;
				}
				
				var cell = this.getCell();
				if (cell.x==this.action.target_position.x && cell.y==this.action.target_position.y)
				{
					game.objects[this.action.target_id].inputCarry(this);
				}
				else
				{
					if (!game.objects[this.action.target_id].haveFreeSpace(this._proto.mass))
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
		this.changeFogState(-1);
		this.markCellsOnMap(-1);
		this.onObjectDeletionCustom();
	};
	
	this.afterWaiting = function()
	{
		switch (this.action.type)
		{
			case 'attack':
				this.state = UNIT_STATE_ATTACK;
				break;
				
			case 'go_heal':
				if (AbstractBuilding.isExists(this.action.target_id))
					this._move(this.action.target_position.x, this.action.target_position.y, false);
				else
					this.orderStop();
				break;
				
			case 'go_carry':
				if (game.objects[this.action.target_id] === undefined || !game.objects[this.action.target_id].haveFreeSpace(this._proto.mass))
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
	
	this.triggerEvent = function(event, params)
	{
		switch (event)
		{
			case 'standing_too_close':
			case 'standing_too_far':
				TacticalAI.handleUnitEvent(this, event, {
					target: this.action.target,
					part: params
				});
				break;
				
			default:
				TacticalAI.handleUnitEvent(this, event, params);
				break;
		}
	};
	
	//Abstract functions
	this.onStopMovingCustom = function(){};
	this.beforeMoveNextCellCustom = function(){};
	this.runCustom = function(){};
	this.afterWaitingCustom = function(){};
	this.onObjectDeletionCustom = function(){};
}

AbstractUnit.createNew = function(obj, x, y, player, instant_build)
{
	var uid = game.objects.length;
	game.objects.push(new obj(x, y, player));
	game.objects[uid].uid = uid;
	game.objects[uid].markCellsOnMap(uid);
	game.objects[uid].changeFogState(1);
	
	if (!instant_build)
		InterfaceSoundQueue.addSound('unit_completed');
	
	return game.objects[uid];
};

AbstractUnit.loadResources = function(obj) 
{
	var i, j, key, types = ['stand', 'move', 'attack', 'load'];
	
	game.resources.addImage(obj.resource_key + '_box',  'images/units/' + obj.resource_key + '/box.png');
	
	for (i in obj.parts)
	{
		for (j in types)
		{
			key = types[j];
			if (obj.parts[i][key])
			{
				game.resources.addImage(obj.resource_key + key + i, 'images/units/' + obj.resource_key + '/' + i + key + '.png', true);
				if (obj.shadow && obj.shadow[key])
					game.resources.addImage(obj.resource_key + key + '_shadow', 'images/units/' + obj.resource_key + '/' + key + '_shadow.png');
			}
		}
	}
	
	for (i in obj.select_sounds)
		game.resources.addSound('sound_' + obj.select_sounds[i],   'sounds/units/' + obj.select_sounds[i] + '.' + AUDIO_TYPE);
	for (i in obj.response_sounds)
		game.resources.addSound('sound_' + obj.response_sounds[i],   'sounds/units/' + obj.response_sounds[i] + '.' + AUDIO_TYPE);
};

AbstractUnit.setUnitCommonOptions = function(obj)
{
	obj.prototype = new AbstractUnit();

	obj.obj_name = '';      //Must redeclare
	obj.resource_key = '';  //Must redeclare
	obj.parts = [];        //Must redeclare
	obj.shadow = null;
	obj.select_sounds = [];
	obj.response_sounds = [];

	obj.cost = 0;
	obj.health_max = 100;
	obj.speed = 0.91;      // (0.1365*speed)/0.9 [SetPhysics(mass speed)] {0.9 - should be dynamic game speed coeficient}
	obj.enabled = Array.factory(PLAYERS_COUNT, false);
	obj.is_human = false;
	obj.shield_type = 'ToughHumanWet';
	obj.move_mode = MOVE_MODE_GROUND;
	obj.mass = 1;
	obj.seeing_range = 9;
	
	obj.carry = null;

	obj.require_building = [];

	obj.construction_building = [];
	obj.construction_time = 0; //construction_time/1.5 [SetCost(cost construction_time)]
	
	obj.producing_progress = 0;
	obj.producing_paused = false;
	obj.producing_count = 0;
	obj.producing_building_id = 0;
	
	obj.health_explosions = {
		0: 'splatd_explosion'
	};

	obj.loadResources = function() 
	{
		AbstractUnit.loadResources(this);
	};
};