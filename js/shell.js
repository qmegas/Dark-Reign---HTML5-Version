function Game()
{
	this.level = {};
	
	this.viewport_x = 0;
	this.viewport_y = 0;
	this.viewport_move_x = 0;
	this.viewport_move_y = 0;
	this.viewport_ctx = {};
	
	this.minimap_ctx = {};
	this.minimap_navigation = false;
	
	this.resources = new ResourseLoader();
	
	this.objects = [];
	this.kill_objects = [];
	this.selected_objects = [];
	this.selected_info = {};
	this.constructor = {};
	
	this.mouse = new MousePointer(this);
	this.fontDraw = new DKFont();
	
	this.action_state = 0;
	this.action_state_options = {};
	
	//Player cars
	this.money = new MoneyDraw();
	this.energy = new EnergyDraw();
	
	this.moveViewport = function(x, y, relative)
	{
		if (relative)
		{
			this.viewport_x += x*CELL_SIZE;
			this.viewport_y += y*CELL_SIZE;
		}
		else
		{
			this.viewport_x = x*CELL_SIZE;
			this.viewport_y = y*CELL_SIZE;
		}
		
		if (this.viewport_x < 0)
			this.viewport_x = 0;
		if (this.viewport_y < 0)
			this.viewport_y = 0;
		if (this.viewport_x > this.level.max_movement.x)
			this.viewport_x = this.level.max_movement.x;
		if (this.viewport_y > this.level.max_movement.y)
			this.viewport_y = this.level.max_movement.y;
		
		$('#map_view').css({
			left: -this.viewport_x,
			top: -this.viewport_y
		}, 'fast');
		
		this.minimap_ctx.drawImage(this.resources.get('minimap'), 0, 0);
		this.minimap_ctx.strokeStyle = '#ffffff';
		this.minimap_ctx.lineWidth = 1;
		
		this.minimap_ctx.strokeRect(
			parseInt(this.viewport_x/(this.level.size.x/this.level.minimap.x*CELL_SIZE)) + 0.5,  
			parseInt(this.viewport_y/(this.level.size.y/this.level.minimap.y*CELL_SIZE)) + 0.5, 
			this.level.minimap.rect_x, 
			this.level.minimap.rect_y
		);
	}

	this.init = function(level, init_finish_callback)
	{
		if (!this._checkBrowserSupport())
		{
			$('.load-screen').css('background-image', 'url("images/shell/not_supported.png")');
			return;
		}
		
		this.minimap_ctx = $('#minimap').get(0).getContext('2d');
		this.viewport_ctx = $('#viewport').get(0).getContext('2d');
		
		this.level = level;
		this.level.max_movement.x = CELL_SIZE*this.level.size.x-448;
		this.level.max_movement.y = CELL_SIZE*this.level.size.y-448;
		
		$('#viewport').css('top', '-' + (CELL_SIZE*this.level.size.y+5) + 'px');
		
		$('#minimap')
			.attr('width', this.level.minimap.x)
			.attr('height', this.level.minimap.y);
			
		//Init map matrix
		for (var x=0; x<level.size.x; ++x)
			for (var y=0; y<level.size.y; ++y)
				this.level.map_cells[x][y] = {type: this.level.map_cells[x][y], unit: -1};
		
		//Init units
		this.objects = this.level.getInitUnits();
		for (var i in this.objects)
		{
			//Just for test
			if (i==0)
				this.objects[i].health = 30;
			
			this.objects[i].uid = i;
			var pos = this.objects[i].getCell();
			this.level.map_cells[pos.x][pos.y].unit = i;
		}
		
		this.constructor = new ConstructManager(this.level.getAvailableUnits(), this.level.getAvailableBuildings());
		
		//Preloading images
		//-- CSS --
		this.resources.addImage('css1', 'images/shell/load-screen.png');
		this.resources.addImage('css2', 'images/shell/load-bar.png');
		this.resources.addImage('css3', 'images/shell/money.png');
		this.resources.addImage('css4', 'images/shell/topbuttons.png');
		this.resources.addImage('css5', 'images/shell/money_numbers.png');
		this.resources.addImage('css6', 'images/shell/menutabs.png');
		this.resources.addImage('css7', 'images/shell/panel.png');
		this.resources.addImage('css8', 'images/shell/unit_box.png');
		this.resources.addImage('css9', 'images/shell/b_buttons.png');
		this.resources.addImage('css10', 'images/shell/minimap.png');
		this.resources.addImage('css11', 'images/shell/switches.png');
		this.resources.addImage('css12', 'images/shell/metrics.png');
		this.resources.addImage('css13', 'images/shell/buttons.png');
		//---------
		this.resources.addImage('map-tiles', 'images/levels/'+this.level.tiles);
		this.resources.addImage('minimap', 'images/levels/'+this.level.minimap.image);
		this.resources.addImage('clr', 'images/buildings/clr.png');
		this.resources.addImage('font', 'images/font.png');
		this._loadGameResources();
		this.resources.onLoaded = function(loaded, total){
			var progress = parseInt(500/total*loaded);
			$('#progress-bar').css({width: progress+'px'});
		};
		this.resources.onComplete = function(){
			game.moveViewport(0, 0, false);
			game.money.setMoney(15000);
			game.constructor.drawUnits();
			game.level.generateMap();
			game._resetSelectionInfo();
			game.energy.addToMax(0);
			
			$('.load-screen').hide();
			$('.game').show();
			
			init_finish_callback();
		};
	}
	
	this.run = function()
	{
		var i, cell;
		
		//Kill objects
		for (i = 0; i<this.kill_objects.length; ++i)
		{
			var unit = this.objects[this.kill_objects[i]];
			if (unit.is_building)
				unit.markCellsOnMap(-1);
			else
			{
				cell = unit.getCell();
				if (this.level.map_cells[cell.x][cell.y].unit == unit.uid)
					this.level.map_cells[cell.x][cell.y].unit = -1; //Create markCellsOnMap function for user?
			}
			
			//Remove user from selected array
			var sindex = this.selected_objects.indexOf(unit.uid);
			if (sindex != -1)
				this.selected_objects.splice(sindex, 1);
			
			//Delete object
			delete this.objects[this.kill_objects[i]];
		}
		this.kill_objects = [];
		
		//Proceed objects
		for (i in this.objects)
			this.objects[i].run();
		
		//Move viewport
		if (this.viewport_move_x!=0 || this.viewport_move_y!=0)
			this.moveViewport(this.viewport_move_x, this.viewport_move_y, true);
		
		//Money draw
		this.money.draw();
	}
	
	this.draw = function()
	{
		var cur_time = new Date().getTime(), onscreen = [], unitid;
		var top_x = parseInt(this.viewport_x / CELL_SIZE) - 1, top_y = parseInt(this.viewport_y / CELL_SIZE) - 1;
		
		this.viewport_ctx.clearRect(0, 0, VIEWPORT_SIZE, VIEWPORT_SIZE);
		
		//Detect onscreen units
		for (var x=0; x<21; ++x)
			for (var y=0; y<21; ++y)
			{
				if (this.level.map_cells[top_x+x] && this.level.map_cells[top_x+x][top_y+y])
				{
					unitid = this.level.map_cells[top_x+x][top_y+y].unit;
					if (unitid != -1)
						onscreen[unitid] = 1; //Preventing duplicate entries (for example building can be placed in few cells)
				}
			}
			
		//Round 1: Draw units
		for (unitid in onscreen)
			this.objects[unitid].draw(cur_time);
		
		//Round 2: Draw selections
		for (unitid in onscreen)
			if (this.objects[unitid].is_selected)
				this.objects[unitid].drawSelection();
		
		//On mouse selection
		var mouse_pos = this.mouse.getCellPosition();
		unitid = this.level.map_cells[mouse_pos.x][mouse_pos.y].unit;
		if (unitid!=-1) // && !this.objects[unitid].is_selected)
			this.objects[unitid].drawSelection(true);
		
//		//DEBUG: Unit placement
//		this.viewport_ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
//		var start_x = parseInt(this.viewport_x/24), start_y = parseInt(this.viewport_y/24);
//		for (var x=0; x<20; ++x)
//			for (var y=0; y<20; ++y)
//				if (this.level.map_cells[start_x+x][start_y+y].unit != -1)
//					this.viewport_ctx.fillRect((start_x+x)*24-this.viewport_x, (start_y+y)*24-this.viewport_y, 24, 24);

		//DEBUG: Cells grid
//		this.viewport_ctx.strokeStyle = '#ffffff';
//		this.viewport_ctx.beginPath();
//		var start = 24 - (this.viewport_x - parseInt(this.viewport_x/24)*24) + 0.5; // - 11.5;
//		for (var i=0; i<20; ++i)
//		{
//			this.viewport_ctx.moveTo(start + i*24, 0);
//			this.viewport_ctx.lineTo(start + i*24, 448);
//		}
//		start = 24 - (this.viewport_y - parseInt(this.viewport_y/24)*24) + 0.5; // - 11.5;
//		for (var i=0; i<20; ++i)
//		{
//			this.viewport_ctx.moveTo(0, start + i*24);
//			this.viewport_ctx.lineTo(448, start + i*24);
//		}
//		this.viewport_ctx.stroke();

		//Mouse
		this.mouse.draw(cur_time);
		
		//Energy
		this.energy.draw(cur_time, false);
		
		window.requestAnimFrame(function(){
			game.draw();
		});
	}
	
	this.minimapNavigation = function(start)
	{
		this.minimap_navigation = start;
	}
	
	this.minimapMove = function(x, y)
	{
		if (!this.minimap_navigation)
			return;
		
		var realx = (x-this.level.minimap.rect_x/2),
			realy = (y-this.level.minimap.rect_y/2);
			
		this.moveViewport(realx, realy, false);
	}
	
	this.onClick = function(button)
	{
		var pos = this.mouse.getCellPosition();
		
		if (button == 'left')
		{
			var cunit = this.level.map_cells[pos.x][pos.y].unit;
			if ((cunit !== -1) && this.objects[cunit].canBeSelected())
			{
				this.regionSelect(pos.x, pos.y, pos.x, pos.y);
				if (this.selected_objects.length==1 && this.objects[this.selected_objects[0]].is_building)
					this.selected_info.is_building = true;
			}
			
			//If not new selection move selected units
			if (cunit==-1 && this.selected_objects.length>0)
				for (var i in this.selected_objects)
					this.objects[this.selected_objects[i]].move(pos.x, pos.y, (i==0));
		}
		else
		{
			if (this.action_state == ACTION_STATE_NONE)
			{
				this._deselectUnits();
				this.constructor.drawUnits();
			}
			else
				this.cleanActionState();
		}
	}
	
	this.regionSelect = function (x1, y1, x2, y2)
	{
		var x, y, cur_unit, play_sound = true;
		
		this._deselectUnits();
		
		//Select units
		for (x=x1; x<=x2; ++x)
			for (y=y1; y<=y2; ++y)
			{
				cur_unit = this.level.map_cells[x][y].unit;
				if ((cur_unit !== -1) && this.objects[cur_unit].canBeSelected())
				{
					//Do not select buildings on multiselect
					if (this.objects[cur_unit].is_building && (x1!=x2 || y1!=y2))
						continue;
					
					this.objects[cur_unit].select(true, play_sound);
					play_sound = false;
					this.selected_objects.push(cur_unit);
					this.selected_info.is_fly = this.selected_info.is_fly || this.objects[cur_unit].is_fly;
				}
			}
			
		//Constructor selected?
		if (this.selected_objects.length==1 && (this.objects[this.selected_objects[0]] instanceof TestUnit))
			this.constructor.drawBuildings();
		else
			this.constructor.drawUnits();
	}
	
	this._deselectUnits = function()
	{
		this._resetSelectionInfo();
		while (this.selected_objects.length > 0)
			this.objects[this.selected_objects.pop()].select(false);
	}
	
	this._loadGameResources = function()
	{
		//Map objects
		for (var i in this.level.map_object_proto)
			this.resources.addImage('mapobj_'+i, this.level.map_object_proto[i].image);
		
		//Common resources
		this.resources.addSound('construction_under_way', 'sounds/construction_under_way.ogg');
		this.resources.addSound('construction_complete', 'sounds/construction_complete.ogg');
		this.resources.addSound('new_units_available', 'sounds/new_units_available.ogg');
		this.resources.addSound('low_power', 'sounds/low_power.ogg');
		
		//Units & Buildings
		this.constructor.loadUnitResources();
		this.constructor.loadBuildingResources();
	}
	
	this._checkBrowserSupport = function()
	{
		//Support canvas
		var ret = !!document.createElement('canvas').getContext;
		if (!ret)
			return false;
		
		//Audio element
		ret = !!document.createElement('audio').canPlayType;
		if (!ret)
			return false;
		
		//OGG support
		var v = document.createElement('audio');
		ret = v.canPlayType('audio/ogg; codecs="theora, vorbis"');
		if (!ret)
			return false;
		
		return true;
	}
	
	this.shellStopButton = function()
	{
		for (var i in this.selected_objects)
			this.objects[this.selected_objects[i]].stop();
	}
	
	this._resetSelectionInfo = function()
	{
		this.selected_info = {
			is_building: false,
			is_fly: false,
			is_produce: false
		};
	}
	
	this.toggleActionState = function(state)
	{
		var prev_state = this.action_state;
		if (this.action_state != ACTION_STATE_NONE)
			this.cleanActionState();
		
		if (state == prev_state)
			return;
		
		switch (state)
		{
			case ACTION_STATE_SELL:
				$('#top_button_sell').addClass('active');
				break;
			case ACTION_STATE_POWER:
				$('#top_button_power').addClass('active');
				break;
		}
		
		this.action_state = state;
	}
	
	this.cleanActionState = function()
	{
		switch (this.action_state)
		{
			case ACTION_STATE_SELL:
				$('#top_button_sell').removeClass('active');
				break;
			case ACTION_STATE_POWER:
				$('#top_button_power').removeClass('active');
				break;
			case ACTION_STATE_BUILD:
				this.constructor.removeCellSelection();
				break;
		}
		
		this.action_state = ACTION_STATE_NONE;
	}
}

