function moveNpc() {
  // index = the index of the NPC

  // There are 5 types of movement for the NPCs:
  // 1. "static" -- stationary
  // 2. "random" -- can move anywhere that is valid
  // 3. "constrain" -- can move anywhere within certain x and y limits
  // 4. "pace-x" -- paces back and forth along an X-axis with contraints
  // 5. "pace-y" -- paces back and forth along an Y-axis with contraints

  for (let index in ACTIVE_MAP.npcs) {
    let new_x = ACTIVE_MAP.npcs[index].x
    let new_y = ACTIVE_MAP.npcs[index].y
    let d = getRandomInt(-1, 1)

    switch(ACTIVE_MAP.npcs[index].movement) {
      case "static":
        break
      case "random":
        if (getRandomInt(1,2) == 1) {
          new_x += d
        } else {
          new_y += d
        }
        if (ACTIVE_MAP.validTile(new_x, new_y)) {
          ACTIVE_MAP.npcs[index].x = new_x
          ACTIVE_MAP.npcs[index].y = new_y
        }
        break
      case "constrain":
        if (getRandomInt(1,2) == 1) {
          new_x += d
        } else {
          new_y += d
        }
        if (new_x < ACTIVE_MAP.npcs[index].constrain_low_x) { new_x = ACTIVE_MAP.npcs[index].constrain_low_x }
        if (new_x > ACTIVE_MAP.npcs[index].constrain_high_x) { new_x = ACTIVE_MAP.npcs[index].constrain_high_x }
        if (new_y < ACTIVE_MAP.npcs[index].constrain_low_y) { new_y = ACTIVE_MAP.npcs[index].constrain_low_y }
        if (new_y < ACTIVE_MAP.npcs[index].constrain_high_y) { new_y = ACTIVE_MAP.npcs[index].constrain_high_y }
        if (ACTIVE_MAP.validTile(new_x, new_y)) {
          ACTIVE_MAP.npcs[index].x = new_x
          ACTIVE_MAP.npcs[index].y = new_y
        }
        break
      case "pace-x":
        new_x += ACTIVE_MAP.npcs[index].x_direction
        if (ACTIVE_MAP.validTile(new_x, new_y)) {
          ACTIVE_MAP.npcs[index].x = new_x
        } else {
            if (ACTIVE_MAP.npcs[index].x_direction == 0) {
              ACTIVE_MAP.npcs[index].x_direction = d
            } else {ACTIVE_MAP.npcs[index].x_direction = ACTIVE_MAP.npcs[index].x_direction * -1}
        }
        break
      case "pace-y":
      new_y += ACTIVE_MAP.npcs[index].y_direction
      if (ACTIVE_MAP.validTile(new_x, new_y)) {
        ACTIVE_MAP.npcs[index].y = new_y
      } else {
          if (ACTIVE_MAP.npcs[index].y_direction == 0) {
            ACTIVE_MAP.npcs[index].y_direction = d
          } else {ACTIVE_MAP.npcs[index].y_direction = ACTIVE_MAP.npcs[index].y_direction * -1}
      }
        break
    }
  }
}

function talkToNpc(x, y, index) {
  // get x,y along with the index of npc and interact with player
  if (x == PLAYER.x && y == PLAYER.y) {
    if (ACTIVE_MAP.npcs[index].greeting.length > 0) {
      let msg = Math.floor(Math.random() * ACTIVE_MAP.npcs[index].greeting.length)
      MESSAGE = ACTIVE_MAP.npcs[index].greeting[msg]
    }

    // Heal player
    if (ACTIVE_MAP.npcs[index].heal == "yes" && (PLAYER.hp < PLAYER.max_hp + ITEM_EFFECTS["hp"])) {
      MESSAGE += "\nLet me heal your wounds..."
      startMusic(healSound, false)
      PLAYER.hp = PLAYER.max_hp + ITEM_EFFECTS["hp"]
    }

    // Give items to player
    if (ACTIVE_MAP.npcs[index].give_item.length > 0) {
      for (let i=0; i<ACTIVE_MAP.npcs[index].give_item.length; i++) {
        // check to see if player is carrying too many items to take new item
        if (PLAYER.inventory.length < MAX_INVENTORY_ITEMS) {
          let itemToGive = ACTIVE_MAP.npcs[index].give_item[i].item
          // strip the "*" modifier if present and set the keepItemWithNPC flag to true
          let keepItemWithNPC = false
          if (itemToGive.includes("*")) {
            keepItemWithNPC = true
            // strip the "*"
            itemToGive = itemToGive.replace('*', '')
          }

          // check to see if item is already in inventory
          // also check to see if item in in the player's armor or weapons
          if (!PLAYER.inventory.includes(itemToGive)) {
            if ((PLAYER.weapon != itemToGive) && (PLAYER.armor != itemToGive)) {
              PLAYER.inventory.push(itemToGive)
              MESSAGE += "\n" + ACTIVE_MAP.npcs[index].give_item[i].msg
              if (!keepItemWithNPC) {
                //remove the item from the NPC list of items
                //will this mess up the for loop?
                ACTIVE_MAP.npcs[index].give_item.splice(i,1)
              }
            }
          }
        } else {
          // message that player is carrying too many items
          MESSAGE += "\nYou cannot carry any more items..."
        }
      }
    }

    // Teach new spell to player
    if (Object.keys(ACTIVE_MAP.npcs[index].teach_spell).length > 0) {
      // Check to see if player already knows the spell
      if (!PLAYER.spells.includes(ACTIVE_MAP.npcs[index].teach_spell["spell"])) {
        // Check to see if player has too many spells
        if (PLAYER.spells.length < MAX_SPELLS) {
          PLAYER.spells.push(ACTIVE_MAP.npcs[index].teach_spell["spell"])
          MESSAGE += "\n" + ACTIVE_MAP.npcs[index].teach_spell["msg"]
        } else {
          MESSAGE += "\nI would like to teach you the\nspell " + ACTIVE_MAP.npcs[index].teach_spell["spell"] + ", but you will\nneed to unlearn a spell first..."
        }
      }
    }

    if (ACTIVE_MAP.npcs[index].buy_sell == "yes") {
      TRADE = true
    }
  }
}
