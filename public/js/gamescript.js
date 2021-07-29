// EMPYREAN
//
// Author: Eric Wilke
//
// A Javascript browser game in the vain of Ultima.

// To Do:
// - scolls with a spell name can teach player the spell
// - add monsters giving items to players when killed
// - complete attribute modifications based on items
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
let QUESTS = null

let DEAD = false
let TALK = false
let COMBAT = false
let CAST = false
let TRADE = false
let BUY_SELL_ACTIVE = false
let NPC_TRADE_INDEX = null
let BUY_SELL_CURSOR = 1
let BUY_SELL_COLUMN = "left"
let MANAGE_INVENTORY = false
let MANAGE_INV_CURSOR = 1
let ACTIVE_SPELL = ""
let SHOW_CURSOR = false
let CURSOR_X = 0
let CURSOR_Y = 0

let REGENERATE_LEVEL = 50
let CONSOLE = document.getElementById("console")
let CONSOLE_TEXT
let GAME_MAPS = []
let MESSAGE = "Start your adventure!\nDanger awaits!";
let ITEM_EFFECTS = {"int": 0, "wis": 0, "str": 0, "dex":0, "armor": 0, "hp": 0, "magic": 0}
const THEMES = ["adventure (mellow)", "adventure (epic)", "adventure (dramtic)", "fantasy (epic)", "town", "village", "dungeon (mystical)", "dungeon (dark)", "tavern", "danger", "combat", "dungeon", "horror", "sewer"];
const VISON_BLOCKING_TILES = ["mountains", "door", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)", "secret wall (white square)", "secret wall (brown rough)","door-locked","forest-pine", "forest-oak"];
const MOVEMENT_BLOCKING_TILES = ["mountains", "wall (white square)", "wall (white rough)", "wall (gray)", "wall (brown rough)", "water (deep)", "door-locked", "counter (vertical)", "counter (horizontal)"];
const DIFFICULT_TERRAIN = ["swamp", "water (shallow)", "desert", "forest-pine", "forest-oak", "forest-other"]

const MAX_INVENTORY_ITEMS = 8
const MAX_SPELLS = 3

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
    const regexNumber = /\+\d+/
    const regexTarget = /int|intelligence|str|strength|dex|dexterity|wis|wisdom|hp|health|magic|armor|protection/
    const amt = PLAYER.inventory[MANAGE_INV_CURSOR-3].toLowerCase().match(regexNumber)
    const tgt = PLAYER.inventory[MANAGE_INV_CURSOR-3].toLowerCase().match(regexTarget)
    if (tgt == "int" | tgt == "intelligence") {
      ITEM_EFFECTS.int += parseInt(amt)
    }
    if (tgt == "wis" | tgt == "wisdom") {
      ITEM_EFFECTS.wis += parseInt(amt)
    }
    if (tgt == "str" | tgt == "strength") {
      ITEM_EFFECTS.int += parseInt(amt)
    }
    if (tgt == "dex" | tgt == "dexterity") {
      ITEM_EFFECTS.int += parseInt(amt)
    }
    if (tgt == "armor" | tgt == "protection") {
      ITEM_EFFECTS.armor += parseInt(amt)
    }
    if (tgt == "hp" | tgt == "health") {
      ITEM_EFFECTS.hp += parseInt(amt)
    }
    if (tgt == "magic") {
      ITEM_EFFECTS.magic += parseInt(amt)
    }
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

function spellMod() {
  switch(SPELLS[ACTIVE_SPELL].modifier) {
    case "int":
      return PLAYER.int
      break
    case "wis":
      return PLAYER.wis
      break
  }
}

