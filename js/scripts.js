// EMPYREAN
//
// Author: Eric Wilke
//
// A Javascript browser game in the vein of Ultima.

console.log("running scripts");

// Set up canvas DOM element.
// Tiles are 90x90 px.
// Screen is 9x9
let canvas = document.getElementById('main_screen');
let ctx = canvas.getContext('2d');
canvas.width = 810;
canvas.height = 810;

let MAP_TILE_OFFSET = 4; //This is the number of tiles to the left, right, above, and below of the player
let KEY_PRESS = null;
let SPLASH_SCREEN = true;
let MAP_WIDTH = 100;
let MAP_HEIGHT = 100;
let CURRENT_MUSIC = null;
let MESSAGE = "Start your adventure!\nDanger awaits!";
const THEMES = ["adventure (mellow)", "adventure (epic)", "town", "danger", "combat", "dungeon", "horror", "sewer"];
const VISON_BLOCKING_TILES = ["mountains", "door", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)"];
const MOVEMENT_BLOCKING_TILES = ["mountains", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)", "water (deep)"];

let CURRENT_THEME = THEMES[1];

//const gameData = require("./data/map1.json");
console.log(gameData);

///////////////////////////////////////////////////////////

let map = Create2DArray(MAP_WIDTH, MAP_HEIGHT);

for (x=0; x<MAP_WIDTH; x++) {
  for (y=0; y<MAP_HEIGHT; y++) {
    let tile = Math.floor(Math.random()*16);
    switch (tile) {
      case 0:
        map[x][y] = "grass";
        break;
      case 1:
        map[x][y] = "mountains";
        break;
      case 2:
        map[x][y] = "desert";
        break;
      case 3:
        map[x][y] = "cave";
        break;
      case 4:
        map[x][y] = "forest-pine";
        break;
      case 5:
        map[x][y] = "forest-oak";
        break;
      case 6:
        map[x][y] = "forest-other";
        break;
      case 7:
        map[x][y] = "swamp";
        break;
      case 8:
        map[x][y] = "road (stone)";
        break;
      case 9:
        map[x][y] = "road (dirt)";
        break;
      case 10:
        map[x][y] = "wall (gray)";
        break;
      case 11:
        map[x][y] = "wall (white square)";
        break;
      case 12:
        map[x][y] = "wall (white rough)";
        break;
      case 13:
        map[x][y] = "wall (brown rough)";
        break;
      case 14:
        map[x][y] = "water (shallow)";
        break;
      case 15:
        map[x][y] = "water (deep)";
        break;
    }
  }
}

///////////////////////////////////////////////////////////

function Create2DArray(columns, rows) {
  let arr = new Array(rows);
  for (let i=0;i<rows;i++) {
     arr[i] = new Array(columns);
  }
  return arr;
}


// Bresenham-based supercover line algorithm

function getLine (x1, y1, x2, y2) {
  let points = [];
  let i;               // loop counter
  let ystep, xstep;    // the step on y and x axis
  let error;           // the error accumulated during the increment
  let errorprev;       // *vision the previous value of the error variable
  let y = y1, x = x1;  // the line points
  let ddy, ddx;        // compulsory variables: the double values of dy and dx
  let dx = x2 - x1;
  let dy = y2 - y1;
  points.push({x: x1, y: y1});
  // NB the last point can't be here, because of its previous point (which has to be verified)
  if (dy < 0) {
    ystep = -1;
    dy = -dy;
  } else {
      ystep = 1;
  }
  if (dx < 0){
    xstep = -1;
    dx = -dx;
  } else {
      xstep = 1;
  }
  ddy = 2 * dy;  // work with double values for full precision
  ddx = 2 * dx;
  if (ddx >= ddy) {  // first octant (0 <= slope <= 1)
    // compulsory initialization (even for errorprev, needed when dx==dy)
    errorprev = error = dx;  // start in the middle of the square
    for (i=0 ; i < dx ; i++) {  // do not use the first point (already done)
      x += xstep;
      error += ddy;
      if (error > ddx){  // increment y if AFTER the middle ( > )
        y += ystep;
        error -= ddx;
        // three cases (octant == right->right-top for directions below):
        if (error + errorprev < ddx)  // bottom square also
          points.push({x: x, y: y-ystep});
        else if (error + errorprev > ddx)  // left square also
          points.push({x: x-xstep, y: y});
        else {  // corner: bottom and left squares also
          points.push({x: x, y: y-ystep});
          points.push({x: x-xstep, y: y});
        }
      }
      points.push({x: x, y: y});
      errorprev = error;
    }
  } else {  // the same as above
    errorprev = error = dy;
    for (i=0 ; i < dy ; i++) {
      y += ystep;
      error += ddx;
      if (error > ddy) {
        x += xstep;
        error -= ddy;
        if (error + errorprev < ddy) {
          points.push({x: x-xstep, y: y});
        }
        else if (error + errorprev > ddy) {
          points.push({x: x, y: y-ystep});
        }
        else {
          points.push({x: x-xstep, y: y});
          points.push({x: x, y: y-ystep});
        }
      }
      points.push({x: x, y: y});
      errorprev = error;
    }
  }
  return points;
}

