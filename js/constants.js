var CELL_SIZE = 24;
var VIEWPORT_SIZE = 448;

var ACTION_STATE_NONE = 0;
var ACTION_STATE_SELL = 1;
var ACTION_STATE_POWER = 2;
var ACTION_STATE_BUILD = 3;

var CONST_VIEW_DEFAULT = 0;
var CONST_VIEW_BUILDINGS = 1;

var CELL_TYPE_EMPTY = 0;
var CELL_TYPE_TREE = 1;
var CELL_TYPE_WATER = 2;
var CELL_TYPE_NOWALK = 3;
var CELL_TYPE_BUILDING = 4;

var AUDIO_TYPE = 'ogg';

var game;

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(callback, element){
			window.setTimeout(callback, 1000 / 60);
		};
})();