function buySellDisplay() {
  CONSOLE_TEXT = "<h1>++++ Buy / Sell ++++</h1><hr>"
  CONSOLE_TEXT += "Gold: " + PLAYER.gp + "<br>"
  CONSOLE_TEXT += "<table width='810'><tr><th>BUY</th><th>SELL</th></tr><tr><td style='padding: 15px; vertical-align: top; border: 1px solid black;'>"
  for (i=0; i<ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItems.length;i++) {
    if (BUY_SELL_COLUMN == "left" && BUY_SELL_CURSOR == i+1) {
      CONSOLE_TEXT += "▶︎ "
    }
    CONSOLE_TEXT += ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItems[i] + " (" + ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItemCosts[i] + " gp)<br>"
  }
  CONSOLE_TEXT += "</td><td style='padding: 15px; vertical-align: top; border: 1px solid black;'>"
  for (i=0; i<PLAYER.inventory.length;i++) {
    // need to calculate the price for different inventory (armor, weapon, item)
    if (BUY_SELL_COLUMN == "right" && BUY_SELL_CURSOR == i+1) {
      CONSOLE_TEXT += "▶︎ "
    }
    CONSOLE_TEXT += PLAYER.inventory[i] + " ("
    if (PLAYER.inventory[i] in ITEMS) {
      itemCostRange = ITEMS[PLAYER.inventory[i]].split(",")
      CONSOLE_TEXT += Math.floor(itemCostRange[0]/2)
    } else if (PLAYER.inventory[i] in WEAPONS) {
        itemCostRange = WEAPONS[PLAYER.inventory[i]].cost.split(",")
        CONSOLE_TEXT += Math.floor(itemCostRange[0]/2)
    } else if (PLAYER.inventory[i] in ARMOR) {
        itemCostRange = ARMOR[PLAYER.inventory[i]].cost.split(",")
        CONSOLE_TEXT += Math.floor(itemCostRange[0]/2)
    } else { CONSOLE_TEXT += "--" }
    CONSOLE_TEXT += " gp)<br>"
  }
  CONSOLE_TEXT += "</td></tr></table>"
  CONSOLE_TEXT += "<h3>[b]uy item / [p]eddle item / [q]uit</h3>"
  document.getElementById("text_screen").innerHTML = CONSOLE_TEXT
}

function inventorySpellManagement() {
  CONSOLE_TEXT = "<table width='810'><tr><td width='810'>"
  CONSOLE_TEXT += "<h1>++ Inventory / Spell Management ++</h1><hr>"
  if (MANAGE_INV_CURSOR == 1) {
    CONSOLE_TEXT += "▶︎ "
  }
  CONSOLE_TEXT += "<b>Weapon: </b>" + PLAYER.weapon + "<hr>"
  if (MANAGE_INV_CURSOR == 2) {
    CONSOLE_TEXT += "▶︎ "
  }
  CONSOLE_TEXT += "<b>Armor: </b>" + PLAYER.armor + "<hr>"
  CONSOLE_TEXT += "<h3>Inventory:</h3>"
  for (let i=0; i<PLAYER.inventory.length; i++) {
    if (MANAGE_INV_CURSOR == 3 + i) {
      CONSOLE_TEXT += "▶︎ "
    }
    CONSOLE_TEXT += PLAYER.inventory[i] + "<br>"
  }
  CONSOLE_TEXT += "<hr><h3>Spells:</h3>"
  for (let i=0; i<PLAYER.spells.length; i++) {
    if (MANAGE_INV_CURSOR == 3 + PLAYER.inventory.length + i) {
      CONSOLE_TEXT += "▶︎ "
    }
    CONSOLE_TEXT += PLAYER.spells[i] + "<br>"
  }
  CONSOLE_TEXT += "<hr><h4>Use 'w' and 's' to select</h4>"
  CONSOLE_TEXT += "<h4>[u]se item / [e]quip / [d]rop item / [f]orget spell / [q]uit</h4>"
  CONSOLE_TEXT += "</td></tr></table>"
  document.getElementById("text_screen").innerHTML = CONSOLE_TEXT
}

function statBlockDisplay() {
  CONSOLE_TEXT = "<hr>"
  if (PLAYER.hp < 5) {
    CONSOLE_TEXT += "<span style='background-color:red; color:white;'> HP: " + PLAYER.hp + "</span>"
  } else { CONSOLE_TEXT += "HP: " + PLAYER.hp }
  CONSOLE_TEXT += " / MAGIC: " + (PLAYER.magic + ITEM_EFFECTS.magic)
  CONSOLE_TEXT += "<br>STR: +" + (PLAYER.str + ITEM_EFFECTS.str) + " / DEX: +" + (PLAYER.dex + ITEM_EFFECTS.dex)
  CONSOLE_TEXT += "<br>INT: +" + (PLAYER.int + ITEM_EFFECTS.int) + " / WIS: +" + (PLAYER.wis + ITEM_EFFECTS.wis)
  CONSOLE_TEXT += "<br>Gold: " + PLAYER.gp
  CONSOLE_TEXT += "<hr><h3>Weapon: " + PLAYER.weapon + " +" + WEAPONS[PLAYER.weapon].bonus + "</h3>"
  CONSOLE_TEXT += "<hr><h3>Armor: " + PLAYER.armor + " +" + ITEM_EFFECTS.armor + "</h3>"
  CONSOLE_TEXT += "<hr><h3>Inventory: (max " + MAX_INVENTORY_ITEMS + ")</h3>"
  for (let i=0; i<PLAYER.inventory.length; i++) {
    CONSOLE_TEXT += "[" + (i+1) + "] " + PLAYER.inventory[i] + "<br>"
  }
  CONSOLE_TEXT += "<br><hr><h3>Spells: (max " + MAX_SPELLS + ")</h3>"
  for (let i=0; i<PLAYER.spells.length; i++) {
    CONSOLE_TEXT += "[" + (i+1) + "] " + PLAYER.spells[i] + "<br>"
  }
  CONSOLE.innerHTML = CONSOLE_TEXT
}