function isPointVisible(x1, y1, x2, y2) {
  // Determine if the line of sight it blocked. Return true if not blocked
  // otherwise return false.

  // Need to have equations for vertical line, horizontal line, and the
  // Bresenham's line algorithm

  // Handle vertical line
  if (x1 - x2 == 0) {
    let ystart = y1;
    let yend = y2;
    if (y2 < y1) {
      ystart = y2;
      yend = y1
    }
    for (let y=ystart; y<yend; y++) {
      if ((y != y1) && (y != y2)) {
        if (VISON_BLOCKING_TILES.includes(map[x1][y])) { // for now, 1 = mountains
          return false;
        }
      }
    }
  }

  // Handle horizontal line
  if (y1 - y2 == 0) {
    let xstart = x1;
    let xend = x2;
    if (x2 < x1) {
      xstart = x2;
      xend = x1
    }
    for (let x=xstart; x<xend; x++) {
      if ((x != x1) && (x != x2)) {
        if (VISON_BLOCKING_TILES.includes(map[x][y1])) { // for now, 1 = mountains
          return false;
        }
      }
    }
  }

  // Handle all other lines
  let linePoints = getLine(x1, y1, x2, y2);
  for (i=0; i<linePoints.length; i++) {
    if (linePoints[i].x != x1 && linePoints[i].y != y1) {
      if (VISON_BLOCKING_TILES.includes(map[linePoints[i].x][linePoints[i].y])) {
        return false;
      }
    }
  }

  return true;
}

function startMusic(src, loop = true) {
  //console.log("startMusic()");
  src.loop = loop;
  src.play();
}

function stopMusic(src) {
  src.pause();
}

function keyPress(event) {
  //KEY_PRESS = String.fromCharCode(event.keyCode);
  KEY_PRESS = event.key;
  //console.log("key press = " + KEY_PRESS);
  if(!SPLASH_SCREEN) {
    gameLoop();
  }
}

