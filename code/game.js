//Game code//


//set up the canvas
var canvas = document.createElement("canvas");
canvas.id = "game";
var ctx = canvas.getContext("2d");
canvas.width = 288;
canvas.height = 224;
document.body.appendChild(canvas);

var guiCanvas = document.createElement("canvas");
guiCanvas.id = "guiCanvas";
var ctx2 = guiCanvas.getContext("2d");
guiCanvas.width = 288;
guiCanvas.height = 54;
document.body.appendChild(guiCanvas);

//background image
var bgPNG = new Image();
bgPNG.src = "../sprites/background.png";
bgPNG.onload = function(){
	ctx.drawImage(bgPNG, 0, 0);
};

//background image
var hackAreaPNG = new Image();
hackAreaPNG.src = "../sprites/hackarea.png";
hackAreaPNG.onload = function(){
	if(story.scene === "main")
		ctx.drawImage(hackAreaPNG, 0, 32);
};

//hallway
var hallwayPNG = new Image();
hallwayPNG.src = '../sprites/Hallway.png';
var hallReady = false;
hallwayPNG.onload = function(){
	hallReady = true;
	if(story.scene === "hall")
		ctx.drawImage(hallwayPNG, 0, 0);
}

//////   gui   //////
//dialog
var dialogIMG = new Image();
dialogIMG.src = '../gui/dialog_box.png';
var dialogReady = false;
dialogIMG.onload = function(){dialogReady = true;};

//project bar progress
var projectBarIMG = new Image();
projectBarIMG.src = '../gui/projectbar.png';
var projectBarReady = false;
projectBarIMG.onload = function(){projectBarReady = true;};

//team skill bar
var teamBarIMG = new Image();
teamBarIMG.src = '../gui/teambar.png';
var teamBarReady = false;
teamBarIMG.onload = function(){teamBarReady = true;};

//energy bar
var energyBarIMG = new Image();
energyBarIMG.src = '../gui/energypic.png';
var energyReady = false;
energyBarIMG.onload = function(){energyReady = true;};

//filler bar
var fillerBarIMG = new Image();
fillerBarIMG.src = '../gui/fullbar.png';
var fillerReady = false;
fillerBarIMG.onload = function(){fillerReady = true;};


//level
var map = [];
var rows = 13;
var cols = 17;
var size = story.size;
var level_loaded = false;
var collideTiles = [1];
var tiles = new Image();
//tiles.src = "map/tileset.png";
var tilesReady = false;
tiles.onload = function(){
	tilesReady = true;
};
var tpr = 5; //tiles per row

//camera
var camera = {
	x : 0,
	y : 0
};

//lists
var items = [];
var npcs = [];


// directionals
var upKey = 38;     //[Up]
var leftKey = 37;   //[Left]
var rightKey = 39;  //[Rigt]
var downKey = 40;   //[Down]
var moveKeySet = [upKey, leftKey, rightKey, downKey];

// A and B
var a_key = 90;   //[Z]
var b_key = 88;   //[X]

// select and start
var select_key = 16;   //[Shift]
var start_key = 13;   //[Enter]

var actionKeySet = [a_key, b_key, select_key, start_key];
var keys = [];


var playerIMG = new Image();
playerIMG.src = "../sprites/main.png";
var playerReady = false;
playerIMG.onload = function(){playerReady = true;};

var player = {
	//sprite properties
		name : "Hax",
		width : 16,
		height : 16,
		img : playerIMG,
		ready : playerReady,

		//movement
		speed : 2,
		initPos : 0,
		moving : false,
		x : 8 * size, 
		y : 4 * size,
		velX : 0,
		velY : 0,
		show : true,

		//other properties
		interact : false,
		other : null,
		pathQueue : [],
		lastPos : [],
		following : false,

}

var team = {
	members : [],
	projectProg : 0,
	energy : 50,
	challenges : [],
	teamSkill : [0,0,0,0,0],
}

var projectIMG = new Image();
projectIMG.src = "../sprites/project.png";
var projectReady = false;
projectIMG.onload = function(){projectReady = true;};
var project = {
	name : "project",
	x : 256,
	y : 288,
	img : projectIMG,
	ready : projectReady,
	show : true,
	text : ["4d 49 4c 4b"],
	text_index : 0,
	area : null
}
items.push(project);

var coffeeIMG = new Image();
coffeeIMG.src = '../sprites/coffee.png';
var coffeeReady = false;
coffeeIMG.onload = function(){coffeeReady = true;};
var coffee = {
	name : "coffee",
	x : 128,
	y : 32,
	img : coffeeIMG,
	ready : coffeeReady,
	show : true,
	text : ["COFFEE!"],
	text_index : 0,
	area : null
}

var redbullIMG = new Image();
redbullIMG.src = '../sprites/redbull.png';
var redbullReady = false;
redbullIMG.onload = function(){redbullReady = true;};
var redbull = {
	name : "redbull",
	x : 512,
	y : 192,
	img : redbullIMG,
	ready : redbullReady,
	show : true,
	text : ["RED BULL!"],
	text_index : 0,
	area : null
}

var wifiIMG = new Image();
wifiIMG.src = '../sprites/wifi.png';
var wifiReady = false;
wifiIMG.onload = function(){wifiReady = true;};
var wifi = {
	name : "wifi",
	x : 512,
	y : 32,
	img : wifiIMG,
	ready : wifiReady,
	show : true,
	text : ["WIFI!"],
	text_index : 0,
	area : null
}

var floppyIMG = new Image();
floppyIMG.src = '../sprites/floppy.png';
var floppyReady = false;
floppyIMG.onload = function(){floppyReady = true;};
var floppy = {
	name : "floppy",
	x : 384,
	y : 32,
	img : floppyIMG,
	ready : floppyReady,
	show : true,
	text : ["UPGRADE!"],
	text_index : 0,
	area : null
}

