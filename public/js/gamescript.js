// EMPYREAN
//
// Author: Eric Wilke
//
// A Javascript browser game in the vain of Ultima.

// To Do:
//
// - adding in checks for difficult terrain (swamp, forest, hills)
// - adding modifications to stats based on items
// - save state of player
// - add combat
// - add inventory management
// - add spell casting and magic
// - buying and selling
// - map modifications based on NPCs and quests
// - questing system

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
let SHOW_CURSOR = false
let CURSOR_X = 0
let CURSOR_Y = 0
let REGENERATE_LEVEL = 50
let CONSOLE = document.getElementById("console")
let CONSOLE_TEXT
let GAME_MAPS = []
let MESSAGE = "Start your adventure!\nDanger awaits!";
let ITEM_EFFECTS = {"int": 0, "str": 0, "dex":0, "armor": 0, "melee": 0, "range": 0, "hp": 0, "magic": 0}
const THEMES = ["adventure (mellow)", "adventure (epic)", "adventure (dramtic)", "fantasy (epic)", "town", "village", "dungeon (mystical)", "dungeon (dark)", "tavern", "danger", "combat", "dungeon", "horror", "sewer"];
const VISON_BLOCKING_TILES = ["mountains", "door", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)", "secret wall (white square)", "secret wall (brown rough)","door-locked"];
const MOVEMENT_BLOCKING_TILES = ["mountains", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)", "water (deep)", "door-locked", "counter (vertical)", "counter (horizontal)"];

