// EMPYREAN
//
// Author: Eric Wilke
//
// A Javascript browser game in the vein of Ultima.

console.log("running game");

// Set up canvas DOM element.
// Tiles are 90x90 px.
// Screen is 9x9
let canvas = document.getElementById('main_screen');
let ctx = canvas.getContext('2d');
canvas.width = 810;
canvas.height = 810;

let MAP_TILE_OFFSET = 4; //This is the number of tiles to the left, right, above, and below of the player
let KEY_PRESS = null;
let ACTIVE_MAP
let SPLASH_SCREEN = true;
let MAP_WIDTH = 100;
let MAP_HEIGHT = 100;
let CURRENT_MUSIC = null;
let MESSAGE = "Start your adventure!\nDanger awaits!";
const THEMES = ["adventure (mellow)", "adventure (epic)", "town", "danger", "combat", "dungeon", "horror", "sewer"];
const VISON_BLOCKING_TILES = ["mountains", "door", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)"];
const MOVEMENT_BLOCKING_TILES = ["mountains", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)", "water (deep)"];

let CURRENT_THEME = THEMES[1];

///////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////

function Create2DArray(columns, rows) {
  let arr = new Array(rows);
  for (let i=0;i<rows;i++) {
     arr[i] = new Array(columns);
  }
  return arr;
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

  //startButton = document.getElementById("startButton");
  //startButton.remove();

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
      if(x >= 0 && y >=0 && x<MAP_WIDTH && y<MAP_HEIGHT && (isPointVisible(x,y,player.x,player.y)) ) {
        ctx.drawImage(tile_grass, screen_x*90, screen_y*90);
        switch(ACTIVE_MAP.tiles[y][x]) {
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
  ctx.fillText("Playing game: " + KEY_PRESS, canvas.width/2 - 90, canvas.height/2 + 200);
  ctx.fillText("Player X,Y: " + player.x + ", " + player.y, canvas.width/2 - 90, canvas.height/2 + 240);
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
      player.moveLeft();
      break;

    case "d":
      player.moveRight();
      break;

    case "w":
      player.moveUp();
      break;

    case "s":
      player.moveDown();
      break;
  }
  draw();
  KEY_PRESS = null;
}

async function readJson(url) {
  const response = await fetch(url)
  return response.json()
}

async function init() {

  ACTIVE_MAP = new Map("map1")
  ACTIVE_MAP.loadMap().then(res => {
    player.x = ACTIVE_MAP.playerStartX
    player.y = ACTIVE_MAP.playerStartY
    MAP_WIDTH = ACTIVE_MAP.width
    MAP_HEIGHT = ACTIVE_MAP.height
  })


  document.onkeypress = keyPress;
  player = new Player(3,3);
  splashScreen();
}