function splashScreen() {
  console.log("splashScreen()");

  startButton = document.getElementById("startButton");
  startButton.remove();

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //center_x = canvas.width/2;
  //center_y = canvas.height/2;
  let splash_image = new Image();
  splash_image.addEventListener('load', function() {
    ctx.drawImage(splash_image, (canvas.width/2)-(splash_image.width/2), (canvas.height/2)-(splash_image.height/2));
  }, false);
  splash_image.src = "img/logo-flames.png";
  startMusic(shortActionMusic, true);

  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Press any key to start", canvas.width/2, canvas.height/2 + 200);

  let playSplash = true;

  function awaitingKeypressToContinue() {
    if(KEY_PRESS) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stopMusic(shortActionMusic);
      SPLASH_SCREEN = false;
      draw();
    } else {
      setTimeout(awaitingKeypressToContinue, 200);
    }
  }
  awaitingKeypressToContinue();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  screen_x = 0;
  for(x = player.x - MAP_TILE_OFFSET; x < player.x + MAP_TILE_OFFSET + 1; x++) {
    screen_y = 0;
    for(y = player.y - MAP_TILE_OFFSET; y < player.y + MAP_TILE_OFFSET + 1; y++) {
      if(x >= 0 && y >=0 && x<100 && y<100 && (isPointVisible(x,y,player.x,player.y)) ) {
        ctx.drawImage(tile_grass, screen_x*90, screen_y*90);
        switch(map[x][y]) {
          case "grass":
            ctx.drawImage(tile_grass, screen_x*90, screen_y*90);
            break;
          case "mountains":
            ctx.drawImage(tile_mountains, screen_x*90, screen_y*90);
            break;
          case "desert":
            ctx.drawImage(tile_desert, screen_x*90, screen_y*90);
            break;
          case "cave":
            ctx.drawImage(tile_cave, screen_x*90, screen_y*90);
            break;
          case "forest-pine":
            ctx.drawImage(tile_forest_pine, screen_x*90, screen_y*90);
            break;
          case "forest-oak":
            ctx.drawImage(tile_forest_oak, screen_x*90, screen_y*90);
            break;
          case "forest-other":
            ctx.drawImage(tile_forest_other, screen_x*90, screen_y*90);
            break;
          case "swamp":
            ctx.drawImage(tile_swamp, screen_x*90, screen_y*90);
            break;
          case "road (stone)":
            ctx.drawImage(tile_road_stone, screen_x*90, screen_y*90);
            break;
          case "road (dirt)":
            ctx.drawImage(tile_road_dirt, screen_x*90, screen_y*90);
            break;
          case "wall (gray)":
            ctx.drawImage(tile_wall_gray, screen_x*90, screen_y*90);
            break;
          case "wall (brown rough)":
            ctx.drawImage(tile_wall_brown_rough, screen_x*90, screen_y*90);
            break;
          case "wall (white square)":
            ctx.drawImage(tile_wall_white_square, screen_x*90, screen_y*90);
            break;
          case "wall (white rough)":
            ctx.drawImage(tile_wall_white_rough, screen_x*90, screen_y*90);
            break;
          case "water (shallow)":
            ctx.drawImage(tile_water_shallow, screen_x*90, screen_y*90);
            break;
          case "water (deep)":
            ctx.drawImage(tile_water_deep, screen_x*90, screen_y*90);
            break;
          case "stairs":
            ctx.drawImage(tile_stairs, screen_x*90, screen_y*90);
            break;
          case "sign":
            ctx.drawImage(tile_sign, screen_x*90, screen_y*90);
            break;
          case "town":
            ctx.drawImage(tile_town, screen_x*90, screen_y*90);
            break;
          case "castle":
            ctx.drawImage(tile_castle, screen_x*90, screen_y*90);
            break;
          case "ruins":
            ctx.drawImage(tile_ruins, screen_x*90, screen_y*90);
            break;
          case "runestone":
            ctx.drawImage(tile_runestone, screen_x*90, screen_y*90);
            break;
          case "wood":
            ctx.drawImage(tile_wood, screen_x*90, screen_y*90);
            break;
        }
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
  ctx.drawImage(tile_player, 360, 360);
  //ctx.fillText("Playing game: " + KEY_PRESS, canvas.width/2 - 90, canvas.height/2 + 200);
  //ctx.fillText("Player X,Y: " + player.x + ", " + player.y, canvas.width/2 - 90, canvas.height/2 + 240);
  if (MESSAGE != "") {
    ctx.font = "30px Arial";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowColor="black";
    ctx.shadowBlur = 7;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    lines = MESSAGE.split("\n");
    spacing = 30;
    startY = (canvas.height)/2 + 90;
    longestLine = 0;
    for (i=0; i< lines.length; i++) {
      if (lines[i].length > longestLine) {
        longestLine = lines[i].length;
      }
    }
    startX = canvas.width/2;
    for (i=0; i < lines.length; i++) {
      ctx.fillText(lines[i], startX, startY);
      startY += spacing;
    }
    //ctx.fillText(MESSAGE, canvas.width/2 - 90, canvas.height/2 + 200);
    MESSAGE = "";
  }
}

function gameLoop() {
  if(!CURRENT_MUSIC) {
    switch (CURRENT_THEME) {
      case "adventure (mellow)":
        CURRENT_MUSIC = "adventure (mellow)";
        startMusic(mellowAdventureMusic);
        break;
      case "adventure (epic)":
        CURRENT_MUSIC = "adventure (epic)";
        startMusic(dramaticAdventureMusic);
        break;
    }
  }
  switch(KEY_PRESS) {
    case "a":
      player.moveLeft(map);
      break;

    case "d":
      player.moveRight(map);
      break;

    case "w":
      player.moveUp(map);
      break;

    case "s":
      player.moveDown(map);
      break;
  }
  draw();
  KEY_PRESS = null;
}

function init() {
    document.onkeypress = keyPress;
    player = new Player(MAP_WIDTH-20,MAP_HEIGHT-25);
    splashScreen();
}