///////////////////////////////////////////////////////////

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function distance(x1, y1, x2, y2) {
  return Math.floor(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
}

function getItemEffects() {
  ITEM_EFFECTS = {"int": 0, "wis": 0, "str": 0, "dex":0, "armor": 0, "hp": 0, "magic": 0}
  for (item in PLAYER.inventory) {
    // check each player item and add the modifier to the ITEM_EFFECTS
    // look at the README.md before coding
  }
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
      case "dungeon (dark)":
        CURRENT_MUSIC = dungeonDarkMusic;
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
        COMBAT = false // allow for normal key input
        SHOW_CURSOR = false // stop showing attack cursor
        MESSAGE = "Nothing to attack" // default message
        for (let index in ACTIVE_MAP.monsters) {
          if ((ACTIVE_MAP.monsters[index].x == CURSOR_X) && (ACTIVE_MAP.monsters[index].y == CURSOR_Y)) {
            // attack target
            if (distance(PLAYER.x, PLAYER.y, ACTIVE_MAP.monsters[index].x, ACTIVE_MAP.monsters[index].y) <= WEAPONS[PLAYER.weapon].range) {
              MESSAGE = "Attacking the " + ACTIVE_MAP.monsters[index].tile + "... "
              let attackRoll = getRandomInt(1,20)
              let crit = false
              if (attackRoll == 20) { crit = true }
              switch (WEAPONS[PLAYER.weapon].type) {
                case "melee":
                  attackRoll += PLAYER.str
                  break
                case "range":
                  attackRoll += PLAYER.dex
                  break
              }
              attackRoll += WEAPONS[PLAYER.weapon].bonus
              //console.log("attack roll = " + attackRoll)
              //console.log("monster armor class = " + MONSTERS[ACTIVE_MAP.monsters[index].tile].armor_class)
              if (attackRoll >= MONSTERS[ACTIVE_MAP.monsters[index].tile].armor_class) {
                // Hit!!
                if (WEAPONS[PLAYER.weapon].type == "range") {startMusic(bowSound, false)}
                  else {startMusic(swordSound, false)}
                const damageTypes = (WEAPONS[PLAYER.weapon].damage).split("/")
                for (let i=0; i < damageTypes.length; i++) {
                  let damageStats = damageTypes[i].split("-")
                  let damageAmount = getRandomInt(1, parseInt(damageStats[1]))
                  if (crit) { damageAmount = damageAmount * 2; MESSAGE += " Critical hit!" }
                  // check for damage resistance by monster
                  if ((MONSTERS[ACTIVE_MAP.monsters[index].tile].resists).includes(damageStats[0])) {
                    damageAmount = Math.floor(damageAmount/2)
                  }
                  MESSAGE += "\nHit for " + damageAmount + " " + damageStats[0] + " damage!"
                  ACTIVE_MAP.monsters[index].hp -= damageAmount
                }
              } else { MESSAGE += "Missed!"; startMusic(missSound, false)}
            } else { MESSAGE = ACTIVE_MAP.monsters[index].tile + " is out of range."}
          }
          if (ACTIVE_MAP.monsters[index].hp < 1) {
            // monster killed!
            MESSAGE += "\nThe " + ACTIVE_MAP.monsters[index].tile + " was killed!"

            // add treasure

            // remove monster from array
            ACTIVE_MAP.monsters.splice(index, 1)
          }
        }
        break
      case "a":
        CURSOR_X--
        if (CURSOR_X < PLAYER.x - MAP_TILE_OFFSET) {
          CURSOR_X = PLAYER.x - MAP_TILE_OFFSET
        }
        break
      case "d":
        CURSOR_X++
        if (CURSOR_X > PLAYER.x + MAP_TILE_OFFSET) {
          CURSOR_X = PLAYER.x + MAP_TILE_OFFSET
        }
        break
      case "w":
        CURSOR_Y--
        if (CURSOR_Y < PLAYER.y - MAP_TILE_OFFSET) {
          CURSOR_Y = PLAYER.y - MAP_TILE_OFFSET
        }
        break
      case "s":
        CURSOR_Y++
        if (CURSOR_Y > PLAYER.y + MAP_TILE_OFFSET) {
          CURSOR_Y = PLAYER.y + MAP_TILE_OFFSET
        }
        break
      case " ":
        COMBAT = false
        SHOW_CURSOR = false
        MESSAGE = "Combat aborted"
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
        SHOW_CURSOR = true
        CURSOR_X = PLAYER.x
        CURSOR_Y = PLAYER.y
        MESSAGE = "ATTACK: select target, then press ENTER"
        break
      case "+":
        MESSAGE = "Game saved...";
        await ACTIVE_MAP.saveMap();
        break;
      }
  }
  // move npcs and monsters
  if (!COMBAT) {
    moveNpc();
    monsterMoveAndAttack()
    spawnMonster()
  }

  PLAYER.regenerate++
  if (PLAYER.regenerate > REGENERATE_LEVEL) {
    PLAYER.hp = PLAYER.hp + PLAYER.hp_regen
    if (PLAYER.hp > PLAYER.max_hp + ITEM_EFFECTS["hp"]) { PLAYER.hp = PLAYER.max_hp + ITEM_EFFECTS["hp"] }
    PLAYER.magic = PLAYER.magic + PLAYER.magic_regen
    if (PLAYER.magic > PLAYER.max_magic + ITEM_EFFECTS["magic"]) { PLAYER.magic = PLAYER.max_magic + ITEM_EFFECTS["magic"] }
    PLAYER.regenerate = 0
  }
  CONSOLE_TEXT = "<h1>Stats</h1><hr>"
  if (PLAYER.hp < 5) {
    CONSOLE_TEXT += "<span style='background-color:red; color:white;'> HP: " + PLAYER.hp + "</span>"
  } else { CONSOLE_TEXT += "HP: " + PLAYER.hp }
  CONSOLE_TEXT += " / MAGIC: " + PLAYER.magic
  CONSOLE_TEXT += "<br>STR: +" + PLAYER.str + " / DEX: +" + PLAYER.dex
  CONSOLE_TEXT += "<br>INT: +" + PLAYER.int + " / WIS: +" + PLAYER.wis
  CONSOLE_TEXT += "<hr><h3>Weapon: " + PLAYER.weapon + "</h3>"
  CONSOLE_TEXT += "<hr><h3>Inventory:</h3>"
  CONSOLE_TEXT += "<br><hr><h3>Spells:</h3>"
  CONSOLE.innerHTML = CONSOLE_TEXT

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
