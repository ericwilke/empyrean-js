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
        if (new_y > ACTIVE_MAP.npcs[index].constrain_high_y) { new_y = ACTIVE_MAP.npcs[index].constrain_high_y }
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

function questCompleted(quest) {
  MESSAGE += QUESTS[quest].completed_message
  PLAYER.gp += QUESTS[quest].reward_gp
  QUESTS[quest].reward_gp = 0

  // change TILES
  if (Object.keys(QUESTS[quest].reward_change_tile).length > 0) {
    try {
      ACTIVE_MAP.tiles[QUESTS[quest].reward_change_tile.y][QUESTS[quest].reward_change_tile.x] = QUESTS[quest].reward_change_tile.value
    }
    catch {
      console.log("Failed to change tile. Check the 'reward_change_tile' field in the QUESTS.js file.")
    }
  }

  // add PORTALS
  if (Object.keys(QUESTS[quest].reward_add_portal).length > 0) {
    try {
      ACTIVE_MAP.portals[QUESTS[quest].reward_add_portal.xy] = QUESTS[quest].reward_add_portal.mapname
      for (i in ACTIVE_MAP.portals) {
        console.log(i)
      }
    }
    catch {
      console.log("Failed to all a portal. Check the 'reward_add_portal' field in the QUESTS.js file.")
    }
  }

  let itemCompleted = true
  let spellComplete = true

  if (QUESTS[quest].reward_items.length > 0 || QUESTS[quest].reward_spell != "") {
    // do not complete quest unless approved if there are items to give but inventory is full
    // also do not complete quest unless approved if there are spells to give but spell slots are full
    // NEVER give required quest items from a completed quest because if player drops item, cannot regain item
    //  -- give items
    //  -- teach spells
    console.log("Give items and teach spells")

    if ((QUESTS[quest].reward_items.length > 0) && ((PLAYER.inventory.length + QUESTS[quest].reward_items.length) <= MAX_INVENTORY_ITEMS)) {
      // give items to player
      console.log("total items from npc to give: " + (QUESTS[quest].reward_items.length))
      console.log("Max Inventory limit: " + MAX_INVENTORY_ITEMS)
      for (i=0; i<QUESTS[quest].reward_items.length; i++) {
        PLAYER.inventory.push(QUESTS[quest].reward_items[i])
      }
    } else if (QUESTS[quest].reward_items.length > 0) {
        comeBack = confirm("You do not have enough room in your invetory for me to give you something. I can give you " + QUESTS[quest].reward_items + ". Would you like to come back later for the items (CONFIRM for yes, CANCEL for no)?")
        if (!comeBack) {itemCompleted = false}
    }

    if ((PLAYER.spells.length < MAX_SPELLS) && (QUESTS[quest].reward_spell != "")) {
      // teach spell
      if (!PLAYER.spells.includes(QUESTS[quest].reward_spell)) {
        PLAYER.spells.push(QUESTS[quest].reward_spell)
      }
    } else if (PLAYER.spells.length == MAX_SPELLS && QUESTS[quest].reward_spell != "") {
      comeBack = confirm("You cannot learn another spell until you forget one. I can teach you " + QUESTS[quest].reward_spell + ". Would you like to come back later to learn the spell (CONFIRM for yes, CANCEL for no)?")
      if (!comeBack) {spellCompleted = false}
    }
  } // END: code block to check for completing quests due to giving items and teaching spells

  if (itemCompleted && spellCompleted) {
  QUESTS[quest].status = "completed"
    if (QUESTS[quest].reward_activate_quest != "") {
      try {
        QUEST[QUESTS[quest].reward_activate_quest].status = "active"
        MESSAGE += QUEST[QUESTS[quest].reward_activate_quest].start_message
      }
      catch {
        console.log("Failed to activate new quest. Check the 'reward_activate_quest' field in the QUESTS.js file.")
      }
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

    // Check for quests
    for (quest in QUESTS) {
      console.log("checking for quests...")
      // check to start a quest
      if (PLAYER.currentmap == QUESTS[quest].source_map) {
        // index = the NPC name (it is the key for the NPC dictionary)
        if (index == QUESTS[quest].source_npc) {
          // match on map and npc for quest

          // start quest from source_npc for pending quests with no dependencies
          if (QUESTS[quest].status == "pending" && QUESTS[quest].dependent_on_complete_quest == "") {
            console.log("Start a quest: " + quest)
            MESSAGE += "\n" + QUESTS[quest].start_message
            QUESTS[quest].status = "active"
          }

          // check for completing FIND quest
          let itemFound = false
          if (QUESTS[quest].status == "active" && QUESTS[quest].quest_type == "find") {
            for (i=0; i<PLAYER.inventory.length; i++) {
              if (PLAYER.inventory[i] == QUESTS[quest].item_target && !itemFound) {
                // needed item is in the inventory!
                PLAYER.inventory.splice(i,1)
                itemFound = true
                questCompleted(quest)
              }
            }
          }

          // check for completing KILL quest
          if (QUESTS[quest].status == "active" && QUESTS[quest].quest_type == "kill") {
            if (QUESTS[quest].kill_current_count >= QUESTS[quest].kill_quota) {
              questCompleted(quest)
            }
          }

          // check for quests that have a dependancy that has been complete, and activate new quest
          if (QUESTS[quest].status == "pending" && QUESTS[quest].dependent_on_complete_quest != "") {
            if (QUESTS[QUESTS[quest].dependent_on_complete_quest].status == "completed") {
              console.log("Start a quest: " + quest)
              MESSAGE += "\n" + QUESTS[quest].start_message
              QUESTS[quest].status = "active"
            }
          }

        } // end IF for source_npc

      }

      // check for completing TALK quest (must be on target map and talking to target npc with an active quest)
      if (QUESTS[quest].quest_type == "talk" && QUESTS[quest].status == "active") {
        if (index == QUESTS[quest].talk_target.npc && PLAYER.currentmap == QUESTS[quest].talk_target.mapname) {
          questCompleted(quest)
        }
      }
    }

    // Check to see if the NPC is a merchant
    if (ACTIVE_MAP.npcs[index].buy_sell == "yes") {
      if (!ACTIVE_MAP.npcs[index].shopItems) {
        ACTIVE_MAP.npcs[index].shopItems = []
        ACTIVE_MAP.npcs[index].shopItemCosts = []
      } else if (getRandomInt(1,100) == 1) {
          // 1 in 100 chance of wiping inventory and starting fresh
          ACTIVE_MAP.npcs[index].shopItems = []
          ACTIVE_MAP.npcs[index].shopItemCosts = []
      }
      if (ACTIVE_MAP.npcs[index].shopItems.length < 4) {
        // add items, armor, and weapons to the shop list with cost of each item
        const addItemNumber = getRandomInt(3,15)
        for (i=0; i<addItemNumber; i++) {
          const itemCat = getRandomInt(1,4)
          switch(true) {
            case (itemCat < 3): // pick from items
              choiceInt = getRandomInt(0,Object.keys(ITEMS).length-1)
              item = Object.keys(ITEMS)[choiceInt]
              //console.log("adding to shop:" + item)
              itemCostRange = ITEMS[item].split(",")
              cost = getRandomInt(parseInt(itemCostRange[0]), parseInt(itemCostRange[1]))
              ACTIVE_MAP.npcs[index].shopItems.push(item)
              ACTIVE_MAP.npcs[index].shopItemCosts.push(cost)
              break
            case (itemCat < 4): // pick from weapons
              choiceInt = getRandomInt(1,Object.keys(WEAPONS).length-1)
              item = Object.keys(WEAPONS)[choiceInt]
              itemCostRange = WEAPONS[item].cost.split(",")
              cost = getRandomInt(parseInt(itemCostRange[0]), parseInt(itemCostRange[1]))
              ACTIVE_MAP.npcs[index].shopItems.push(item)
              ACTIVE_MAP.npcs[index].shopItemCosts.push(cost)
              break
            case (itemCat < 5): // pick from armor
              choiceInt = getRandomInt(1,Object.keys(ARMOR).length-1)
              item = Object.keys(ARMOR)[choiceInt]
              itemCostRange = ARMOR[item].cost.split(",")
              cost = getRandomInt(parseInt(itemCostRange[0]), parseInt(itemCostRange[1]))
              ACTIVE_MAP.npcs[index].shopItems.push(item)
              ACTIVE_MAP.npcs[index].shopItemCosts.push(cost)
              break
          } // end switch
        }
      }
      TRADE = true
      NPC_TRADE_INDEX = index
      BUY_SELL_CURSOR = 1
      BUY_SELL_COLUMN = "left"
    }
  }
}
