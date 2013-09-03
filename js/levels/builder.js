function LevelBuilder(level_data)
{
	function setMaxMovement()
	{
		level_data.max_movement = {
			x: CELL_SIZE*level_data.size.x-VIEWPORT_SIZE,
			y: CELL_SIZE*level_data.size.y-VIEWPORT_SIZE
		};
	}
	
	function createMatrix()
	{
		for (var x=0; x<level_data.size.x; ++x)
			for (var y=0; y<level_data.size.y; ++y)
				level_data.map_cells[x][y] = {
					original_type: level_data.map_cells[x][y], 
					type: level_data.map_cells[x][y], 
					ground_unit: -1,
					fly_unit: -1,
					building: -1,
					map_element: -1,
					shroud: (GAMECONFIG.shroud ? 1 : 0),
					fog: (GAMECONFIG.shroud ? 0 : 1) ,
					fog_new_state: ((!GAMECONFIG.fog && !GAMECONFIG.shroud) ? 1 : 0)
				};
	}
	
	this.build = function()
	{
		setMaxMovement();
		createMatrix();
	};
	
	this.loadMapElements = function()
	{
		for (var i in level_data.map_elements_proto)
		{
			game.resources.addImage('mapobj_' + i, 'images/' + level_data.theme + '/' + i + '.png');
			if (level_data.map_elements_proto[i].shadow)
				game.resources.addImage('mapobj_' + i + '_shadow', 'images/' + level_data.theme + '/' + i + '_shadow.png');
		}
	};
	
	this.generateMap = function()
	{
		var ctx = $('#map_view').get(0).getContext('2d'), tiles = game.resources.get('map-tiles');
		var element, proto, eid, xx, yy, i, j;
		
		$('#map_view, #map_fog').attr({
			width: CELL_SIZE*level_data.size.x,
			height: CELL_SIZE*level_data.size.y
		});
		
		//Tiles
		for (var x=0; x<level_data.size.x; ++x)
			for (var y=0; y<level_data.size.y; ++y)
			{
				ctx.drawImage(
					tiles, (level_data.map_tiles[x][y]%32)*CELL_SIZE, Math.floor(level_data.map_tiles[x][y]/32)*CELL_SIZE, 
					CELL_SIZE, CELL_SIZE, x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE
				);
			}
			
		//Objects
		for (i=0; i<level_data.map_elements.length; ++i)
		{
			proto = level_data.map_elements_proto[level_data.map_elements[i].key];
			
			if (proto.static_img)
				MapElement.addStatic(ctx, level_data.map_elements[i].x, level_data.map_elements[i].y, level_data.map_elements[i].key, proto);
			else
			{
				element = new MapElement(level_data.map_elements[i].x, level_data.map_elements[i].y, level_data.map_elements[i].key, proto);
				game.map_elements.push(element);
				eid = game.map_elements.length - 1;
				
				//Mark cells
				j = 0;
				for (xx = 0; xx<proto.size.x; ++xx)
					for (yy = 0; yy<proto.size.y; ++yy)
					{
						level_data.map_cells[level_data.map_elements[i].x + xx][level_data.map_elements[i].y + yy].type = (proto.move_area[j]==0) ? CELL_TYPE_TREE : CELL_TYPE_NOWALK;
						level_data.map_cells[level_data.map_elements[i].x + xx][level_data.map_elements[i].y + yy].map_element = eid;
						j++;
					}
			}
		}
	};
}