$(function(){
	game = new Game();
	game.init(new Level1(), function(){
		game.draw();
		setInterval(function(){game.run();}, 20);
	});
	
	//Interface stop button
	$('#top_button_stop').mousedown(function(){
		$(this).addClass('active');
	});
	$('#top_button_stop').mouseup(function(){
		$(this).removeClass('active');
	});
	$('#top_button_stop').click(function(){
		game.shellStopButton();
	});
	//Interface sell building button
	$('#top_button_sell').click(function(){
		game.toggleActionState(ACTION_STATE_SELL);
	});
	//Interface power building button
	$('#top_button_power').click(function(){
		game.toggleActionState(ACTION_STATE_POWER);
	});
	
	$('.tab').click(function(){
		$('.tab').removeClass('active');
		$(this).addClass('active');
	});
	
	$('.unit-image').click(function(){
		var cellid = $(this).parent('div').attr('data-cell');
		game.constructor.cellClick(cellid);
	});
	$('.unit-image').mouseover(function(){
		var cellid = $(this).parent('div').attr('data-cell'), position = $(this).offset();
		game.constructor.cellPopupPrepere(cellid);
		
		position.left -= 392;
		$('#cell_popup').css(position);
		$('#cell_popup').show();
	});
	$('.unit-image').mouseout(function(e){
		$('#cell_popup').hide();
	});
	
	$('#minimap').mousedown(function(event){
		game.minimapNavigation(true);
		game.minimapMove(event.layerX - this.offsetLeft, event.layerY - this.offsetTop);
	});
	
	$('#minimap').mouseup(function(){
		game.minimapNavigation(false);
	});
	
	$('#minimap').mousemove(function(event){
		game.minimapMove(event.layerX - this.offsetLeft, event.layerY - this.offsetTop);
	});
	
	$('#viewport').bind('contextmenu', function(){
		game.onClick('right');
		return false;
	});
	$('#viewport').mousedown(function(event){
		if (event.button == 0)
			game.mouse.selectionStart();
	});
	$('#viewport').mouseup(function(event){
		if (event.button == 0)
			game.mouse.selectionStop();
	});
	$('#viewport').mouseout(function(){
		game.mouse.show_cursor = false;
	});
	$('#viewport').mousemove(function(event){
		game.mouse.show_cursor = true;
		game.mouse.position = {x: event.layerX, y: event.layerY};
	});
	
	$(document).keydown(function(event) {
		var prevent = true;
		switch (event.which)
		{
			case 37: //Left
				game.viewport_move_x = -1;
				break;
			case 39: //Right
				game.viewport_move_x = 1;
				break;
			case 38: //Up
				game.viewport_move_y = -1;
				break;
			case 40: //Down
				game.viewport_move_y = 1;
				break;
			case 83: //s - stop selected units
				game.shellStopButton();
				break;
			default:
				prevent = false;
		}
		if (prevent)
			event.preventDefault();
	});
	
	$(document).keyup(function(event) {
		var prevent = true;
		switch (event.which)
		{
			case 37: //Left
			case 39: //Right
				game.viewport_move_x = 0;
				break;
			case 38: //Up
			case 40: //Down
				game.viewport_move_y = 0;
				break;
			default:
				prevent = false;
		}
		if (prevent)
			event.preventDefault();
	});
	
	$('#tmp_add_money').click(function(){
		game.money.addMoney(15000);
	});
});