function splashScreen() {
  console.log("splashScreen()");

  statBlockDisplay()

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
    if (!DEAD) {
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
    } else {
      CURRENT_MUSIC = gameOverMusic
      startMusic(CURRENT_MUSIC)
    }
  }
}

async function gameLoop() {

  themeMusic()

  if (!DEAD) {
    if (COMBAT) {
      // deal with combat
      switch(KEY_PRESS) {
        case " ":
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
                    attackRoll += PLAYER.str + ITEM_EFFECTS.str
                    break
                  case "range":
                    attackRoll += PLAYER.dex + ITEM_EFFECTS.dex
                    break
                }
                attackRoll += WEAPONS[PLAYER.weapon].bonus
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
                    damageAmount = monsterDamageMod(index, damageAmount, damageStats[0])
                    MESSAGE += "\nHit for " + damageAmount + " " + damageStats[0] + " damage!"
                    ACTIVE_MAP.monsters[index].hp -= damageAmount
                  }
                } else { MESSAGE += "Missed!"; startMusic(missSound, false)}
              } else { MESSAGE = ACTIVE_MAP.monsters[index].tile + " is out of range."}
            }
            killMonster(index)
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
        case "Enter":
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
    } else if (CAST) {
      // deal with spell casting

      switch(KEY_PRESS) {
        case "Enter":
          CAST = false
          SHOW_CURSOR = false
          ACTIVE_SPELL = ""
          MESSAGE = "Cast aborted"
          break
        case "a":
          if (SHOW_CURSOR) {
            CURSOR_X--
            if (CURSOR_X < PLAYER.x - MAP_TILE_OFFSET) {
              CURSOR_X = PLAYER.x - MAP_TILE_OFFSET
            }
            if (distance(PLAYER.x,PLAYER.y,CURSOR_X,CURSOR_Y) > SPELLS[ACTIVE_SPELL].range) {
              CURSOR_X++
            }
          }
          break
        case "d":
          if (SHOW_CURSOR) {
            CURSOR_X++
            if (CURSOR_X > PLAYER.x + MAP_TILE_OFFSET) {
              CURSOR_X = PLAYER.x + MAP_TILE_OFFSET
            }
            if (distance(PLAYER.x,PLAYER.y,CURSOR_X,CURSOR_Y) > SPELLS[ACTIVE_SPELL].range) {
              CURSOR_X--
            }
          }
          break
        case "w":
          if (SHOW_CURSOR) {
            CURSOR_Y--
            if (CURSOR_Y < PLAYER.y - MAP_TILE_OFFSET) {
              CURSOR_Y = PLAYER.y - MAP_TILE_OFFSET
            }
            if (distance(PLAYER.x,PLAYER.y,CURSOR_X,CURSOR_Y) > SPELLS[ACTIVE_SPELL].range) {
              CURSOR_Y++
            }
          }
          break
        case "s":
          if (SHOW_CURSOR) {
            CURSOR_Y++
            if (CURSOR_Y > PLAYER.y + MAP_TILE_OFFSET) {
              CURSOR_Y = PLAYER.y + MAP_TILE_OFFSET
            }
            if (distance(PLAYER.x,PLAYER.y,CURSOR_X,CURSOR_Y) > SPELLS[ACTIVE_SPELL].range) {
              CURSOR_Y--
            }
          }
          break
        case "1":
          if (!SHOW_CURSOR) {
            ACTIVE_SPELL = PLAYER.spells[0]
            SHOW_CURSOR = true
          }
          break
        case "2":
          if (PLAYER.spells.length == 2 && !SHOW_CURSOR) {
            ACTIVE_SPELL = PLAYER.spells[1]
            SHOW_CURSOR = true
          }
          break
        case "3":
          if (PLAYER.spells.length == 3 && !SHOW_CURSOR) {
            ACTIVE_SPELL = PLAYER.spells[2]
            SHOW_CURSOR = true
          }
          break
        case "4":
          if (PLAYER.spells.length == 4 && !SHOW_CURSOR) {
            ACTIVE_SPELL = PLAYER.spells[3]
            SHOW_CURSOR = true
          }
          break
        case "5":
          if (PLAYER.spells.length == 5 && !SHOW_CURSOR) {
            ACTIVE_SPELL = PLAYER.spells[4]
            SHOW_CURSOR = true
          }
          break
        case "6":
          if (PLAYER.spells.length == 6 && !SHOW_CURSOR) {
            ACTIVE_SPELL = PLAYER.spells[5]
            SHOW_CURSOR = true
          }
          break
        case "7":
          if (PLAYER.spells.length == 7 && !SHOW_CURSOR) {
            ACTIVE_SPELL = PLAYER.spells[6]
            SHOW_CURSOR = true
          }
          break
        case "8":
          if (PLAYER.spells.length == 8 && !SHOW_CURSOR) {
            ACTIVE_SPELL = PLAYER.spells[7]
            SHOW_CURSOR = true
          }
          break
        case "9":
          if (PLAYER.spells.length == 9 && !SHOW_CURSOR) {
            ACTIVE_SPELL = PLAYER.spells[8]
            SHOW_CURSOR = true
          }
          break
        case " ":
          SHOW_CURSOR = false
          break
      }

      if (ACTIVE_SPELL != "") {
        if (PLAYER.magic >= SPELLS[ACTIVE_SPELL].cost) {
          MESSAGE = "Casting the " + ACTIVE_SPELL + " spell."
          if (SPELLS[ACTIVE_SPELL].targets != 1) {
            SHOW_CURSOR = false
          } else { MESSAGE += '\nSelect target and press SPACE BAR.' }
        } else {
          MESSAGE = "You do not have enough magic\nto cast " + ACTIVE_SPELL
          CAST = false
          SHOW_CURSOR = false
          ACTIVE_SPELL = ""
        }
      }

      // if activeSpell contains a spell, get the effect
      // set activeSpell to "" after effect and set CAST to false
      // if ACTIVE_SPELL != "" and SHOW_CURSOR = false, then that means a target was selected for a given spell
      if (ACTIVE_SPELL != "" && SHOW_CURSOR == false) {
        effect = getRandomInt(1, parseInt(SPELLS[ACTIVE_SPELL].damageAmount))
        switch (ACTIVE_SPELL) {
          case "heal":
            MESSAGE += "\nHealed " + effect + " hp."
            effect += spellMod()
            PLAYER.hp += effect
            if (PLAYER.hp > PLAYER.max_hp + ITEM_EFFECTS["hp"]) { PLAYER.hp = PLAYER.max_hp + ITEM_EFFECTS["hp"] }
            PLAYER.magic -= SPELLS[ACTIVE_SPELL].cost
            ACTIVE_SPELL = ""
            CAST = false
            break
          case "magic missile":
            effect = 0
            for (let index in ACTIVE_MAP.monsters) {
              if ((ACTIVE_MAP.monsters[index].x == CURSOR_X) && (ACTIVE_MAP.monsters[index].y == CURSOR_Y)) {
                // attack target
                let attackRoll = getRandomInt(1,20)
                attackRoll += PLAYER.int
                if (attackRoll >= MONSTERS[ACTIVE_MAP.monsters[index].tile].armor_class) {
                  effect = getRandomInt(1, parseInt(SPELLS[ACTIVE_SPELL].damageAmount))
                  effect += spellMod()
                  if (attackRoll == 20) {
                    effect = effect * 2
                    MESSAGE += "\nCritical hit!"
                  }
                  effect = monsterDamageMod(index, effect, SPELLS[ACTIVE_SPELL].damageType)
                  ACTIVE_MAP.monsters[index].hp -= effect
                  MESSAGE += "\nMagic Missile hit the " + ACTIVE_MAP.monsters[index].tile + " for\n" + effect + " " +SPELLS[ACTIVE_SPELL].damageType + " damage!"
                  killMonster(index)
                  PLAYER.magic -= SPELLS[ACTIVE_SPELL].cost
                  CAST = false
                  startMusic(magicMissileSound, false)
                } else {
                  MESSAGE += "\nMagic Missile attack missed..."
                  CAST = false
                }
              }
            }
            // if no targets, give message and reset
            if (effect == 0) {
              MESSAGE = "Nothing to attack"
              CAST = false
            }
            break
          case "holy light":
            i = 0
            for (let index in ACTIVE_MAP.monsters) {
              if (distance(PLAYER.x, PLAYER.y, ACTIVE_MAP.monsters[index].x, ACTIVE_MAP.monsters[index].y) <= SPELLS[ACTIVE_SPELL].range && i < SPELLS[ACTIVE_SPELL].targets) {
                effect = getRandomInt(1, parseInt(SPELLS[ACTIVE_SPELL].damageAmount))
                effect += spellMod()
                effect = monsterDamageMod(index, effect, SPELLS[ACTIVE_SPELL].damageType)
                ACTIVE_MAP.monsters[index].hp -= effect
                killMonster(index)
                i++
              }
            }
            MESSAGE += "\nRadiant light shoots out in all directions.\nYou hit " + i + " monsters."
            startMusic(holyLightSound, false)
            PLAYER.magic -= SPELLS[ACTIVE_SPELL].cost
            CAST = false
            ACTIVE_SPELL = ""
            break
          // ADD MORE SPELLS HERE!!!
        }
      }

    } else if (TRADE) {
        buySellDisplay()
        if (!BUY_SELL_ACTIVE) {
          MESSAGE = "\nWould you like to buy or sell something? (y)es (n)o"
        }
        switch(KEY_PRESS) {
          case "n":
            // start the buy dialog
            if (!BUY_SELL_ACTIVE) {
              TRADE = false
            }
            break;
          case "y":
            // start the sell dialog
            BUY_SELL_ACTIVE = true
            document.getElementById("main_screen").style.display = "none"
            document.getElementById("console").style.display = "none"
            document.getElementById("text_screen").style.display = "inline"
            break;
          case "w":
            if (BUY_SELL_ACTIVE) {
              BUY_SELL_CURSOR--
              if (BUY_SELL_CURSOR < 1) { BUY_SELL_CURSOR = 1 }
            }
            break
          case "s":
            if (BUY_SELL_ACTIVE) {
              BUY_SELL_CURSOR++
              if (BUY_SELL_COLUMN == "left") {
                if (BUY_SELL_CURSOR > ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItems.length) {
                  BUY_SELL_CURSOR = ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItems.length
                }
              }
              if (BUY_SELL_COLUMN == "right") {
                if (BUY_SELL_CURSOR > PLAYER.inventory.length) {
                  BUY_SELL_CURSOR = PLAYER.inventory.length
                }
              }
            }
            break
          case "d":
            if (BUY_SELL_ACTIVE) {
              if (PLAYER.inventory.length > 0 && BUY_SELL_COLUMN == "left") {
                BUY_SELL_COLUMN = "right"
                BUY_SELL_CURSOR = 1
              }
            }
            break
          case "a":
            if (BUY_SELL_ACTIVE) {
              if (ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItems.length > 0 && BUY_SELL_COLUMN == "right") {
                BUY_SELL_COLUMN = "left"
                BUY_SELL_CURSOR = 1
              }
            }
            break
          case "p": // peddle item
            if (BUY_SELL_ACTIVE && BUY_SELL_COLUMN == "right") {
              if (PLAYER.inventory[BUY_SELL_CURSOR-1] in ITEMS) {
                itemCostRange = ITEMS[PLAYER.inventory[BUY_SELL_CURSOR-1]].split(",")
                cost = Math.floor(itemCostRange[0]/2)
                PLAYER.gp += cost
                ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItems.push(PLAYER.inventory[BUY_SELL_CURSOR-1])
                cost = getRandomInt(itemCostRange[0], itemCostRange[1])
                ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItemCosts.push(cost)
                PLAYER.inventory.splice(BUY_SELL_CURSOR-1,1)
              } else if (PLAYER.inventory[BUY_SELL_CURSOR-1] in ARMOR) {
                  itemCostRange = ARMOR[PLAYER.inventory[BUY_SELL_CURSOR-1]].cost.split(",")
                  cost = Math.floor(itemCostRange[0]/2)
                  PLAYER.gp += cost
                  ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItems.push(PLAYER.inventory[BUY_SELL_CURSOR-1])
                  cost = getRandomInt(itemCostRange[0], itemCostRange[1])
                  ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItemCosts.push(cost)
                  PLAYER.inventory.splice(BUY_SELL_CURSOR-1,1)
              } else if (PLAYER.inventory[BUY_SELL_CURSOR-1] in WEAPONS) {
                  itemCostRange = WEAPONS[PLAYER.inventory[BUY_SELL_CURSOR-1]].cost.split(",")
                  cost = Math.floor(itemCostRange[0]/2)
                  PLAYER.gp += cost
                  ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItems.push(PLAYER.inventory[BUY_SELL_CURSOR-1])
                  cost = getRandomInt(itemCostRange[0], itemCostRange[1])
                  ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItemCosts.push(cost)
                  PLAYER.inventory.splice(BUY_SELL_CURSOR-1,1)
              }
            }
            break
          case "b": // buy item
            if (BUY_SELL_ACTIVE && BUY_SELL_COLUMN == "left") {
              if (ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItemCosts[BUY_SELL_CURSOR-1] > PLAYER.gp) {
                alert("You do not have enough gold to purchase that item.")
              } else {
                PLAYER.gp -= ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItemCosts[BUY_SELL_CURSOR-1]
                PLAYER.inventory.push(ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItems[BUY_SELL_CURSOR-1])
                ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItems.splice(BUY_SELL_CURSOR-1,1)
                ACTIVE_MAP.npcs[NPC_TRADE_INDEX].shopItemCosts.splice(BUY_SELL_CURSOR-1,1)
              }
            }
            break
          case "q":
            document.getElementById("main_screen").style.display = "inline"
            document.getElementById("console").style.display = "inline"
            document.getElementById("text_screen").style.display = "none"
            TRADE = false
            BUY_SELL_ACTIVE = false
            break;
          } // end switch statement
          buySellDisplay()
      } else if (MANAGE_INVENTORY) {
          inventorySpellManagement()
          switch(KEY_PRESS) {
            case "q":
              // exit Manage Inventory System
              MANAGE_INVENTORY = false
              document.getElementById("main_screen").style.display = "inline"
              document.getElementById("console").style.display = "inline"
              document.getElementById("text_screen").style.display = "none"
              break
            case "w":
              // move selection cursor up
              MANAGE_INV_CURSOR--
              if (MANAGE_INV_CURSOR < 1) {
                MANAGE_INV_CURSOR = 1
              }
              break
            case "s":
              // move selection cursor down
              MANAGE_INV_CURSOR++
              if (MANAGE_INV_CURSOR > 2 + PLAYER.inventory.length + PLAYER.spells.length) {
                MANAGE_INV_CURSOR = 2 + PLAYER.inventory.length + PLAYER.spells.length
              }
              break
            case "f":
              // forget spell
              if (MANAGE_INV_CURSOR > 2 + PLAYER.inventory.length) {
                if (confirm("Forget spell: " + PLAYER.spells[MANAGE_INV_CURSOR - 3 - PLAYER.inventory.length] + "?")) {
                  PLAYER.spells.splice(MANAGE_INV_CURSOR - 3 - PLAYER.inventory.length, 1)
                  MANAGE_INV_CURSOR = 1
                }
              }
              break
            case "d":
              // drop item
              if (MANAGE_INV_CURSOR < PLAYER.inventory.length + 3) {
                if(MANAGE_INV_CURSOR > 2) {
                  if (confirm("Drop item: " + PLAYER.inventory[MANAGE_INV_CURSOR - 3] + "?")) {
                    PLAYER.inventory.splice(MANAGE_INV_CURSOR -3, 1)
                    MANAGE_INV_CURSOR = 1
                  }
                } else if (MANAGE_INV_CURSOR == 1) {
                  // drop weapon
                  if (confirm("Drop weapon?")) {
                    PLAYER.weapon = "none"
                  }
                } else if (MANAGE_INV_CURSOR == 2) {
                  // drop armor'
                  if (confirm("Drop armor?")) {
                    PLAYER.armor = "none"
                  }
                }
              }
              break
            case "e":
              //equip weapon / armor
              if (MANAGE_INV_CURSOR > 2 && MANAGE_INV_CURSOR - 2 <= PLAYER.inventory.length) {
                // check to see if item is weapon or armor and then equip it
                if (PLAYER.inventory[MANAGE_INV_CURSOR-3] in ARMOR) {
                  //armor
                  const tempVal = PLAYER.armor
                  PLAYER.armor = PLAYER.inventory[MANAGE_INV_CURSOR-3]
                  if (tempVal == "none") {
                    PLAYER.inventory.splice(MANAGE_INV_CURSOR -3, 1)
                  } else { PLAYER.inventory[MANAGE_INV_CURSOR-3] = tempVal }
                } else if (PLAYER.inventory[MANAGE_INV_CURSOR-3] in WEAPONS) {
                  //weapon
                  const tempVal = PLAYER.weapon
                  PLAYER.weapon = PLAYER.inventory[MANAGE_INV_CURSOR-3]
                  if (tempVal == "none") {
                    PLAYER.inventory.splice(MANAGE_INV_CURSOR -3, 1)
                  } else { PLAYER.inventory[MANAGE_INV_CURSOR-3] = tempVal }
                } else {
                  alert("That item is neither weapon nor armor.")
                }
              }
              break
            case "u":
              //use an item
              const regexNumber = /\+\d+/
              const regexTarget = /int|intelligence|str|strength|dex|dexterity|wis|wisdom|hp|health|healing|magic/
              const amt = PLAYER.inventory[MANAGE_INV_CURSOR-3].toLowerCase().match(regexNumber)
              const tgt = PLAYER.inventory[MANAGE_INV_CURSOR-3].toLowerCase().match(regexTarget)
              if (PLAYER.inventory[MANAGE_INV_CURSOR-3].toLowerCase().includes("potion")) {
                //parse and find effect of potion
                if (tgt == "magic") {
                  PLAYER.magic += parseInt(amt)
                  if (PLAYER.magic > PLAYER.max_magic + ITEM_EFFECTS["magic"]) { PLAYER.magic = PLAYER.max_magic + ITEM_EFFECTS["magic"] }
                }
                if (tgt == "hp" | tgt == "health" | tgt == "healing") {
                  PLAYER.hp += parseInt(amt)
                  if (PLAYER.hp > PLAYER.max_hp + ITEM_EFFECTS["hp"]) { PLAYER.hp = PLAYER.max_hp + ITEM_EFFECTS["hp"] }
                }
                console.log("using potion... " + amt + " " + tgt)
                PLAYER.inventory.splice(MANAGE_INV_CURSOR -3, 1)
                MANAGE_INV_CURSOR = 1
              } else if (PLAYER.inventory[MANAGE_INV_CURSOR-3].toLowerCase().includes("scroll")) {
                  //parse and find effect of scroll
                  let learnSpellScroll = false
                  for (const spell in SPELLS) {
                    //teach player the spell from the scroll
                    if (PLAYER.inventory[MANAGE_INV_CURSOR-3].toLowerCase().includes(spell)) {
                      // check to see if the spell name is in the scroll
                      learnSpellScroll = true
                      if (!PLAYER.spells.includes(spell)) {
                        // player does not alreay know the spell
                        if (PLAYER.spells.length < MAX_SPELLS) {
                          PLAYER.spells.push(spell)
                          MESSAGE += "\nYou now know the " + spell + " spell"
                        } else { MESSAGE += "\nYou cannot learn another spell."}
                      }
                    }
                  }
                  if (!learnSpellScroll) {
                    if (tgt == "magic") {
                      PLAYER.max_magic += parseInt(amt)
                      PLAYER.magic = PLAYER.max_magic + ITEM_EFFECTS["magic"]
                    }
                    if (tgt == "hp" | tgt == "health") {
                      PLAYER.max_hp += parseInt(amt)
                      PLAYER.hp = PLAYER.max_hp + ITEM_EFFECTS["hp"]
                    }
                    if (tgt == "str" | tgt == "strength") {
                      PLAYER.str += parseInt(amt)
                    }
                    if (tgt == "int" | tgt == "intelligence") {
                      PLAYER.int += parseInt(amt)
                    }
                    if (tgt == "dex" | tgt == "dexterity") {
                      PLAYER.dex += parseInt(amt)
                    }
                    if (tgt == "wis" | tgt == "wisdom") {
                      PLAYER.wis += parseInt(amt)
                    }
                  }
                  console.log("using scroll... " + amt + " " + tgt)
                  PLAYER.inventory.splice(MANAGE_INV_CURSOR -3, 1)
                  MANAGE_INV_CURSOR = 1
              }
              break
            }  // end switch statment
            inventorySpellManagement()
          } // end MANAGE_INVENTORY
    else {
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
          MESSAGE = "ATTACK: select target, then press SPACE\nor ENTER to cancel"
          break
        case "c":
          if (PLAYER.spells.length == 0) {
            MESSAGE = "You do not have any spells available"
            CAST = false
            SHOW_CURSOR = false
            break
          } else {
            CAST = true
            ACTIVE_SPELL = ""
            CURSOR_X = PLAYER.x
            CURSOR_Y = PLAYER.y
            MESSAGE = "CAST SPELL: select spell number, then choose target\nor ENTER to cancel"
            break
          }
        case "+":
          MESSAGE = "Game saved...";
          console.log("need to save map...")
          ACTIVE_MAP.saveMap()
          console.log("map saved")
          PLAYER.save()
          console.log("player saved")
          saveQuests()
          console.log("quests saved")
          break;
        case "i":
          MANAGE_INVENTORY = true
          inventorySpellManagement()
          document.getElementById("console").style.display = "none"
          document.getElementById("main_screen").style.display = "none"
          document.getElementById("text_screen").style.display = "inline"
          break
        case "q":
          if (document.getElementById("main_screen").style.display == "inline") {
            document.getElementById("main_screen").style.display = "none"
            document.getElementById("text_screen").style.display = "inline"
          } else {
              document.getElementById("main_screen").style.display = "inline"
              document.getElementById("text_screen").style.display = "none"
          }
          CONSOLE_TEXT = "<table width='810'><tr><td><h2>QUESTS:</h2>"
          for (quest in QUESTS) {
            if (QUESTS[quest].status == "active") {
              CONSOLE_TEXT += "<h3>Active quest: " + quest + "</h3>"
              CONSOLE_TEXT += QUESTS[quest].start_message + "<hr>"
            } else if (QUESTS[quest].status == "completed") {
                CONSOLE_TEXT += "<h3>Completed quest: " + quest + "</h3><hr>"
                //CONSOLE_TEXT += QUESTS[quest].start_message + "<hr>"
            }
          }
          CONSOLE_TEXT += "</td></tr></table>"
          document.getElementById("text_screen").innerHTML = CONSOLE_TEXT
        }
    }

    // move npcs and monsters
    if (!COMBAT && !CAST && !TRADE &!MANAGE_INVENTORY) {
      moveNpc()
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
  }

  if (PLAYER.hp < 1) {
    PLAYER.hp =0
    DEAD = true
    MESSAGE = "The valiant adventurer is dead...\nPress ENTER to restart game from last save."
    if (KEY_PRESS == "Enter") {
      stopMusic(CURRENT_MUSIC)
      CURRENT_THEME = null
      location.reload()
    }
  }

  statBlockDisplay()

  draw();
  KEY_PRESS = null;
} // end gameLoop()

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
  PLAYER.save()
  saveQuests()
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

