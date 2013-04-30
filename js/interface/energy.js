var InterfaceEnergyWaterDraw = {
	_max: 0,
	_current: 0,
	_water_current: 0,
	
	_last_sound_notification: (new Date()).getTime() + 15000,
	_last_blink: this._last_sound_notification,
	_ctx: null,
	
	init: function()
	{
		this._ctx = $('#energy_scale').get(0).getContext('2d');
		
		$('#energy_scale').click(function(event){
			if (event.offsetX >= 29)
				InterfaceEnergyWaterDraw.waterClick();
		});
	},
	
	enrgyNotification: function(time)
	{
		if (this._max <= this._current)
		{
			//Make sound every 15 sec
			if ((time - this._last_sound_notification) > 15000)
			{
				InterfaceSoundQueue.addSound((this._current-this._max > 250) ? 'power_critical' : 'low_power');
				this._last_sound_notification = time;
			}
		}
	},
	
	drawAll: function()
	{
		this.waterDraw();
		this.energyDraw();
	},
	
	waterDraw: function()
	{
		var CANVAS_H = 81, bar_size = parseInt(this._water_current/200*CANVAS_H);
		
		//Background
		this._ctx.fillStyle = '#bbbbbb';
		this._ctx.fillRect(29, 0, 9, CANVAS_H);
		
		//Water level
		this._ctx.fillStyle = '#00a5ff';
		this._ctx.fillRect(29, CANVAS_H - bar_size, 9, bar_size);
	},
	
	waterSetLevel: function(level)
	{
		if (level > this._water_current)
		{
			this._water_current = level;
			this.waterDraw();
		}
	},
	
	waterReset: function()
	{
		var i;
		
		this._water_current = 0;
		
		for (i in game.objects)
			if ((game.objects[i] instanceof WaterLaunchPadBuilding) && (game.objects[i].player == PLAYER_HUMAN))
				if (game.objects[i].res_now > this._water_current)
					this._water_current = game.objects[i].res_now;
		
		this.waterDraw();
	},
	
	waterClick: function()
	{
		var i, obj = null, max = 0;
		
		for (i in game.objects)
			if ((game.objects[i] instanceof WaterLaunchPadBuilding) && (game.objects[i].player == PLAYER_HUMAN))
				if (game.objects[i].res_now > max)
				{
					max = game.objects[i].res_now;
					obj = game.objects[i];
				}
				
		if (obj !== null)
			obj.sellWater();
	},
	
	energyDraw: function()
	{
		var SECTION_STEP = 2500, CANVAS_H = 81;
		var bar_color = '#ff0000', max_val = Math.max(2500, Math.ceil(Math.max(this._max, this._current) / SECTION_STEP)*SECTION_STEP), 
			bar_size = parseInt(this._max/max_val*CANVAS_H), cur_pos = 80.5-parseInt(this._current/max_val*CANVAS_H);

		if (this._max > this._current)
		{
			$('#metrics_box').removeClass('blicked');
			bar_color = '#a5ff6c';
		}
		else
		{
			$('#metrics_box').addClass('blicked');
			bar_color = ((this._current - this._max) > 250) ? '#ff0e00' : '#ffff00';
		}

		//Background
		this._ctx.fillStyle = '#bbbbbb';
		this._ctx.fillRect(0, 0, 17, CANVAS_H);

		//Draw bar
		this._ctx.fillStyle = bar_color;
		this._ctx.fillRect(0, CANVAS_H - bar_size, 17, bar_size);

		//Draw current use
		this._ctx.lineWidth = 1;
		this._ctx.strokeStyle = '#fdfdfd';
		this._ctx.beginPath();
		this._ctx.moveTo(0, cur_pos);
		this._ctx.lineTo(17, cur_pos);
		this._ctx.stroke();
		this._ctx.strokeStyle = '#000000';
		this._ctx.beginPath();
		this._ctx.moveTo(0, cur_pos+1);
		this._ctx.lineTo(17, cur_pos+1);
		this._ctx.stroke();

		//Draw sections
		var colors = ['#c9c9c9', '#000000'], cur_section, offset, section_size = CANVAS_H/(max_val/500);
		for (offset = 0; offset<2; ++offset)
		{
			this._ctx.strokeStyle = colors[offset];
			this._ctx.beginPath();
			for (cur_section = 0; cur_section < CANVAS_H; cur_section += section_size)
			{
				this._ctx.moveTo(0, parseInt(cur_section) + offset + 0.5);
				this._ctx.lineTo(4, parseInt(cur_section) + offset + 0.5);
			}
			this._ctx.stroke();
		}
	},
	
	energyAddToMax: function(val)
	{
		this._max += val;
		this.energyDraw();
	},
	
	energyAddToCurrent: function(val)
	{
		this._current += val;
		this.energyDraw();
	}
};