var invisibleIMG = new Image();
invisibleIMG.src = '../sprites/invisible.png';
var invisibleReady = false;
invisibleIMG.onload = function(){invisibleReady = true;};
function invisItem(name, x, y, text){
	this.name = name;
	this.x = x;
	this.y = y;
	this.text = text;
	this.img = invisibleIMG;
	this.ready = invisibleReady;
	this.show = true;
	this.text_index = 0;
	this.area = null;
}


var hackers = [];
var spectators = [];
var organizers = [];
var sponsors = [];

var energies = [];
energies.push(coffee);energies.push(redbull);
var questies = [];
questies.push(wifi);questies.push(floppy);
items.push.apply(items, energies);
items.push.apply(items, questies);

/////////////////     GENERIC FUNCTIONS   ///////////

//checks if an element is in an array
function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}



//////////////////  PLAYER CONTROLS /////////////////

//directional movement
function goNorth(sprite){
	if(!sprite.moving){
		sprite.initPos = Math.floor(sprite.y / size) * size;
		sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
		sprite.dir = "north";
		sprite.action = "travel";
	}
}
function goSouth(sprite){
	if(!sprite.moving){
		sprite.initPos = Math.floor(sprite.y / size) * size;
		sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
		sprite.dir = "south";
		sprite.action = "travel";
	}
}
function goEast(sprite){
	if(!sprite.moving){
		sprite.initPos = Math.floor(sprite.x / size) * size;
		sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
		sprite.dir = "east";
		sprite.action = "travel";
	}
}
function goWest(sprite){
	if(!sprite.moving){
		sprite.initPos = Math.floor(sprite.x / size) * size;
		sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
		sprite.dir = "west";
		sprite.action = "travel";
	}
}

//movement on the map
function travel(sprite){
	if(sprite.action === "travel"){   //continue if allowed to move
		var curspeed = sprite.speed;

		//travel north
		if(sprite.dir == "north"){
			if(Math.floor(sprite.y) > (sprite.initPos - size) && !collide(sprite)){
				sprite.velY = curspeed;
				sprite.y += velControl(Math.floor(sprite.y), -sprite.velY, (sprite.initPos - size));
				sprite.moving = true;
			}else{
				sprite.velY = 0;
				sprite.action = "idle";
				sprite.moving = false;
			}
		}else if(sprite.dir == "south"){
			if(Math.floor(sprite.y) < (sprite.initPos + size) && !collide(sprite)){
				sprite.velY = curspeed;
				sprite.y += velControl(Math.floor(sprite.y), sprite.velY, (sprite.initPos + size));
				sprite.moving = true;
			}else{
				sprite.velY = 0;
				sprite.action = "idle";
				sprite.moving = false;
			}
		}else if(sprite.dir == "east"){
			if(Math.floor(sprite.x) < (sprite.initPos + size) && !collide(sprite)){
				sprite.velX = curspeed;
				sprite.x += velControl(Math.floor(sprite.x), sprite.velX, (sprite.initPos + size));
				sprite.moving = true;
			}else{
				sprite.velX = 0;
				sprite.action = "idle";
				sprite.moving = false;
			}
		}else if(sprite.dir == "west"){
			if(Math.floor(sprite.x) > (sprite.initPos - size) && !collide(sprite)){
				sprite.velX = curspeed;
				sprite.x += velControl(Math.floor(sprite.x), -sprite.velX, (sprite.initPos - size));
				sprite.moving = true;
			}else{
				sprite.velX = 0;
				sprite.action = "idle";
				sprite.moving = false;
			}
		}
	}
}

//velocity control
function velControl(cur, value, max){
	//increment or decrement
	if(value > 0){
		if((cur + value) > max)
			return velControl(cur, Math.floor(value/2), max);
		else
			return value;
	}else if(value < 0){
		if((cur + value) < max)
			return velControl(cur, Math.floor(value/2), max);
		else
			return value;
	}else{
		return 1;
	}
}


function lockMotion(sprite){
	sprite.moving = false;
	sprite.action = "idle";
	sprite.velY = 0;
	sprite.velX = 0;
}


///////////////   INTERACT   ////////////////



//the interact function
function canInteract(sprite, item){
	if(!item.show)
		return false;

	//get the positions
		var rx;
		var ry;
		if(sprite.dir === "north" || sprite.dir === "west"){
			rx = Math.ceil(sprite.x / size);
			ry = Math.ceil(sprite.y / size);
		}else if(sprite.dir === "south" || sprite.dir === "east"){
			rx = Math.floor(sprite.x / size);
			ry = Math.floor(sprite.y / size);
		}
	
		//decide if adjacent to sprite
		var t = item;
		var xArea = [];
		var yArea = [];
		if(t.area !== null){
			var t_ba = item.area;

			//get bounding box area
			for(var z=0;z<t_ba.w;z++){
				xArea.push(t_ba.x+t.x+z);
			}
			for(var z=0;z<t_ba.h;z++){
				yArea.push(t_ba.y+t.y+z);
			}
		}else{
			xArea.push(Math.ceil(t.x / size));
			yArea.push(Math.ceil(t.y / size));
		}

		//determine if able to interact
		if(sprite.dir === "north" && (inArr(xArea, rx) && inArr(yArea, ry-1)))
			return true;
		else if(sprite.dir === "south" && (inArr(xArea, rx) && inArr(yArea, ry+1)))
			return true;
		else if(sprite.dir === "east" && (inArr(xArea, rx+1) && inArr(yArea, ry)))
			return true;
		else if(sprite.dir === "west" && (inArr(xArea, rx-1) && inArr(yArea, ry)))
			return true;

		//console.log(sprite.dir + " " + xArea + " " + yArea);
	
	return false;
}

