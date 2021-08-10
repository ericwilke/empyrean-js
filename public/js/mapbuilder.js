// EMPYREAN MAP BUILDER
//
// Author: Eric Wilke
//
// A tool to build maps for Empyrean.

// Set up canvas DOM element.
// Tiles are 90x90 px.
// Screen is 9x9
let canvas = document.getElementById('main_screen')
let ctx = canvas.getContext('2d')
canvas.width = 810
canvas.height = 810

ctx.font = "30px Arial";
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;
ctx.shadowColor="black";
ctx.shadowBlur = 7;
ctx.fillStyle = "white";
ctx.textAlign = "center";

let MAP_TILE_OFFSET = 4 //This is the number of tiles to the left, right, above, and below of the cursor
let KEY_PRESS = null
let KEY_CODE = 0
let X = 0
let Y = 0
let CONSOLE_TEXT = ""
let FILL_MODE = "island" // if "island", make borders water; if "dungeon", fill with road (brick)

 //===== CHANGE THESE SETTING TO ADJUST MAP SIZE =====
const MAPNAME = "map"
const WIDTH = 40
const HEIGHT = 40
//====================================================

let MAP = new Array(HEIGHT)
for (i=0; i < HEIGHT; i++) {
  MAP[i] = new Array(WIDTH)
}

for (x=0; x<WIDTH; x++) {
  for (y=0; y<HEIGHT; y++) {
    if (FILL_MODE == "dungeon") {
      MAP[y][x] = "road (stone)"
    } else {
      MAP[y][x] = "grass"
    }
    if ((x == 0 || x == WIDTH-1 || y == 0 | y == HEIGHT-1) && FILL_MODE == "island") {
      MAP[y][x] = "water (deep)"
    }
  }
}

