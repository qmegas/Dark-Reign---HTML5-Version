// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Includes Binary Heap (with modifications) from Marijn Haverbeke. 
// http://eloquentjavascript.net/appendix2.html


var GraphNodeType = { 
	OPEN: 1, 
	WALL: 0 
};

// Creates a Graph class used in the astar search algorithm.
function Graph(grid, move_mode, avoid_others) 
{
	var nodes = [], type, x, y, row;

	for (x = 0; x < grid.length; x++) 
	{
		nodes[x] = [];
        
		for (y = 0, row = grid[x]; y < row.length; y++)
		{
			type = 1;
			if (row[y].type==CELL_TYPE_WATER && move_mode==MOVE_MODE_GROUND)
				type = 0;
			if ((row[y].type==CELL_TYPE_NOWALK || row[y].type==CELL_TYPE_BUILDING) && move_mode!=MOVE_MODE_FLY)
				type = 0;
			if (type==1 && avoid_others)
			{
				if (move_mode == MOVE_MODE_FLY)
					type = (row[y].fly_unit != -1) ? 0 : type;
				else
					type = (row[y].ground_unit != -1) ? 0 : type;
			}
			nodes[x][y] = new GraphNode(x, y, type);
		}
	}

	this.input = grid;
	this.nodes = nodes;
}

Graph.prototype.toString = function() {
	var graphString = "\n";
	var nodes = this.nodes;
	var rowDebug, row, y, l;
	for (var x = 0, len = nodes.length; x < len; x++) {
		rowDebug = "";
		row = nodes[x];
		for (y = 0, l = row.length; y < l; y++) {
			rowDebug += row[y].type + " ";
		}
		graphString = graphString + rowDebug + "\n";
	}
	return graphString;
};

function GraphNode(x,y,type) {
	this.data = { };
	this.x = x;
	this.y = y;
	this.pos = {
		x: x, 
		y: y
	};
	this.type = type;
}

GraphNode.prototype.toString = function() {
	return "[" + this.x + " " + this.y + "]";
};

GraphNode.prototype.isWall = function() {
	return this.type == GraphNodeType.WALL;
};


function BinaryHeap(scoreFunction){
	this.content = [];
	this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
	push: function(element) {
		// Add the new element to the end of the array.
		this.content.push(element);

		// Allow it to sink down.
		this.sinkDown(this.content.length - 1);
	},
	pop: function() {
		// Store the first element so we can return it later.
		var result = this.content[0];
		// Get the element at the end of the array.
		var end = this.content.pop();
		// If there are any elements left, put the end element at the
		// start, and let it bubble up.
		if (this.content.length > 0) {
			this.content[0] = end;
			this.bubbleUp(0);
		}
		return result;
	},
	remove: function(node) {
		var i = this.content.indexOf(node);
    
		// When it is found, the process seen in 'pop' is repeated
		// to fill up the hole.
		var end = this.content.pop();

		if (i !== this.content.length - 1) {
			this.content[i] = end;
            
			if (this.scoreFunction(end) < this.scoreFunction(node)) {
				this.sinkDown(i);
			}
			else {
				this.bubbleUp(i);
			}
		}
	},
	size: function() {
		return this.content.length;
	},
	rescoreElement: function(node) {
		this.sinkDown(this.content.indexOf(node));
	},
	sinkDown: function(n) {
		// Fetch the element that has to be sunk.
		var element = this.content[n];

		// When at 0, an element can not sink any further.
		while (n > 0) {

			// Compute the parent element's index, and fetch it.
			var parentN = ((n + 1) >> 1) - 1,
			parent = this.content[parentN];
			// Swap the elements if the parent is greater.
			if (this.scoreFunction(element) < this.scoreFunction(parent)) {
				this.content[parentN] = element;
				this.content[n] = parent;
				// Update 'n' to continue at the new position.
				n = parentN;
			}

			// Found a parent that is less, no need to sink any further.
			else {
				break;
			}
		}
	},
	bubbleUp: function(n) {
		// Look up the target element and its score.
		var length = this.content.length,
		element = this.content[n],
		elemScore = this.scoreFunction(element);
        
		while(true) {
			// Compute the indices of the child elements.
			var child2N = (n + 1) << 1, child1N = child2N - 1;
			// This is used to store the new position of the element,
			// if any.
			var swap = null;
			// If the first child exists (is inside the array)...
			if (child1N < length) {
				// Look it up and compute its score.
				var child1 = this.content[child1N],
				child1Score = this.scoreFunction(child1);

				// If the score is less than our element's, we need to swap.
				if (child1Score < elemScore)
					swap = child1N;
			}

			// Do the same checks for the other child.
			if (child2N < length) {
				var child2 = this.content[child2N],
				child2Score = this.scoreFunction(child2);
				if (child2Score < (swap === null ? elemScore : child1Score)) {
					swap = child2N;
				}
			}

			// If the element needs to be moved, swap it, and continue.
			if (swap !== null) {
				this.content[n] = this.content[swap];
				this.content[swap] = element;
				n = swap;
			}

			// Otherwise, we are done.
			else {
				break;
			}
		}
	}
};