//the talk function
function canTalk(sprite, other_pers){
	if(other_pers.moving || !other_pers.show)
		return false;

	//get the positions
		var rx;
		var ry;
		if(sprite.dir === "north" || sprite.dir === "west"){
			rx = Math.ceil(sprite.x / size);
			ry = Math.ceil(sprite.y / size);
		}else if(sprite.dir === "south" || sprite.dir === "east"){
			rx = Math.floor(sprite.x / size);
			ry = Math.floor(sprite.y / size);
		}
	
		//decide if adjacent to sprite
		nx = Math.floor(other_pers.x / size);
		ny = Math.floor(other_pers.y / size);

		if(sprite.dir == "north" && (rx == nx) && (ry-1 == ny))
			return true;
		else if(sprite.dir == "south" && (rx == nx) && (ry+1 == ny))
			return true;
		else if(sprite.dir == "east" && (rx+1 == nx) && (ry == ny))
			return true;
		else if(sprite.dir == "west" && (rx-1 == nx) && (ry == ny))
			return true;
}	

//faces the main character
function faceOpposite(npc){
	if(player.dir === "north")
		npc.dir = "south";
	else if(player.dir === "south")
		npc.dir = "north"
	else if(player.dir === "west")
		npc.dir = "east"
	else if(player.dir === "east")
		npc.dir = "west"
}

//non-cutscene specific behavior
function defaultBehavior(npc){
	if(!story.cutscene){
		if(npc.interact){
			clearInterval(npc.wt);
			npc.wt = 0;
		}
		if(npc.move === "drunk_walk" && !npc.interact && npc.show){
			if(npc.wt == 0 && !npc.moving){
				npc.wt = setInterval(function(){
					drunkardsWalk(npc, npc.boundary);
					clearInterval(npc.wt);
					npc.wt = 0;
				}, (Math.random() * 2 + 1)*1000);
			}
		}
	}else{
	  clearInterval(npc.wt);
	  npc.wt = 0;
	}
}



///////////////////     COLLISIONS     ////////////////



//if hit a collision point on the wall
function hitWall(sprite){
	if(!level_loaded)
		return false;

	//get the positions
	var rx;
	var ry;
	if(sprite.dir === "north" || sprite.dir === "west"){
		rx = Math.ceil(sprite.x / size);
		ry = Math.ceil(sprite.y / size);
	}else if(sprite.dir === "south" || sprite.dir === "east"){
		rx = Math.floor(sprite.x / size);
		ry = Math.floor(sprite.y / size);
	}



	//edge of map = undecided
	if((sprite.dir === "west" && rx-1 < 0) 
		|| (sprite.dir === "east" && rx+1 >= cols) 
			|| (sprite.dir === "north" && ry-1 < 0) 
				|| (sprite.dir === "east" && ry+1 >= rows))
		return;

	//decide if adjacent to sprite
	if(sprite.dir == "north" && inArr(collideTiles, map[ry-1][rx]))
		return true;
	else if(sprite.dir == "south" && inArr(collideTiles, map[ry+1][rx]))
		return true;
	else if(sprite.dir == "east" && inArr(collideTiles, map[ry][rx+1]))
		return true;
	else if(sprite.dir == "west" && inArr(collideTiles, map[ry][rx-1]))
		return true;
	else
		return false;
}

//if hit another sprite
function hitNPC(sprite){

	//get the positions
	var rx;
	var ry;
	if(sprite.dir === "north" || sprite.dir === "west"){
		rx = Math.ceil(sprite.x / size);
		ry = Math.ceil(sprite.y / size);
	}else if(sprite.dir === "south" || sprite.dir === "east"){
		rx = Math.floor(sprite.x / size);
		ry = Math.floor(sprite.y / size);
	}

	//decide if adjacent to sprite
	var ouch = false;
	for(var i=0;i<npcs.length;i++){
		var n = npcs[i];

		if(n == sprite || !n.show)
			continue;

		nx = Math.floor(n.x / size);
		ny = Math.floor(n.y / size);

		if(sprite.dir == "north" && (rx == nx) && (ry-1 == ny))
			ouch = true;
		else if(sprite.dir == "south" && (rx == nx) && (ry+1 == ny))
			ouch = true;
		else if(sprite.dir == "east" && (rx+1 == nx) && (ry == ny))
			ouch = true;
		else if(sprite.dir == "west" && (rx-1 == nx) && (ry == ny))
			ouch = true;
	}
	return ouch;
}

//if hit a specific boundary area
function hitBoundary(sprite, boundary){
	//boundary in the form [x,y,w,h]
	if(boundary == null){
		return false;
	}
	
	//get the positions
	var rx;
	var ry;
	if(sprite.dir === "north" || sprite.dir === "west"){
		rx = Math.ceil(sprite.x / size);
		ry = Math.ceil(sprite.y / size);
	}else if(sprite.dir === "south" || sprite.dir === "east"){
		rx = Math.floor(sprite.x / size);
		ry = Math.floor(sprite.y / size);
	}
	

	//edge of map = undecided
	if(rx-1 < 0 || rx+1 >= cols || ry-1 < 0 || ry+1 >= cols)
		return;

	//get bounding box area
	var xArea = [];
	for(var z=0;z<boundary.w;z++){
		xArea.push(boundary.x+z);
	}
	var yArea = [];
	for(var z=0;z<boundary.h;z++){
		yArea.push(boundary.y+z);
	}

	//console.log(xArea + "\t" + yArea);

	if(sprite.dir == "north" && (!inArr(xArea, rx) || !inArr(yArea, ry-1)))
		return true;
	else if(sprite.dir == "south" && (!inArr(xArea, rx) || !inArr(yArea, ry+1)))
		return true;
	else if(sprite.dir == "east" && (!inArr(xArea, rx+1) || !inArr(yArea, ry)))
		return true;
	else if(sprite.dir == "west" && (!inArr(xArea, rx-1) || !inArr(yArea, ry)))
		return true;
	
	return false;
}