//===== Can set the MAP tiles from a map JSON file here to edit exitisting map
MAP = [["water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)"],["water (deep)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (deep)"],["water (deep)","water (shallow)","water (shallow)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (shallow)","water (shallow)","water (deep)"],["water (deep)","water (shallow)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (white rough)","wall (white rough)","wall (white rough)","wall (white rough)","wall (white rough)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (white rough)","wood","wood","wood","wall (white rough)","wall (white rough)","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (shallow)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (white rough)","wood","wood","wood","wood","door","road (dirt)","road (dirt)","road (dirt)","road (dirt)","grass","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (white rough)","wood","wood","wood","wall (white rough)","wall (white rough)","grass","grass","grass","road (dirt)","grass","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","wall (gray)","wood","wood","wall (gray)","road (stone)","wall (gray)","wood","wood","wall (gray)","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (white rough)","wall (white rough)","wall (white rough)","wall (white rough)","wall (white rough)","grass","grass","grass","grass","road (dirt)","grass","grass","water (shallow)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","wall (gray)","wood","wood","door","road (stone)","door","wood","wood","wall (gray)","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","road (dirt)","grass","grass","water (shallow)","grass","grass","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","grass","grass","grass","wall (gray)","wood","wood","wall (gray)","road (stone)","wall (gray)","wood","wood","wall (gray)","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","grass","grass","grass","grass","road (dirt)","grass","grass","water (shallow)","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","grass","grass","wall (gray)","wall (gray)","wall (gray)","wall (gray)","door","wall (gray)","wall (gray)","wall (gray)","wall (gray)","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","grass","grass","grass","road (dirt)","grass","water (shallow)","water (shallow)","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","door-locked","grass","grass","grass","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","grass","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","grass","grass","grass","road (dirt)","grass","water (shallow)","grass","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","grass","grass","wall (gray)","wall (gray)","wall (gray)","road (stone)","road (stone)","road (stone)","wall (gray)","wall (gray)","wall (gray)","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","door","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","grass","water (shallow)","grass","grass","grass","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","grass","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","grass","grass","grass","road (dirt)","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","grass","grass","grass","road (dirt)","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","grass","grass","grass","grass","road (dirt)","grass","water (shallow)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","wall (gray)","wall (gray)","wall (gray)","wall (gray)","door","wall (gray)","wall (gray)","wall (gray)","wall (gray)","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","road (dirt)","grass","grass","water (shallow)","grass","grass","road (dirt)","road (dirt)","road (dirt)","grass","grass","grass","grass","grass","grass","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","water (shallow)","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","road (dirt)","grass","grass","water (shallow)","grass","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","grass","grass","grass","grass","grass","grass","grass","grass","road (dirt)","grass","grass","grass","grass","water (shallow)","water (shallow)","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","wood","wood","wood","wood"],["water (deep)","water (shallow)","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","grass","road (dirt)","road (dirt)","road (dirt)","road (dirt)","road (dirt)","grass","grass","grass","grass","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","water (shallow)","water (shallow)","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (shallow)","water (shallow)","grass","grass","road (dirt)","road (dirt)","road (dirt)","grass","grass","grass","grass","grass","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","grass","water (shallow)","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","water (shallow)","water (shallow)","water (shallow)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","wall (white rough)","wall (white rough)","door","wall (white rough)","wall (white rough)","grass","grass","water (shallow)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","road (dirt)","road (dirt)","road (dirt)","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","wall (white rough)","road (stone)","road (stone)","road (stone)","wall (white rough)","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","wall (white rough)","road (stone)","road (stone)","road (stone)","wall (white rough)","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","door","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","wall (white rough)","road (stone)","road (stone)","road (stone)","wall (white rough)","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","wall (white rough)","wall (white rough)","door","wall (white rough)","wall (white rough)","grass","grass","water (shallow)","water (shallow)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","grass","water (shallow)","grass","grass","forest-pine","grass","grass","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","wall (gray)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","road (stone)","wall (gray)","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","road (dirt)","grass","grass","grass","grass","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","wall (gray)","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","road (dirt)","grass","grass","grass","grass","water (shallow)","water (shallow)","water (shallow)","grass","grass","forest-pine","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","wall (white rough)","wall (white rough)","door","wall (white rough)","wall (white rough)","grass","grass","water (shallow)","grass","grass","grass","grass","forest-pine","grass","forest-pine","forest-pine","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","forest-pine","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","wall (white rough)","road (stone)","road (stone)","road (stone)","wall (white rough)","grass","grass","water (shallow)","grass","grass","forest-pine","forest-pine","grass","grass","forest-pine","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","forest-pine","forest-pine","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","wall (white rough)","road (stone)","road (stone)","road (stone)","wall (white rough)","grass","grass","water (shallow)","grass","grass","forest-pine","grass","grass","forest-pine","forest-pine","grass","forest-pine","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","forest-pine","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","wall (white rough)","wall (white rough)","wall (white rough)","wall (white rough)","wall (white rough)","grass","water (shallow)","water (shallow)","grass","grass","grass","forest-pine","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","forest-pine","grass","grass","grass","grass","grass","forest-pine","grass","grass","grass","grass","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","grass","grass","grass","grass","grass","grass","grass","water (shallow)","grass","grass","grass","grass","forest-pine","forest-pine","grass","grass","forest-pine","grass","forest-pine","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","forest-pine","grass","grass","grass","water (shallow)","water (deep)"],["water (deep)","water (shallow)","water (shallow)","grass","grass","grass","grass","grass","grass","water (shallow)","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","forest-pine","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water (shallow)","water (shallow)","water (deep)"],["water (deep)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (shallow)","water (deep)"],["water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)","water (deep)"]]