var astar = {
	init: function(grid) {
		for(var x = 0, xl = grid.length; x < xl; x++) {
			for(var y = 0, yl = grid[x].length; y < yl; y++) {
				var node = grid[x][y];
				node.f = 0;
				node.g = 0;
				node.h = 0;
				node.cost = node.type;
				node.visited = false;
				node.closed = false;
				node.parent = null;
			}
		}
	},
	heap: function() {
		return new BinaryHeap(function(node) { 
			return node.f; 
		});
	},
	search: function(grid, start, end) {
		astar.init(grid);

		var openHeap = astar.heap();

		openHeap.push(start);

		while(openHeap.size() > 0) {

			// Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
			var currentNode = openHeap.pop();

			// End case -- result has been found, return the traced path.
			if(currentNode === end) {
				var curr = currentNode;
				var ret = [];
				while(curr.parent) {
					ret.push(curr);
					curr = curr.parent;
				}
				return ret.reverse();
			}

			// Normal case -- move currentNode from open to closed, process each of its neighbors.
			currentNode.closed = true;

			// Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
			var neighbors = astar.neighbors(grid, currentNode);

			for(var i=0, il = neighbors.length; i < il; i++) {
				var neighbor = neighbors[i];

				if(neighbor.closed || neighbor.isWall()) {
					// Not a valid node to process, skip to next neighbor.
					continue;
				}

				// The g score is the shortest distance from start to current node.
				// We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
				var gScore = currentNode.g + neighbor.cost;
				var beenVisited = neighbor.visited;

				if(!beenVisited || gScore < neighbor.g) {

					// Found an optimal (so far) path to this node.  Take score for node to see how good it is.
					neighbor.visited = true;
					neighbor.parent = currentNode;
					neighbor.h = neighbor.h || astar.manhattan(neighbor.pos, end.pos);
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;

					if (!beenVisited) {
						// Pushing to heap will put it in proper place based on the 'f' value.
						openHeap.push(neighbor);
					}
					else {
						// Already seen the node, but since it has been rescored we need to reorder it in the heap
						openHeap.rescoreElement(neighbor);
					}
				}
			}
		}

		// No result was found - empty array signifies failure to find path.
		return [];
	},
	
	manhattan: function(pos0, pos1) 
	{
		var d1 = Math.abs (pos1.x - pos0.x);
		var d2 = Math.abs (pos1.y - pos0.y);
		return d1 + d2;
	},
	
	neighbors: function(grid, node) 
	{
		var ret = [];
		var x = node.x;
		var y = node.y;

		// West
		if(grid[x-1] && grid[x-1][y])
			ret.push(grid[x-1][y]);

		// East
		if(grid[x+1] && grid[x+1][y])
			ret.push(grid[x+1][y]);

		// South
		if(grid[x] && grid[x][y-1])
			ret.push(grid[x][y-1]);

		// North
		if(grid[x] && grid[x][y+1])
			ret.push(grid[x][y+1]);

		// Southwest
		if(grid[x-1] && grid[x-1][y-1])
			ret.push(grid[x-1][y-1]);

		// Southeast
		if(grid[x+1] && grid[x+1][y-1])
			ret.push(grid[x+1][y-1]);

		// Northwest
		if(grid[x-1] && grid[x-1][y+1])
			ret.push(grid[x-1][y+1]);

		// Northeast
		if(grid[x+1] && grid[x+1][y+1])
			ret.push(grid[x+1][y+1]);

		return ret;
	}
};