function hitItem(sprite){
	//get the positions
	var rx;
	var ry;
	if(sprite.dir === "north" || sprite.dir === "west"){
		rx = Math.ceil(sprite.x / size);
		ry = Math.ceil(sprite.y / size);
	}else if(sprite.dir === "south" || sprite.dir === "east"){
		rx = Math.floor(sprite.x / size);
		ry = Math.floor(sprite.y / size);
	}

	//decide if adjacent to sprite
	var ouch = false;
	for(var i=0;i<items.length;i++){
		var n = items[i];

		if(n == sprite || !n.show)
			continue;

		nx = Math.floor(n.x / size);
		ny = Math.floor(n.y / size);

		if(sprite.dir == "north" && (rx == nx) && (ry-1 == ny))
			ouch = true;
		else if(sprite.dir == "south" && (rx == nx) && (ry+1 == ny))
			ouch = true;
		else if(sprite.dir == "east" && (rx+1 == nx) && (ry == ny))
			ouch = true;
		else if(sprite.dir == "west" && (rx-1 == nx) && (ry == ny))
			ouch = true;
	}
	return ouch;
}

//if hit another generic object
function hitOther(sprite, other){
	//get the positions
	var rx;
	var ry;
	if(sprite.dir === "north" || sprite.dir === "west"){
		rx = Math.ceil(sprite.x / size);
		ry = Math.ceil(sprite.y / size);
	}else if(sprite.dir === "south" || sprite.dir === "east"){
		rx = Math.floor(sprite.x / size);
		ry = Math.floor(sprite.y / size);
	}

	//decide if adjacent to sprite
	var nx = Math.floor(other.x / size);
	var ny = Math.floor(other.y / size);

	if(sprite.dir == "north" && (rx == nx) && (ry-1 == ny))
		return true;
	else if(sprite.dir == "south" && (rx == nx) && (ry+1 == ny))
		return true;
	else if(sprite.dir == "east" && (rx+1 == nx) && (ry == ny))
		return true;
	else if(sprite.dir == "west" && (rx-1 == nx) && (ry == ny))
		return true;

	return false;
}

function screenEdge(sprite){
	//get the positions
	var rx;
	var ry;
	if(sprite.dir === "north" || sprite.dir === "west"){
		rx = Math.ceil(sprite.x / size);
		ry = Math.ceil(sprite.y / size);
	}else if(sprite.dir === "south" || sprite.dir === "east"){
		rx = Math.floor(sprite.x / size);
		ry = Math.floor(sprite.y / size);
	}

	if(sprite.dir == "north" && (ry-1 < 0))
		return true;
	else if(sprite.dir == "south" && (ry+1 == rows))
		return true;
	else if(sprite.dir == "east" && (rx+1 == cols))
		return true;
	else if(sprite.dir == "west" && (rx-1 < 0))
		return true;

	return false;
}

//grouped collision checker
function collide(sprite, boundary=null){
	//return false;
	return hitNPC(sprite) || hitWall(sprite) || hitItem(sprite) || hitBoundary(sprite, boundary) || screenEdge(sprite);
}

function goodSpot(x, y){
	for(var r=0;r<rows;r++){
		for(var c=0;c<cols;c++){
			if(r == y && c == x && map[r][c] == 1)
				return false;
		}
	}

	for(var a=0;a<npcs;a++){
		if(npcs[a].x == x && npcs[a].y == y)
			return false;
	}
	for(var b=0;b<items;b++){
		if(items[b].x == x && items[b].y == y)
			return false;
	}
	return true;
}


///////////////////   CAMERA  /////////////////////


//if within the game bounds
function withinBounds(x,y){
	var xBound = (x >= Math.floor(camera.x / story.size) - 1) && (x <= Math.floor(camera.x / story.size) + (canvas.width / story.size));
	return xBound;
}

//have the camera follow the player
function panCamera(){
	if(level_loaded){
		//camera displacement
		if((player.x >= (canvas.width / 2)) && (player.x <= (map[0].length * size) - (canvas.width / 2)))
			camera.x = player.x - (canvas.width / 2);

		if((player.y >= (canvas.height / 2) - size/2) && (player.y <= (map.length * size) - (canvas.height / 2)))
			camera.y = player.y - (canvas.height / 2 - size/2);
	}
	
}

//reset the camera's position on the player
function resetCamera(){
	camera.x = 0;
	camera.y = 0;

	if((player.x > (map[0].length * size) - (canvas.width / 2)))
		camera.x = (map[0].length * size) - canvas.width;

	if((player.y > (map.length * size) - (canvas.height / 2)))
		camera.y = (map.length * size) - canvas.height;
}




///////////////////    NPCS    //////////////////



//random walking
function drunkardsWalk(sprite, boundary=null){
	var dice;
	var directions = ["north", "south", "west", "east"];
	if(!sprite.moving){
		var pseudoChar = {dir : directions[0], x : sprite.x, y : sprite.y}
		//check if it would hit other character
		do{
			dice = Math.floor(Math.random() * directions.length);
			pseudoChar.dir = directions.splice(dice, 1)[0];

			//no options left
			if(directions.length == 0)
				return;
		
		}while(collide(pseudoChar, boundary) || hitOther(pseudoChar, player))

		//move in direction
		if(pseudoChar.dir === "north"){
			goNorth(sprite);
		}else if(pseudoChar.dir === "south"){
			goSouth(sprite);
		}else if(pseudoChar.dir === "west"){
			goWest(sprite);
		}else if(pseudoChar.dir === "east"){
			goEast(sprite);
		}
	}
}

//look in random directions
function drunkardsLook(sprite){
	var dice;
	var directions = ["north", "south", "west", "east"];
	dice = Math.floor(Math.random() * 4);
	sprite.dir = directions[dice];
}

//act upon the robot pathQueue
function smallStep(robot){
	if(robot.pathQueue.length != 0 && !robot.moving){       //if not already moving and not an empty pathQueue
		var nextStep = robot.pathQueue[0];
		var curX = Math.floor(robot.x / 16);
		var curY = Math.floor(robot.y / 16);

		//changing y pos
		if(curX == nextStep[0]){
			if(nextStep[1] < curY)
				goNorth(robot);
			else if(nextStep[1] > curY)
				goSouth(robot);
		}   
		//changing x pos    
		else if(curY == nextStep[1]){
			if(nextStep[0] < curX)
				goWest(robot);
			else if(nextStep[0] > curX)
				goEast(robot);
		}
		//remove the node once reached
		robot.lastPos = robot.pathQueue.shift();
		//robot.lastPos = [Math.floor(robot.x / size), Math.floor(robot.y / size)];
	}
}