function keyPress(e) {
  e = e || window.event
  KEY_PRESS = e.key
  mapLoop()
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  screen_x = 0;
  for(x = X - MAP_TILE_OFFSET; x < X + MAP_TILE_OFFSET + 1; x++) {
    screen_y = 0;
    for(y = Y - MAP_TILE_OFFSET; y < Y + MAP_TILE_OFFSET + 1; y++) {
      if(x >= 0 && y >=0 && x<WIDTH && y<HEIGHT) {
        let drawTile, drawGrass, drawWater = null
        switch(MAP[y][x]) {
          case "grass":
            drawTile = tile_grass
            break;
          case "mountains":
            drawTile = tile_mountains
            break;
          case "desert":
            drawTile = tile_desert
            break;
          case "cave":
            drawTile = tile_cave
            break;
          case "forest-pine":
            drawGrass = true; drawTile = tile_forest_pine
            break;
          case "forest-oak":
            drawGrass = true; drawTile = tile_forest_oak
            break;
          case "forest-other":
            drawGrass = true; drawTile = tile_forest_other
            break;
          case "swamp":
            drawTile = tile_swamp
            break;
          case "road (stone)":
            drawTile = tile_road_stone
            break;
          case "road (dirt)":
            drawTile = tile_road_dirt
            break;
          case "wall (gray)":
            drawTile = tile_wall_gray
            break;
          case "wall (brown rough)":
            drawTile = tile_wall_brown_rough
            break;
          case "secret wall (brown rough)":
            drawTile = tile_secret_wall_brown_rough
            break;
          case "secret wall (white square)":
            drawTile = tile_secret_wall_white_square
            break;
          case "wall (white square)":
            drawTile = tile_wall_white_square
            break;
          case "wall (white rough)":
            drawTile = tile_wall_white_rough
            break;
          case "water (shallow)":
            drawTile = tile_water_shallow
            break;
          case "water (deep)":
            drawTile = tile_water_deep
            break;
          case "stairs":
            drawTile = tile_stairs
            break;
          case "sign":
            drawGrass = true; drawTile = tile_sign
            break;
          case "town":
            drawGrass = true; drawTile = tile_town
            break;
          case "castle":
            drawGrass = true; drawTile = tile_castle
            break;
          case "ruins":
            drawGrass = true; drawTile = tile_ruins
            break;
          case "runestone":
            drawGrass = true; drawTile = tile_runestone
            break;
          case "wood":
            drawTile = tile_wood
            break;
          case "door":
            drawTile = tile_door
            break;
          case "door-locked":
            drawTile = tile_door
            break;
          case "portal":
            drawTile = tile_portal
            break;
          case "counter (vertical)":
            drawTile = tile_counter_vertical
            break;
          case "counter (horizontal)":
            drawTile = tile_counter_horizontal
            break;
          case "boat":
            drawTile = tile_boat
            drawWater = true
            break;
        }
      if (drawGrass) {
        ctx.drawImage(tile_grass, screen_x*90, screen_y*90);
      }
      if (drawWater) {
        ctx.drawImage(tile_water_deep, screen_x*90, screen_y*90);
      }
      if (drawTile) {
        ctx.drawImage(drawTile, screen_x*90, screen_y*90);}
      }
      screen_y++;
      if(screen_y > 9) {
        screen_y = 0;
      }
    }
    screen_x++;
    if(screen_x > 9) {
      screen_x = 0;
    }
  }

  ctx.drawImage(tile_cursor, 360, 360);

  //ctx.fillText("Key press: " + KEY_PRESS, canvas.width/2 - 90, canvas.height/2 + 200);
  ctx.fillText("cursor X,Y: " + X + ", " + Y, canvas.width/2, canvas.height/2 + 90);
  ctx.fillText("selected tile: " + MAP[Y][X], canvas.width/2, canvas.height/2 + 120);
  ctx.fillText("map size: " + WIDTH + "x" + HEIGHT, canvas.width/2, canvas.height/2 + 150);
}