async function loadQuests() {
  console.log("=== loadQuests: START ===")
  try {
    const response = await fetch("/data/quests.json")
    QUESTS = await response.json()
  }
  catch(e) {
    MESSAGE += "\nCould not load quests.json file.\nCheck it for illegal escape chars."
    console.log(e)
  }
  console.log("=== loadQuests: END ===")
}

async function saveQuests() {
  console.log("starting quest save")
  const res = await fetch("/api/savequests", {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(QUESTS)
  })
  console.log("saved quests successfully")
}

async function loadConfig() {
  console.log("=== loadConfig: START ===")
  const response = await fetch("/data/config.json")
  const config = await response.json()

  for (let i=0; i < config.gamemaps.length; i++) {
    GAME_MAPS[i] = new Map(config.gamemaps[i])
    await GAME_MAPS[i].loadMap()
  }
  if (!PLAYER.currentmap) {
    PLAYER.currentmap = config.startingmap
  }
  console.log("[loadConfig] startingmap: " + PLAYER.currentmap)
  console.log("=== loadConfig: END ===")
  activateMap(PLAYER.currentmap)
}

function init() {
  // check for player file, if none, use the newly created player
  PLAYER = new Player()

  loadQuests()

  PLAYER.load().
    then(res => {
      loadConfig()
      console.log("PLAYER.currentmap = " + PLAYER.currentmap)
    }).then(res => {
      splashScreen()
    }).then(res => {
      document.onkeypress = keyPress;
    })
}