////////////////////////          RENDER         //////////////////////

//check for render ok
function checkRender(){
	//tiles
	if(!tilesReady){
		tiles.onload = function(){
			tilesReady = true;
		};
	}

	if(!hallReady){
		hallwayPNG.onload = function(){
			hallReady = true;
		};
	}


	//player
	if(!player.ready){
		player.img.onload = function(){player.ready = true;}
		if(player.img.width !== 0){
			player.ready = true;
		}
	}

	//npcs
	for(var a=0;a<npcs.length;a++){
		if(!npcs[a].ready){
			if(npcs[a].img.width !== 0){
				npcs[a].ready = true;
			}
		}
	}

	//item
	for(var i=0;i<items.length;i++){
		if(!items[i].ready){
			if(items[i].img.width !== 0){
				items[i].ready = true;
			}
		}
	}

	
	//dialogue
	if(!dialogReady){
		dialogIMG.onload = function(){dialogReady = true;};
	}

	//gui bars
	if(!energyReady){projectBarIMG.onload = function(){projectBarReady = true;};}
	if(!teamBarReady){teamBarIMG.onload = function(){teamBarReady = true;};}
	if(!energyBarIMG){energyBarIMG.onload = function(){energyReady = true;};}
	if(!fillerReady){fillerBarIMG.onload = function(){fillerReady = true;};}
}


function drawchar(sprite){
	if(sprite.ready && sprite.show)
		ctx.drawImage(sprite.img, sprite.x, sprite.y);
}

//draw a character sprite
function drawsprite(sprite){
	updatesprite(sprite);
	rendersprite(sprite);
}

//update animation
function updatesprite(sprite){
	//update the frames
	if(sprite.ct == (sprite.fps - 1))
		sprite.curFrame = (sprite.curFrame + 1) % sprite.seqlength;
		
	sprite.ct = (sprite.ct + 1) % sprite.fps;
}
//draw the sprite
function rendersprite(sprite){
	//set the animation sequence
	var sequence;
	if(sprite.dir == "north"){
		if(sprite.action == "idle")
			sequence = sprite.idleNorth;
		else 
			sequence = sprite.moveNorth;
	}
	else if(sprite.dir == "south"){
		if(sprite.action == "idle")
			sequence = sprite.idleSouth;
		else 
			sequence = sprite.moveSouth;
	}
	else if(sprite.dir == "west"){
		if(sprite.action == "idle")
			sequence = sprite.idleWest;
		else 
			sequence = sprite.moveWest;
	}
	else if(sprite.dir == "east"){
		if(sprite.action == "idle")
			sequence = sprite.idleEast;
		else 
			sequence = sprite.moveEast;
	}
	
	//get the row and col of the current frame
	var row = Math.floor(sequence[sprite.curFrame] / sprite.fpr);
	var col = Math.floor(sequence[sprite.curFrame] % sprite.fpr);
	
	var curheight = sprite.height;
	var offY = sprite.offsetY;
	var sprIMG = sprite.img;

	if(sprite.show && sprite.ready){
		ctx.drawImage(sprIMG, 
		col * sprite.width, row * curheight, 
		sprite.width, curheight,
		sprite.x - sprite.offsetX, sprite.y - offY, 
		sprite.width, curheight);
	}
}

function renderItem(item){
	if(item.show && item.ready)
		ctx.drawImage(item.img, item.x, item.y);
}

function drawBars(){

	//background gui
	ctx2.drawImage(projectBarIMG, 2, 4);
	ctx2.drawImage(energyBarIMG, 96, 4);
	ctx2.drawImage(teamBarIMG, 190, 4);

	//health bar gui
	ctx2.drawImage(fillerBarIMG, 0, 0, 88, 12, 8, 36, (team.projectProg/100) * 88, 12);
	ctx2.drawImage(fillerBarIMG, 0, 0, 88, 12, 102, 36, (team.energy/100) * 88, 12);

	//team stats gui
	ctx2.fillStyle = "#ff0000";
	ctx2.fillText(team.teamSkill[0], 196, 46);
	ctx2.fillText(team.teamSkill[1], 216, 46);
	ctx2.fillText(team.teamSkill[2], 236, 46);
	ctx2.fillText(team.teamSkill[3], 250, 46);
	ctx2.fillText(team.teamSkill[4], 272, 46);
}


//render everything 
function render(){
	checkRender();
	ctx.save();

	ctx.translate(-camera.x, -camera.y);

	//clear eveoything
	ctx.clearRect(camera.x, camera.y, canvas.width,canvas.height);
	
	//re-draw bg
	var ptrn = ctx.createPattern(bgPNG, 'repeat'); // Create a pattern with this image, and set it to "repeat".
	ctx.fillStyle = ptrn;
	ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
	
	//draw hack are
	if(story.scene === "main")
		ctx.drawImage(hackAreaPNG, 0, 32);
	else if(story.scene === "hall")
		ctx.drawImage(hallwayPNG, 0, 0);

	//draw the map
	//drawMap();

	//draw the buildings if behind player

	for(var i=0;i<items.length;i++){
		renderItem(items[i]);
	}

	//if npc behind player
	for(var c=0;c<npcs.length;c++){
		drawchar(npcs[c]);
	}

	//draw player
	drawchar(player);

	//gui
	drawGUI();


	//if(story.area === "vals")
		//drawTestMap(levelList[1]);

	ctx.restore();
	// requestAnimationFrame(render);

}

function drawGUI(){
	drawDialog();
	drawBars();
}


////////////////////   DIALOGUE     ///////////////////

