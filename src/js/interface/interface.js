var InterfaceGUI = {
	_current_tab: 'panel_build',
		
	preloadImages: function(level_data)
	{
		//-- CSS --
		game.resources.addImage('css1', 'images/interface/load-screen.png');
		game.resources.addImage('css2', 'images/interface/load-bar.png');
		game.resources.addImage('css3', 'images/interface/money.png');
		game.resources.addImage('css4', 'images/interface/topbuttons.png');
		game.resources.addImage('css5', 'images/interface/money_numbers.png');
		game.resources.addImage('css6', 'images/interface/menutabs.png');
		game.resources.addImage('css7', 'images/interface/panel.png');
		game.resources.addImage('css8', 'images/interface/unit_box.png');
		game.resources.addImage('css9', 'images/interface/b_buttons.png');
		game.resources.addImage('css10', 'images/interface/minimap.png');
		game.resources.addImage('css11', 'images/interface/switches.png');
		game.resources.addImage('css12', 'images/interface/metrics.png');
		game.resources.addImage('css13', 'images/interface/buttons.png');
		game.resources.addImage('css14', 'images/interface/menu_icons.png');
		game.resources.addImage('css15', 'images/interface/slider_box.png');
		game.resources.addImage('css16', 'images/interface/slide_scale.png');
		game.resources.addImage('css17', 'images/interface/title.png');
		game.resources.addImage('css18', 'images/interface/order_check.png');
		game.resources.addImage('css19', 'images/interface/checkbox.png');
		//---------
		game.resources.addImage('map-tiles', 'images/levels/'+level_data.tiles);
		game.resources.addImage('minimap', 'images/levels/'+level_data.minimap.image);
		game.resources.addImage('font', 'images/font.png');
	},

	drawMenu: function() {

		$('#menu_pause img')
			.attr('src', game.fontDraw.getDataUrl('Pause game'))
		$('#menu_restart img')
			.attr('src', game.fontDraw.getDataUrl('Restart game'))
		$('#menu_quit img')
			.attr('src', game.fontDraw.getDataUrl('Quit game'))
		$('#menu_fullscreen img')
			.attr('src', game.fontDraw.getDataUrl('Toggle full-screen'))
		$('#menu_pause_music img')
			.attr('src', game.fontDraw.getDataUrl('Pause music'))

		$('#panel_paths img')
			.attr('src', game.fontDraw.getDataUrl('"Paths" Not Available'))
		$('#panel_comms img')
			.attr('src', game.fontDraw.getDataUrl('"Comms" Not Available'))
	},

	toggleFullScreen: function() {
	  if (!document.fullscreenElement) {
	    document.documentElement.requestFullscreen();
	  } else if (document.exitFullscreen) {
	    document.exitFullscreen();
	  }
	},
		
	tabChanged: function(tab_id)
	{
		this._current_tab = tab_id;
		this.updateOrdersTab();
	},
		
	updateOrdersTab: function()
	{
		if (this._current_tab != 'panel_orders')
			return;
		
		var i, info = game.selected_info.tactic_info, keys = ['pursuit', 'tolerance', 'independance'];
		
		(info.order == TACTIC_ORDER_SCOUT) ? $('#order_scout_chk').addClass('checked') : $('#order_scout_chk').removeClass('checked');
		(info.order == TACTIC_ORDER_HARASS) ? $('#order_harass_chk').addClass('checked') : $('#order_harass_chk').removeClass('checked');
		(info.order == TACTIC_ORDER_SND) ? $('#order_snd_chk').addClass('checked') : $('#order_snd_chk').removeClass('checked');
		
		$('#order_options .dk-order-chk').removeClass('checked');
		if (info.order == TACTIC_ORDER_DEFAULT)
		{
			for (i in keys)
			{
				if (info[keys[i]] == 0)
					continue;
				$('#order_'+keys[i]+'_'+info[keys[i]]).addClass('checked');
			}
		}
	},
		
	changeDefaultTactic: function()
	{
		if (game.selected_objects.length==0)
			return;
		
		var info = game.selected_info.tactic_info;
		if (info.pursuit==0 || info.tolerance==0 || info.independance==0)
			return;
		
		game.players[PLAYER_HUMAN].default_tactic = {
			order: TACTIC_ORDER_DEFAULT,
			pursuit: info.pursuit,
			tolerance: info.tolerance,
			independance: info.independance
		};
	},
		
	ordersChange: function(order, type, val)
	{
		if (game.selected_objects.length==0)
			return;
		this._changeSelectionOrders(order, type, val);
		
		game.rebuildSelectionInfo(true);
	},
		
	orderChangePredefinedSet: function(set)
	{
		if (game.selected_objects.length==0)
			return;
		
		this._changeSelectionOrders(TACTIC_ORDER_DEFAULT, 'pursuit', set.pursuit);
		this._changeSelectionOrders(TACTIC_ORDER_DEFAULT, 'tolerance', set.tolerance);
		this._changeSelectionOrders(TACTIC_ORDER_DEFAULT, 'independance', set.independance);
		
		game.rebuildSelectionInfo(true);
	},
		
	_changeSelectionOrders: function(order, type, val)
	{
		var i, uid;
		
		for (i in game.selected_objects)
		{
			uid = game.selected_objects[i];
			if (game.objects[uid].is_building) {
				continue;
			}
			if (order != TACTIC_ORDER_DEFAULT)
			{
				if (game.selected_info.tactic_info.order == order)
					game.objects[uid].tactic.order = TACTIC_ORDER_DEFAULT;
				else
					game.objects[uid].tactic.order = order;
			}
			else
			{
				game.objects[uid].tactic[type] = val;
				if (game.objects[uid].tactic.order != TACTIC_ORDER_DEFAULT)
					game.objects[uid].tactic.order = TACTIC_ORDER_DEFAULT;
			}
			
			game.objects[uid].triggerEvent('tactic_changed');
		}
	},
		
	stopButton: function()
	{
		//Cancel any order on selected_objects
		for (var i in game.selected_objects)
			game.objects[game.selected_objects[i]].orderStop();
			
		//Cancel any actions
		game.cleanActionState();
	},
	
	setHandlers: function()
	{
		//Interface stop button
		$('#top_button_stop').on('mousedown touchstart', function(){
			$(this).addClass('active');
		});
		$('#top_button_stop').on('mouseup touchend touchcancel', function(){
			$(this).removeClass('active');
		});
		$('#top_button_stop').click(function(){
			InterfaceGUI.stopButton();
		});
		//Interface sell building button
		$('#top_button_sell').click(function(){
			game.toggleActionState(ACTION_STATE_SELL);
		});
		//Interface power building button
		$('#top_button_power').click(function(){
			game.toggleActionState(ACTION_STATE_POWER);
		});
		$('#top_button_repair').click(function(){
			game.toggleActionState(ACTION_STATE_REPAIR);
		});
		$('#top_button_attack').click(function(){
			game.toggleActionState(ACTION_STATE_ATTACK);
		});

		$('.tab').click(function(){
			var $this = $(this), panel_id = $this.attr('data-panel');

			$('.tab').removeClass('active');
			$this.addClass('active');

			if (panel_id)
			{
				$('.panel').addClass('hidden');
				$('#'+panel_id).removeClass('hidden');
				InterfaceGUI.tabChanged(panel_id);
			}
		});

		$('.unit-image').click(function(){
			var cellid = $(this).parent('div').attr('data-cell');
			InterfaceConstructManager.cellClick(cellid, 'left');
		});
		$('.unit-image').bind('contextmenu', function(){
			var cellid = $(this).parent('div').attr('data-cell');
			InterfaceConstructManager.cellClick(cellid, 'right');
			return false;
		});
		$('.unit-image').mouseover(function(event){
			var cellid = $(this).parent('div').attr('data-cell');
				
			InterfaceConstructManager.cellPopupPrepere(cellid);

			var position = MousePointer.getEventElementOffset(event, this)
			position.left -= 392;
			$('#cell_popup').css(position);
			$('#cell_popup').show();
		});

		$('.unit-image').on('mouseout, pointerout', function(e){
			$('#cell_popup').hide();
		});

		$('#upgrade_button').click(function(){
			game.buildingUpgrade();
		});
		$('#upgrade_button').on('mouseover, pointerover',function(event){
			if ($(this).hasClass('disable'))
				return;

			var position = $(this).offset();
			InterfaceConstructManager.upgradePopupPrepere();

			var position = MousePointer.getEventElementOffset(event, this)
			position.left -= 398;
			$('#cell_popup').css(position);
			$('#cell_popup').show();
		});
		$('#upgrade_button').on('mouseout, pointerout', function(){
			$('#cell_popup').hide();
		});

		$('#mouseview').bind('contextmenu', function(event){
			event.preventDefault();
			game.onClick('right');
			return false;
		});
		
		$('#mouseview').bind('dblclick', function(event){
			if (event.button == 0 || 
				(event.touches && event.touches.length <= 1)
			) {
				// TODO implement all same units select 
				console.warn('TODO implement all same units select')
			}
		});

		$('#mouseview').on('mousedown touchstart', function(event){
			if (event.button == 0 || 
				(event.touches && event.touches.length <= 1)
			) {
				MousePointer.getEventPosition(event, this)
				MousePointer.setPosition(event);
				MousePointer.selectionStart();
			}
		});
		$('#mouseview').on('mouseup touchend', function(event){
			if (event.button == 0 || 
				(event.touches && event.touches.length <= 1)
			) {
				MousePointer.getEventPosition(event, this)
				MousePointer.selectionStop();
			}
		});
		$('#mouseview').on('mouseout pointerleave pointerout touchcancel', function(){
			MousePointer.show_cursor = false;
		});
		$('#mouseview').on('mousemove touchmove', function(event){

			// Ignore multi touch
			if (event.touches && event.touches.length > 1) {
				return;
			}

			if (MousePointer.is_selection) {
				event.preventDefault()
			}

			MousePointer.getEventPosition(event, this)
			MousePointer.setPosition(event);
		});

		$('#cm_page_up').click(function(){
			InterfaceConstructManager.pageUp();
		});
		
		$('#cm_page_down').click(function(){
			InterfaceConstructManager.pageDown();
		});
		
		$('.scroll-box').on('mousedown touchstart', function(event) {
			MousePointer.getEventPosition(event, this)
			var $this = $(this), proc = parseInt(event.offsetX / $this.width() * 100);
			$this.children().css('width', proc + '%');
			// TODO set inital value
			game.changeGameParam($this.attr('data-param'), proc);
		});

		// TODO set initial values
		//$('[data-param=game_speed]')
		//$('[data-param=panning_speed]')
		//game.changeGameParam('game_speed', RUNS_PER_SECOND);
		//game.changeGameParam('panning_speed', ANIMATION_SPEED);
		
		//Order tab handlers
		$('#order_options .dk-order-chk').click(function(){
			var $this = $(this), type = $this.attr('data-type'), val = parseInt($this.attr('data-value'));
			InterfaceGUI.ordersChange(TACTIC_ORDER_DEFAULT, type, val);
		});
		$('#order_predefined_guard').click(function(){
			InterfaceGUI.orderChangePredefinedSet({pursuit: TACTIC_LOW, tolerance: TACTIC_HIGH, independance: TACTIC_HIGH});
		});
		$('#order_predefined_pursue').click(function(){
			InterfaceGUI.orderChangePredefinedSet({pursuit: TACTIC_HIGH, tolerance: TACTIC_HIGH, independance: TACTIC_LOW});
		});
		$('#order_predefined_default').click(function(){
			InterfaceGUI.orderChangePredefinedSet({
				pursuit: game.players[PLAYER_HUMAN].default_tactic.pursuit, 
				tolerance: game.players[PLAYER_HUMAN].default_tactic.tolerance, 
				independance: game.players[PLAYER_HUMAN].default_tactic.independance
			});
		});
		$('#order_scout_btn').click(function(){
			InterfaceGUI.ordersChange(TACTIC_ORDER_SCOUT, 0, 0);
		});
		$('#order_harasst_btn').click(function(){
			InterfaceGUI.ordersChange(TACTIC_ORDER_HARASS, 0, 0);
		});
		$('#order_snd_btn').click(function(){
			InterfaceGUI.ordersChange(TACTIC_ORDER_SND, 0, 0);
		});
		$('#order_set_default').click(InterfaceGUI.changeDefaultTactic);

		$('#menu_pause').click(function(){
			game.togglePause();
		});

		$('#menu_pause_music').click(function(){
			InterfaceMusicPlayer.toggle();
		})

		$('#menu_fullscreen').click(function(){
			InterfaceGUI.toggleFullScreen();
		});
		$('#menu_restart').click(function(){
			game.restart();
		});

		$('#menu_quit').click(function(){
			location.href = '/menu.html'
		});

		$(document).keydown(function(event) {
			var prevent = true;
			switch (event.which)
			{
				case 27: //Escape
					InterfaceGUI.stopButton();
					break;
				
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
				case 48: //0
				case 49: //1
				case 50: //2
				case 51: //3
				case 52: //4
				case 53: //5
				case 54: //6
				case 55: //7
				case 56: //8
				case 57: //9
					if (event.ctrlKey)
						game.createTacticalGroup(event.which - 48);
					else
						game.selectTacticalGroup(event.which - 48);
					break;

				case 65: //a - attack
					game.toggleActionState(ACTION_STATE_ATTACK);
					break;
				case 77: //m - attack
					InterfaceMusicPlayer.toggle();
					break;
				case 80: //p - pause/unpause game
					game.togglePause();
					break;
				case 83: //s - stop selected units
					InterfaceGUI.stopButton();
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
	}
};