var PathFinder = {
	_current_empty_cell_func: null,
		
	findPath: function(from_x, from_y, to_x, to_y, move_mode, avoid_others)
	{	
		var graph = new Graph(game.level.map_cells, move_mode, avoid_others);
		var start = graph.nodes[from_x][from_y];
		var end = graph.nodes[to_x][to_y];
		
		return astar.search(graph.nodes, start, end);
	},
		
	findNearestEmptyCell: function(x, y, move_mode)
	{
		this._current_empty_cell_func = this._isAnyUnit;
		return this._findNearestEmptyCell(x, y, move_mode);
	},
		
	findNearestStandCell: function(x, y)
	{
		this._current_empty_cell_func = this._isGroundOnly;
		return this._findNearestEmptyCell(x, y, MOVE_MODE_GROUND);
	},
	
	_findNearestEmptyCell: function(x, y, move_mode)
	{
		var round, padding, cell = {x: x, y: y};
		
		if (this._checkCell(cell, move_mode))
			return cell;
		
		for (round = 1; round < 20; ++round)
		{
			for (padding = 0; padding <= round; ++padding)
			{
				//left
				cell = {x: x - round, y: y - padding};
				if (this._checkCell(cell, move_mode))
					return cell;
				if (padding>0 && padding<round)
				{
					cell = {x: x - round, y: y + padding};
					if (this._checkCell(cell, move_mode))
						return cell;
				}
				
				//right
				cell = {x: x + round, y: y - padding};
				if (this._checkCell(cell, move_mode))
					return cell;
				if (padding>0 && padding<round)
				{
					cell = {x: x + round, y: y + padding};
					if (this._checkCell(cell, move_mode))
						return cell;
				}
				
				//Top
				cell = {x: x + padding, y: y - round};
				if (this._checkCell(cell, move_mode))
					return cell;
				if (padding>0 && padding<round)
				{
					cell = {x: x - padding, y: y - round};
					if (this._checkCell(cell, move_mode))
						return cell;
				}
				
				//Bottom
				cell = {x: x + padding, y: y + round};
				if (this._checkCell(cell, move_mode))
					return cell;
				if (padding>0 && padding<=round)
				{
					cell = {x: x - padding, y: y + round};
					if (this._checkCell(cell, move_mode))
						return cell;
				}
			}
		}
		
		return null;
	},
	
	_checkCell: function(cell, move_mode)
	{
		if (!MapCell.isCorrectCord(cell.x, cell.y))
			return false;
		
		var m_cell = game.level.map_cells[cell.x][cell.y];
		
		if (m_cell.type==CELL_TYPE_WATER && move_mode==MOVE_MODE_GROUND)
			return false;
		
		if ((m_cell.type==CELL_TYPE_NOWALK || m_cell.type==CELL_TYPE_BUILDING) && move_mode!=MOVE_MODE_FLY)
			return false;
		
		if (this._current_empty_cell_func(m_cell))
			return false;
		
		return true;
	},
		
	_isAnyUnit: function(m_cell)
	{
		return (MapCell.getSingleUserId(m_cell) != -1);
	},
		
	_isGroundOnly: function(m_cell)
	{
		return (m_cell.ground_unit != -1);
	}
};