//show dialog gui
function drawDialog(){
	var dialogue = story.dialogue;
	var choice = story.choice_box;
	if(dialogue.show && dialogReady){
		ctx.drawImage(dialogIMG, camera.x, camera.y);
		//wrapText(dialogue.text[dialogue.index], camera.x + 12, camera.y + 116)
		showText();

		/*
		if(choice.show){
			//choice boxes
			for(var c=0;c<choice.options.length;c++){
				var cx = camera.x+6;
				var cy = camera.y+95+(-11*(c+1));
				ctx.drawImage(optionIMG, cx, cy);
				ctx.font = "6px Gameboy";
				ctx.fillText(choice.options[choice.options.length-(c+1)], cx+4, cy+9);
			}

			//select
			ctx.drawImage(selectIMG, camera.x+6, camera.y+95+(11*(choice.index-choice.options.length)));
		}
		*/

		
		if(choice.show){
			//get the maximum x length
			var longest = 10;
			if(!hasMultiLine()){
				longest = bigChoice(choice.options);
			}

			//choice boxes
			var cx = camera.x+3;
			for(var c=0;c<choice.options.length;c++){
				var cy = camera.y+95+(-((optionIMG.height-2)/2)*(sumLines(c)));

				//var cy = camera.y+95+(-(optionIMG.height-1)*((sumLines(c)*11)+1));
				ctx.drawImage(optionIMG, 0,0, optionIMG.width, optionIMG.height, 
								cx, cy, (longest/10)*(optionIMG.width), (choice.lines[c]/2)*optionIMG.height);
				choiceText(choice.options[c], choice.lines[c], cy+9);

				//ctx.font = "6px Gameboy";
				//ctx.fillText(choice.options[choice.options.length-(c+1)], cx+4, cy+9);
			}

			//select
			var cy2 = camera.y+95-((optionIMG.height-2)/2)*(sumLines(choice.index));
			//((((optionIMG.height-2)/2)*(sumLines(choice.index)))*(choice.index-choice.options.length)), 

			ctx.drawImage(selectIMG, 0,0, selectIMG.width, selectIMG.height, 
								cx, cy2,
								(longest/10)*(selectIMG.width), (choice.lines[choice.index]/2)*selectIMG.height);
		}
		
	}
}

//find the longest line of text
function bigChoice(arr){
	var longest = 0;
	for(var i=0;i<arr.length;i++){
		longest = (arr[i].length > longest ? arr[i].length : longest);
	}
	return longest+1;
}

//wrap the text if overflowing on the choice box
function choiceText(text, lines, y) {
	var texts = text.split(" | ");
	ctx.font = "14px Courier";
	for(var l=0;l<lines;l++){
		ctx.fillText(texts[l], camera.x+7, y+(l*9));
	}
}	

//
function sumLines(i){
	var lines = story.choice_box.lines;
	var sum = 0;
	for(var l=i;l<lines.length;l++){
		sum += lines[l];
	}
	return sum;
}

function hasMultiLine(){
	for(var l=0;l<story.choice_box.lines.length;l++){
		if(story.choice_box.lines[l] > 1)
			return true;
	}
	return false;
}

//typewriter functions
var tw = 0;
var curLine = 0;						//current line index
var curText = "";
var text_speed = 85;
var text_time = 0;					//typewriter effect
var texting = false;				//currently typing
var lineTexts = ["", ""];		//the two lines that can be shown on screen
var maxWidth = 140;
var lineHeight = 32;
var jump = -1;

function typewrite(){	

	//pre-processing and reset
	if(!texting){
		curText = story.dialogue.text[story.dialogue.index];		//set the text to the NPC or item text 
		if(!curText)
			return;

		//check if section jump
		if(jump == -1){
			var jumper = curText.match(/<[0-9]+>/g);
			if(jumper){
				curText = curText.replace(/<[0-9]+>/g, "");
				jump = parseInt(jumper[0].replace(/[<>]/g, ""));
			}
		}
		curText = curText.replace(/<[0-9]+>/g, "");		//catch the stragler
		tw = 0;
		//console.log("restart")
		curLine = 0;
		clearText();
		ctx.font = "16px Courier";
		ctx.fillStyle = "#000000";
		texting = true;
	}
	if(tw < curText.length){
		//if at a new line reset
		if(curText[tw] === "|"){
			tw++;
			curLine++;
			if(curLine > 1){
				lineTexts[0] = lineTexts[1];
				lineTexts[1] = "";
			}
		}
		//append letters
		else{
			if(curLine == 0)
				lineTexts[0] += curText[tw];
			else
				lineTexts[1] += curText[tw];
		}
		text_time = setTimeout(typewrite, text_speed);
		tw++;
	}else{
		texting = false;
		clearTimeout(text_time);
		//console.log("done");
	}
}

function clearText(){
	lineTexts[0] = "";
	lineTexts[1] = "";
	clearTimeout(text_time);
}

function showText(){
	ctx.fillStyle = "#000000";
	ctx.fillText(lineTexts[0], camera.x + 16, camera.y + 172);
	ctx.fillText(lineTexts[1], camera.x + 16, camera.y + 172 + lineHeight);
}



////////////////////   KEY FUNCTIONS  //////////////////



// key events
var keyTick = 0;
var kt = null; 

//check for keydown
document.body.addEventListener("keydown", function (e) {
	//scroll through the options to choose for dialog
	if(story.cutscene && story.choice_box.show){
		var c = story.choice_box;
		if(e.keyCode == downKey || e.keyCode == rightKey)
			story.choice_box.index = (c.index + 1) % c.options.length;
		else if(e.keyCode == upKey || e.keyCode == leftKey)
			story.choice_box.index = ((c.index + c.options.length) - 1) % c.options.length;
	}
});

//determine if valud key to press
document.body.addEventListener("keydown", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = true;
	}else if(inArr(actionKeySet, e.keyCode)){
		keys[e.keyCode] = true;
	}
});

//check for key released
document.body.addEventListener("keyup", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = false;
	}else if(inArr(actionKeySet, e.keyCode)){
		keys[e.keyCode] = false;
		reInteract = true;
		text_speed = 85;
	}
});

//prevent scrolling with the game
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)){
        e.preventDefault();
    }
}, false);