function mapLoop() {
  switch(KEY_PRESS) {
    case "w":
      // move up
      Y--
      if (Y<0) {Y=0}
      break
    case "s":
      // move down
      Y++
      if (Y>HEIGHT-1) {Y=HEIGHT-1}
      break
    case "a":
      // move left
      X--
      if (X<0) {X=0}
      break
    case "d":
      // move right
      X++
      if (X>WIDTH-1) {X=WIDTH-1}
      break
    case ".":
      // grass
      MAP[Y][X] = "grass"
      break
    case "t":
      // forest (pine)
      MAP[Y][X] = "forest-pine"
      break
    case "T":
      // forest (pine)
      MAP[Y][X] = "forest-oak"
      break
    case "y":
      // grass
      MAP[Y][X] = "forest-other"
      break
    case "+":
      // forest (pine)
      MAP[Y][X] = "road (dirt)"
      break
    case "=":
      // forest (pine)
      MAP[Y][X] = "road (stone)"
      break
    case "m":
      // grass
      MAP[Y][X] = "mountains"
      break
    case "-":
      // forest (pine)
      MAP[Y][X] = "desert"
      break
    case "z":
      // forest (pine)
      MAP[Y][X] = "swamp"
      break
    case "o":
      // grass
      MAP[Y][X] = "cave"
      break
    case "r":
      // forest (pine)
      MAP[Y][X] = "water (shallow)"
      break
    case "R":
      // forest (pine)
      MAP[Y][X] = "water (deep)"
      break
    case "j":
      // forest (pine)
      MAP[Y][X] = "wall (gray)"
      break
    case "J":
      // forest (pine)
      MAP[Y][X] = "secret wall (gray)"
      break
    case "l":
      // forest (pine)
      MAP[Y][X] = "wall (brown rough)"
      break
    case "L":
      // grass
      MAP[Y][X] = "secret wall (brown rough)"
      break
    case "k":
      // forest (pine)
      MAP[Y][X] = "wall (white square)"
      break
    case "K":
      // forest (pine)
      MAP[Y][X] = "secret wall (white square)"
      break
    case "n":
      // grass
      MAP[Y][X] = "wall (white rough)"
      break
    case "N":
      // forest (pine)
      MAP[Y][X] = "secret wall (white rough)"
      break
    case "b":
      // forest (pine)
      MAP[Y][X] = "door"
      break
    case "B":
      // forest (pine)
      MAP[Y][X] = "door-locked"
      break
    case "i":
      // forest (pine)
      MAP[Y][X] = "stairs"
      break
    case "u":
      // forest (pine)
      MAP[Y][X] = "sign"
      break
    case "[":
      // forest (pine)
      MAP[Y][X] = "town"
      break
    case "]":
      // grass
      MAP[Y][X] = "castle"
      break
    case "{":
      // forest (pine)
      MAP[Y][X] = "ruins"
      break
    case "@":
      // forest (pine)
      MAP[Y][X] = "portal"
      break
    case "^":
      // grass
      MAP[Y][X] = "boat"
      break
    case "#":
      // forest (pine)
      MAP[Y][X] = "wood"
      break
    case "|":
      // forest (pine)
      MAP[Y][X] = "counter (vertical)"
      break
    case "_":
      // forest (pine)
      MAP[Y][X] = "counter (horizontal)"
      break
    case " ":
      // show the tile content
      CONSOLE_TEXT = JSON.stringify(MAP)
      document.getElementById("text_screen").innerHTML = CONSOLE_TEXT

      if (document.getElementById("main_screen").style.display == "inline") {
        document.getElementById("main_screen").style.display = "none"
        document.getElementById("console").style.display = "none"
        document.getElementById("text_screen").style.display = "inline"
      } else {
          document.getElementById("main_screen").style.display = "inline"
          document.getElementById("console").style.display = "inline"
          document.getElementById("text_screen").style.display = "none"
      }
  }
  draw()
  KEY_PRESS = null
}

function init() {
  alert("Set the name of the map, the height and width inside the mapbuilder.js file. Currently set to MAPNAME = '" + MAPNAME + "', WIDTH = " + WIDTH + ", HEIGHT = " + HEIGHT + ". FILL_MODE is set to '" + FILL_MODE + "'.")
  draw()
  document.onkeypress = keyPress
}
