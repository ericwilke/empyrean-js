// EMPYREAN
//
// Author: Eric Wilke
//
// A Javascript browser game in the vein of Ultima.

console.log("=== START SCRIPT ===");

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
let ACTIVE_MAP_INDEX = 0
let PLAYER
let SPLASH_SCREEN = true;
let MAP_WIDTH = 0;
let MAP_HEIGHT = 0;
let CURRENT_MUSIC = null;
let CURRENT_THEME = null;
let GAME_MAPS = []
let MESSAGE = "Start your adventure!\nDanger awaits!";
const THEMES = ["adventure (mellow)", "adventure (epic)", "adventure (dramtic)", "fantasy (epic)", "town", "village", "dungeon (mystical)", "tavern", "danger", "combat", "dungeon", "horror", "sewer"];
const VISON_BLOCKING_TILES = ["mountains", "door", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)", "secret wall (white square)", "secret wall (brown rough)","door-locked"];
const MOVEMENT_BLOCKING_TILES = ["mountains", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)", "water (deep)", "door-locked", "counter (vertical)", "counter (horizontal)"];

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
  for(x = PLAYER.x - MAP_TILE_OFFSET; x < PLAYER.x + MAP_TILE_OFFSET + 1; x++) {
    screen_y = 0;
    for(y = PLAYER.y - MAP_TILE_OFFSET; y < PLAYER.y + MAP_TILE_OFFSET + 1; y++) {
      if(x >= 0 && y >=0 && x<MAP_WIDTH && y<MAP_HEIGHT && (isPointVisible(x,y,PLAYER.x,PLAYER.y)) ) {
        let drawTile, drawGrass = null
        switch(ACTIVE_MAP.tiles[y][x]) {
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
            drawTile = tile_secret_wall_brown_rough
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
        }
      if (drawGrass) {
        ctx.drawImage(tile_grass, screen_x*90, screen_y*90);
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

  //draw npcs
  for (let index in ACTIVE_MAP.npcs) {
    if ((ACTIVE_MAP.npcs[index].x > PLAYER.x - MAP_TILE_OFFSET) &&
        (ACTIVE_MAP.npcs[index].x < PLAYER.x + MAP_TILE_OFFSET) &&
        (ACTIVE_MAP.npcs[index].y > PLAYER.y - MAP_TILE_OFFSET) &&
        (ACTIVE_MAP.npcs[index].y < PLAYER.y + MAP_TILE_OFFSET) &&
        (isPointVisible(ACTIVE_MAP.npcs[index].x,ACTIVE_MAP.npcs[index].y,PLAYER.x,PLAYER.y))) {
          //calculate the screen x & y for the npc placement
          switch (ACTIVE_MAP.npcs[index].tile) {
            case "king":
              ctx.drawImage(tile_king, (360 - (PLAYER.x - ACTIVE_MAP.npcs[index].x)*90), (360 - (PLAYER.y - ACTIVE_MAP.npcs[index].y)*90))
              break
          }
    }
  }

  //draw monsters
  for (let index = 0; index < ACTIVE_MAP.monsters.length; index++) {
    //console.log(ACTIVE_MAP.monsters[i].name + " at (" + ACTIVE_MAP.monsters[i].x + ", " + ACTIVE_MAP.monsters[i].y + ")");
    if ((ACTIVE_MAP.monsters[index].x > PLAYER.x - MAP_TILE_OFFSET) &&
        (ACTIVE_MAP.monsters[index].x < PLAYER.x + MAP_TILE_OFFSET) &&
        (ACTIVE_MAP.monsters[index].y > PLAYER.y - MAP_TILE_OFFSET) &&
        (ACTIVE_MAP.monsters[index].y < PLAYER.y + MAP_TILE_OFFSET) &&
        (isPointVisible(ACTIVE_MAP.monsters[index].x,ACTIVE_MAP.monsters[index].y,PLAYER.x,PLAYER.y))) {
          //calculate the screen x & y for the npc placement
          let drawTile = null
          switch (ACTIVE_MAP.monsters[index].tile) {
            case "rat":
              drawTime = tile_rat
              break
            case "scorpion":
              drawTime = tile_scorpion
              break
            case "skeleton":
              drawTime = tile_skeleton
              break
            case "skeleton guard":
              drawTime = tile_skeleton_guard
              break
            case "zombie":
              drawTile = tile_zombie
              break
            case "zombie king":
              drawTile = tile_zombie_king
              break
          }
          if (drawTile) {
            ctx.drawImage(drawTile, (360 - (PLAYER.x - ACTIVE_MAP.monsters[index].x)*90), (360 - (PLAYER.y - ACTIVE_MAP.monsters[index].y)*90))
          }
    }
  }

  ctx.drawImage(tile_player, 360, 360);
  //ctx.fillText("Key press: " + KEY_PRESS, canvas.width/2 - 90, canvas.height/2 + 200);
  //ctx.fillText("Player X,Y: " + PLAYER.x + ", " + PLAYER.y, canvas.width/2 - 90, canvas.height/2 + 240);
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

function themeMusic() {
  if(!CURRENT_THEME) {
    if (CURRENT_MUSIC) { stopMusic(CURRENT_MUSIC) }
    switch (ACTIVE_MAP.music) {
      case "adventure (mellow)":
        CURRENT_MUSIC = mellowAdventureMusic;
        startMusic(CURRENT_MUSIC);
        break;
      case "adventure (dramtic)":
        CURRENT_MUSIC = dramaticAdventureMusic;
        startMusic(CURRENT_MUSIC);
        break;
      case "town":
        CURRENT_MUSIC = medievalThemeMusic;
        startMusic(CURRENT_MUSIC);
        break;
      case "adventure (epic)":
        CURRENT_MUSIC = epicAdventureMusic;
        startMusic(CURRENT_MUSIC);
        break;
      case "village":
        CURRENT_MUSIC = villageMusic;
        startMusic(CURRENT_MUSIC);
        break;
      case "dungeon (mystical)":
        CURRENT_MUSIC = dungeonMysticalMusic;
        startMusic(CURRENT_MUSIC);
        break;
    }
  }
}

async function gameLoop() {

  themeMusic()

  switch(KEY_PRESS) {
    case "a":
      PLAYER.moveLeft();
      break;

    case "d":
      PLAYER.moveRight();
      break;

    case "w":
      PLAYER.moveUp();
      break;

    case "s":
      PLAYER.moveDown();
      break;

    case "+":
      MESSAGE = "Game saved...";
      await ACTIVE_MAP.saveMap();
      break;

    case "1":
      activateMap("britania")
      break

    case "2":
      activateMap("castlebritania")
      break
  }
  draw();
  KEY_PRESS = null;
}

async function loadNewMap(name) {
  console.log("Player current map for attempted file load: " + PLAYER.currentmap);
  ACTIVE_MAP.loadMap(name).then(res => {
    PLAYER.x = ACTIVE_MAP.playerStartX
    PLAYER.y = ACTIVE_MAP.playerStartY
    MAP_WIDTH = ACTIVE_MAP.mapwidth
    MAP_HEIGHT = ACTIVE_MAP.mapheight
  })
}

function activateMap(name) {
  console.log("=== activateMap: START ===");
  for(let i=0; i<GAME_MAPS.length; i++) {
    console.log("GAME_MAPS.name = " + GAME_MAPS[i].name);
    console.log("name to match = " + name);
    if(GAME_MAPS[i].name == name) {
      console.log("[activateMap] Found target");
      console.log(GAME_MAPS[i].tiles)
      ACTIVE_MAP = GAME_MAPS[i]
      PLAYER.x = ACTIVE_MAP.playerStartX
      PLAYER.y = ACTIVE_MAP.playerStartY
      MAP_WIDTH = ACTIVE_MAP.mapwidth
      MAP_HEIGHT = ACTIVE_MAP.mapheight
      if(!SPLASH_SCREEN) { draw() }
      CURRENT_THEME = null
      themeMusic()
      break
    }
  }
  console.log("=== activateMap: END ===");
}

async function loadConfig() {
  console.log("=== loadConfig: START ===")
  const response = await fetch("/data/config.json")
  const config = await response.json()

  for (let i=0; i < config.gamemaps.length; i++) {
    GAME_MAPS[i] = new Map(config.gamemaps[i])
    await GAME_MAPS[i].loadMap()
  }
  PLAYER.currentmap = config.startingmap
  console.log("[loadConfig] startingmap: " + PLAYER.currentmap)
  console.log("=== loadConfig: END ===")
  // Need to resolve this Promise?
}

function init() {
  PLAYER = new Player()

/*
  loadConfig()
  activateMap(PLAYER.currentmap)
  splashScreen()
  document.onkeypress = keyPress
*/

  loadConfig().
    then(res => {
      activateMap(PLAYER.currentmap)
    }).then(res => {
      splashScreen()
    }).then(res => {
      document.onkeypress = keyPress;
    })


  //await loadNewMap(PLAYER.currentmap) // Change this to activate map
  //await activateMap(PLAYER.currentmap)
  //document.onkeypress = keyPress;
}