//check if any directional key is held down
function anyKey(){
	return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}

//movement arrow keys
function moveKeys(){
	if(!player.moving && !player.interact  && !story.pause && !story.cutscene){
		if(keyTick < 1){
		if(keys[leftKey])         //left key
			player.dir = "west";
		else if(keys[rightKey])    //right key
			player.dir = "east";
		else if(keys[upKey])    //up key
			player.dir = "north";
		else if(keys[downKey])    //down key
			player.dir = "south";
		}else{
		if(keys[leftKey])         //left key
			goWest(player);
		else if(keys[rightKey])    //right key
			goEast(player);
		else if(keys[upKey])    //up key
			goNorth(player);
		else if(keys[downKey])    //down key
			goSouth(player);
		}
	}
}


//action and interaction keys
var reInteract = true;
var cutT = 0;
function actionKeys(){
	//interact [Z]
	var dialogue = story.dialogue;
	if(keys[a_key] && !player.interact && !player.moving && normal_game_action()){
		for(var i=0;i<items.length;i++){
			if(canInteract(player, items[i]) && items[i].text){

				story.trigger = "touch_" + items[i].name;
				reInteract = false;
				player.other = items[i];
				player.interact = true;

				if(!story.cutscene && !triggerWord(story.trigger)){
					dialogue.text = items[i].text;
					dialogue.index = 0;
					typewrite();
				}else{
					dialogue.index = 0;
					play();
					typewrite();
				}
				return;
			}
		}
		for(var i=0;i<npcs.length;i++){
			if(canTalk(player, npcs[i]) && npcs[i].text){
				story.trigger = "talk_" + npcs[i].name;

				//setup
				reInteract = false;
				player.other = npcs[i];
				player.other.interact = true;
				//faceOpposite(player.other);
				player.interact = true;
				clearInterval(npcs[i].wt);
				npcs[i].wt = 0;

				//normal interaction
				if(!story.cutscene && !triggerWord(story.trigger)){
					dialogue.text = npcs[i].text;
					dialogue.index = npcs[i].text_index;
					typewrite();
				}
				//cutscene interaction
				else{
					dialogue.index = 0;
					play();
					typewrite();
				}
				return;
			}
		}
	}
	//finished current dialogue text
	else if(keys[a_key] && dialogue.show && reInteract && !texting){
		var other = player.other;
		reInteract = false;
		//end of dialogue
		if(dialogue.index +1 == dialogue.text.length){
			player.interact = false;

			//select item if options showing
			if(story.choice_box.show){
				story.trigger = "> " + story.choice_box.options[story.choice_box.index];
				story.taskIndex++;
				dialogue.index = 0;
				play();
				typewrite();
				return;
			}

			//normal reset
			if(!story.cutscene){
				player.other.interact = false;
				if(jump !== -1){
					player.other.text_index = jump;
					jump = -1;
				}
				dialogue.index = 0;
			}else{
				story.taskIndex++;
			}
		}
		//still more dialogue left
		else{
			player.other.text_index++;
			dialogue.index++;
			typewrite();
		}
	}
	//increase typewriter speed 
	else if(keys[a_key] && dialogue.show && texting){
		text_speed = 40;
		reInteract = false;
	}

}


function normal_game_action(){
	return (!story.cutscene && reInteract && !story.pause);
}


/////////////////////////     GAME FUNCTIONS    /////////////////////

function makeHackArea(){
	rows = 13;
	cols = 17;
	map = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0],
			[0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0],
			[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			];
	level_loaded = true;
	player.x = 0;
	player.y = 7*story.size;
	lockMotion(player);
	makeHackers();
	makeSpectators();
	story.scene = "main";
	project.show = false;


	var organizer = new npc(8, 2, ["Hey there!", "Be sure to collect some | free swag from our | lovely sponsors!"], "organizer");
	organizer.name = "organizer";
	organizer.move = "none";
	organizers.push(organizer)
	npcs.push(organizer);

	var sponsor = new npc(2, 8, ["Happy hacking!"], "sponsor");
	sponsor.name = "sponsor";
	sponsor.move = "none";
	sponsors.push(sponsor);
	npcs.push(sponsor);
}

function makeHallArea(){
	rows = 6;
	cols = 9;
	map = [
		[1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1,1,1]
		]
	level_loaded = true;
	player.x = 1*story.size;
	player.y = 3*story.size;
	story.scene = "hall";
	for(var n=0;n<npcs.length;n++){
		npcs[n].show = false;
	}

}

function makeHackers(){
	hackers = []

	var mac = new hacker("Mac", 1, 2, "deployment", [20, 0, 0, 0, 0]);
	var sonia = new hacker("Sonia", 3, 5, "debugger", [0, 0, 0, 20, 0]);
	var nick = new hacker("Nick", 15, 8, "developer", [0, 20, 0, 0, 0]);
	var anthony = new hacker("Anthony", 13, 11, "design", [0, 0, 20, 0, 0]);
	var belle = new hacker("Belle", 13, 5, "researcher", [0, 0, 0, 0, 20]);
	var troy = new hacker("Troy", 10, 4, "jack", [5,5,5,5,5]);

	mac.text[1] = "I'm a deployer - I market | the code and software";
	sonia.text[1] = "I debug the code for errors";
	nick.text[1] = "I write and develop the | code";
	anthony.text[1] = "I design the architecture | of the code";
	belle.text[1] = "I research the problem | using information online";
	troy.text[1] = "I'm like a | jack-of-all-trades | -  I'm good at a lot of | different things!";


	hackers.push(mac);
	hackers.push(sonia);
	hackers.push(nick);
	hackers.push(anthony);
	hackers.push(belle);
	hackers.push(troy);

	npcs.push.apply(npcs, hackers);
}

