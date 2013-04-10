function Debuger()
{
	this.quick_build = false;
	this.show_obj = false;
	this.show_type = false;
	this.show_grid = false;
	this.show_fps = false;
	this.mouse_panning = false;
	
	this.run_counter = 0;
	this.draw_counter = 0;
	this.run_cache = 0;
	this.fps_cache = 0;
	this.count_time = 0;
	
	var me = this;
	
	$('#debug_quick_build').click(function(){
		me.quick_build = $(this).is(':checked');
	});
	$('#debug_show_obj').click(function(){
		me.show_obj = $(this).is(':checked');
	});
	$('#debug_show_type').click(function(){
		me.show_type = $(this).is(':checked');
	});
	$('#debug_show_grid').click(function(){
		me.show_grid = $(this).is(':checked');
	});
	$('#debug_show_fps').click(function(){
		me.show_fps = $(this).is(':checked');
	});
	$('#debug_mouse_pan').click(function(){
		me.mouse_panning = $(this).is(':checked');
	});
	
	$('#debug_add_money').click(function(){
		game.players[PLAYER_HUMAN].addMoney(15000);
	});
	
	$('#debug_test').click(function(){
		var obj = game.findNearestInstance(HeadquarterBuilding, PLAYER_HUMAN, 1, 1);
		var animator = new Animator();
		animator.setObject(obj.uid);
		animator.animate('headquarter_60_explosion', Animator.MODE_FIXED);
	});
	
	this.countRun = function()
	{
		this.run_counter++;
	};
	
	this.countDraw = function()
	{
		this.draw_counter++;
	};
	
	this.resetCounters = function()
	{
		var time = (new Date).getTime();
		
		this.fps_cache = parseInt(this.draw_counter / ((time - this.count_time) / 1000));
		this.run_cache = parseInt(this.run_counter / ((time - this.count_time) / 1000));
		
		this.count_time = time;
		this.draw_counter = 0;
		this.run_counter = 0;
	};
	
	this.drawFPS = function()
	{
		game.viewport_ctx.fillStyle = '#fff';
		game.viewport_ctx.fillText('Game speed: ' + this.run_cache + ' (' + parseInt((this.run_cache/RUNS_PER_SECOND)*100) + '%)', 0, 10);
		game.viewport_ctx.fillText('FPS: ' + this.fps_cache, 0, 20);
	};
	
	this.drawCustomLine = function(text, line)
	{
		if (!line)
			line = 1;
		
		game.viewport_ctx.fillStyle = '#fff';
		game.viewport_ctx.fillText(text, 0, 10*line);
	};
}