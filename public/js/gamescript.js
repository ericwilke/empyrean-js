// EMPYREAN
//
// Author: Eric Wilke
//
// A Javascript browser game in the vain of Ultima.

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
let TALK = false
let COMBAT = false
let GAME_MAPS = []
let MESSAGE = "Start your adventure!\nDanger awaits!";
const THEMES = ["adventure (mellow)", "adventure (epic)", "adventure (dramtic)", "fantasy (epic)", "town", "village", "dungeon (mystical)", "tavern", "danger", "combat", "dungeon", "horror", "sewer"];
const VISON_BLOCKING_TILES = ["mountains", "door", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)", "secret wall (white square)", "secret wall (brown rough)","door-locked"];
const MOVEMENT_BLOCKING_TILES = ["mountains", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)", "water (deep)", "door-locked", "counter (vertical)", "counter (horizontal)"];

///////////////////////////////////////////////////////////

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
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

  if (COMBAT) {
    // deal with combat
    switch(KEY_PRESS) {
      case "Enter":
        COMBAT = false
        MESSAGE = "Target selected..."
        break
    }
  } else if (TALK) {
    // deal with talking to npcs
    switch(KEY_PRESS) {
      case "a":
        // talk left
        for (let index in ACTIVE_MAP.npcs) {
          talkToNpc(ACTIVE_MAP.npcs[index].x + 1, ACTIVE_MAP.npcs[index].y, index)
        }
        TALK = false
        break;
      case "d":
        // talk right
        for (let index in ACTIVE_MAP.npcs) {
          talkToNpc(ACTIVE_MAP.npcs[index].x - 1, ACTIVE_MAP.npcs[index].y, index)
        }
        TALK = false
        break;
      case "w":
        //talk up
        for (let index in ACTIVE_MAP.npcs) {
          talkToNpc(ACTIVE_MAP.npcs[index].x, ACTIVE_MAP.npcs[index].y + 1, index)
        }
        TALK = false
        break;
      case "s":
        // talk down
        for (let index in ACTIVE_MAP.npcs) {
          talkToNpc(ACTIVE_MAP.npcs[index].x, ACTIVE_MAP.npcs[index].y - 1, index)
        }
        TALK = false
        break;
      }
  } else {
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
      case "t":
        TALK = true
        MESSAGE = "TALK: pick direction"
        break;
      case " ":
        COMBAT = true
        MESSAGE = "ATTACK: select target"
        break
      case "+":
        MESSAGE = "Game saved...";
        await ACTIVE_MAP.saveMap();
        break;
      }
  }
  // move npcs
  for (let index in ACTIVE_MAP.npcs) {
    moveNpc(index)
    //console.log("moving NPC: " + index);
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
      //console.log(GAME_MAPS[i].tiles)
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

  loadConfig().
    then(res => {
      activateMap(PLAYER.currentmap)
    }).then(res => {
      splashScreen()
    }).then(res => {
      document.onkeypress = keyPress;
    })
}