function makeSpectators(){
	spectators = [];
	var spect1 = new npc(10, 3, ["Hack the Planet!"], "npc1");
	var spect2 = new npc(5, 1, ["Hack the Planet!"], "npc2");
	var spect3 = new npc(12, 7, ["Hack the Planet!"], "npc3");
	var spect4 = new npc(3, 10, ["Hack the Planet!"], "npc4");
	var spect5 = new npc(11, 11, ["Hack the Planet!"], "npc5");


	for(var s=0;s<spectators;s++){
		spectators.show = true;
	}

	spectators.push(spect1);
	spectators.push(spect2);
	spectators.push(spect3);
	spectators.push(spect4);
	spectators.push(spect5);

	npcs.push.apply(npcs, spectators);
}

function makeEnergy(){
	energies = [];

}


var hackClock = 0;
var timeLeft = 2160;
var energyClock = 0;
var projectClock = 0;
var projInc = 0;

function init(){
	player.show = false;
	var activations = [makeHallArea, makeHackArea, randomPosition];
	story.storyFunct = activations;

	var playerName = prompt("Enter your name");

	//set the timers
	energyClock = setInterval(function(){team.energy -= (team.members.length);}, 5000);
	hackClock = setInterval(function(){timeLeft -= 1;}, 1000);

	projInc = Math.floor(team.teamSkill[Math.floor(Math.random()*5)]/10) + (Math.floor(team.energy/10)-3);
	projectClock = setInterval(function(){
		team.projectProg += (projInc > 0 ? projInc : 0);
		projInc = Math.floor(team.teamSkill[Math.floor(Math.random()*5)]/10) + (Math.floor(team.energy/10)-3)
		console.log("project increase by: " + projInc);
	}, 7000)


	makeHackArea();
	//makeHallArea();
	story.player = player;
	story.team = team;
	story.player.name = playerName;
	player.show = true

	story.quest = "Demo";
	//startGame();
	demoTeam();
}

function startGame(){
	story.quest = "Register";
	story.trigger = "start_game";
	makeHallArea();
	//resetCamera();
}

function makeTeamScene(){
	//reset positions
	hackers[0].x = 1*story.size; hackers[0].y = 2*story.size;
	hackers[1].x = 3*story.size; hackers[1].y = 5*story.size;
	hackers[2].x = 15*story.size; hackers[2].y = 8*story.size;
	hackers[3].x = 1*story.size; hackers[3].y = 4*story.size;
	hackers[4].x = 13*story.size; hackers[4].y = 5*story.size;
	hackers[5].x = 15*story.size; hackers[5].y = 10*story.size;

	//set boundaries
	hackers[0].boundary = new boundArea(1,2,3,1);  // mac
	hackers[1].boundary = new boundArea(1,5,3,1);  // sonia
	hackers[2].boundary = new boundArea(13,8,3,1);  // nick
	hackers[3].boundary = new boundArea(1,4,3,1);  // anthony
	hackers[4].boundary = new boundArea(13,5,3,1);  // belle
	hackers[5].boundary = new boundArea(13,10,3,1);  // troy
}

function demoTeam(){
	var squad = [];
	for(var h=0;h<hackers.length;h++){
		if(squad.length < 3){
			var pickMe = Math.floor(Math.random()*2);
			if(pickMe == 0){
				squad.push(hackers[h]);
			}
		}
	}
	hack(squad);
}

function randomPosition(item){
	var x = Math.floor(Math.random()*cols);
	var y = Math.floor(Math.random()*rows);
	while(!goodSpot(x,y)){
		x = Math.floor(Math.random()*cols);
		y = Math.floor(Math.random()*rows);
	}
	item.x = x*story.size;
	item.y = y*story.size;
}


function calculateSkills(){
	for(var i=0;i<team.members.length;i++){
		for(var s=0;s<5;s++){
			team.teamSkill[s] += team.members[i].skillSet[s];
		}
	}
}
function hack(members){
	makeTeamScene();
	team.members = members;
	calculateSkills();
	for(var m=0;m<members.length;m++){
		members[m].show = true;
		members[m].x = 224 + 32*m;
		members[m].y = 256;
		members[m].move = "code";
		members[m].text.push("Let's build a chatbot, | " + player.name + "!");
	}
	project.show = true;
}

var test = "no";

function main(){
	requestAnimationFrame(main);
	canvas.focus();
	render();

	play();

	//player movement
	var pixX = Math.round(player.x / size);
	var pixY = Math.round(player.y / size);

	if(!story.pause){
		travel(player);
		if(player.action == "travel")
			story.trigger = "x"+pixX+"_y"+pixY;
	}

	panCamera();

	//npc movement
	if(!story.pause){
		for(var n = 0;n<npcs.length;n++){
			var npc = npcs[n];
			travel(npc);
			defaultBehavior(npc);
		}
	}

	//dialogue
	if(!story.cutscene){
		if(player.interact){
			story.dialogue.show = true;
		}else{
			story.dialogue.show = false;
			clearText();
		}
	}

//keyboard ticks
	var akey = anyKey();
	if(akey && kt == 0){
		kt = setInterval(function(){keyTick+=1}, 75);
	}else if(!akey){
		clearInterval(kt);
		kt = 0;
		keyTick=0;
	}
	moveKeys();
	actionKeys();


	if(team.energy <= 0 && !stopped){
		window.alert("RAN OUT OF ENERGY! GAME OVER");
		stopGame();
	}else if(team.projectProg >= 100 && !stopped){
		window.alert("CONGRATS! YOU FINISHED YOUR PROJECT!");
		stopGame();
	}


	///////////////    DEBUG   //////////////////
	/*
	var settings = "X: " + Math.round(player.x) + " | Y: " + Math.round(player.y);
	settings += " --- Pix X: " + pixX + " | Pix Y: " + pixY;
	settings += " --- " + story.trigger;
	document.getElementById('debug').innerHTML = settings;
	*/
}

var stopped = false;
function stopGame(){
	clearInterval(energyClock);
	clearInterval(projectClock);
	story.pause = true;
	clearInterval(hackClock);
	stopped = true;
}

/*
//prevent scrolling with the game
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)){
        e.preventDefault();
    }
}, false);
*/

main();