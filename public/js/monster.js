// monster code

function spawnMonster () {
  if (ACTIVE_MAP.spawnfrequency == 0) { return }
  if (ACTIVE_MAP.monsters.legth + 1 >= ACTIVE_MAP.maxmonsters) { return }

  spawnroll = getRandomInt(1,100)
  if (spawnroll > ACTIVE_MAP.spawnfrequency) { return } //if the roll is higher than the frequency, no monster spawns

  let x = getRandomInt(0, MAP_WIDTH - 1)
  let y = getRandomInt(0, MAP_HEIGHT - 1)

  let flag = ACTIVE_MAP.validTile(x,y)

  while (!flag) {
    x = getRandomInt(0, MAP_WIDTH - 1)
    y = getRandomInt(0, MAP_HEIGHT - 1)
    flag = ACTIVE_MAP.validTile(x,y)
  }

  console.log("starting search for monster by frequency")
  flag = true
  let choice = 0
  while (flag) {
    let rarity = getRandomInt(1,100)
    choice = getRandomInt(0, ACTIVE_MAP.spawntypes.length - 1)
    if (rarity <= 60 && MONSTERS[ACTIVE_MAP.spawntypes[choice]].prevelance == "frequent") {
      flag = false
    }
    if (rarity > 60 && rarity <= 90 && MONSTERS[ACTIVE_MAP.spawntypes[choice]].prevelance == "common") {
      flag = false
    }
    if (rarity > 90 && rarity <= 99 && MONSTERS[ACTIVE_MAP.spawntypes[choice]].prevelance == "rare") {
      flag = false
    }
    if (rarity == 100 && MONSTERS[ACTIVE_MAP.spawntypes[choice]].prevelance == "very rare") {
      flag = false
    }
  }
  const hp_stat = MONSTERS[ACTIVE_MAP.spawntypes[choice]].hp
  const hp_range = hp_stat.split(":")
  const hp = getRandomInt(parseInt(hp_range[0]), parseInt(hp_range[1]))
  const newMonster = {"tile": ACTIVE_MAP.spawntypes[choice], "x": x, "y": y, "hp": hp}
  ACTIVE_MAP.monsters.push(newMonster)
  console.log("spawning " + ACTIVE_MAP.spawntypes[choice])
}

function killMonster(index) {
  if (ACTIVE_MAP.monsters[index].hp < 1) {
    // monster killed!
    MESSAGE += "\nThe " + ACTIVE_MAP.monsters[index].tile + " was killed!"
    // add treasure:
    // GOLD
    treasureStr = MONSTERS[ACTIVE_MAP.monsters[index].tile].gold.split(":")
    gold = getRandomInt(parseInt(treasureStr[0]), parseInt(treasureStr[1]))
    PLAYER.gp += gold
    MESSAGE += " Gained " + gold + " gold."

    //SPECIAL_ITEMS -- add to player inventory
    if (PLAYER.inventory.length < MAX_INVENTORY_ITEMS && MONSTERS[ACTIVE_MAP.monsters[index].tile].special_items != "") {
      PLAYER.inventory.push(MONSTERS[ACTIVE_MAP.monsters[index].tile].special_items)
      MESSAGE += "\n Added " + MONSTERS[ACTIVE_MAP.monsters[index].tile].special_items + " to inventory."
    }

    // check to see if monster is a kill targer for an active quest
    for (quest in QUESTS) {
      if (QUESTS[quest].status == "active" && QUESTS[quest].quest_type == "kill" && QUESTS[quest].kill_target == ACTIVE_MAP.monsters[index].tile) {
        QUESTS[quest].kill_current_count++
      }
    }

    // remove monster from array
    ACTIVE_MAP.monsters.splice(index, 1)
  }
}

function monsterDamageMod(index, dmgAmt, damageType) {
  if ((MONSTERS[ACTIVE_MAP.monsters[index].tile].resists).includes(damageType)) {
    dmgAmt = Math.floor(dmg/2)
    MESSAGE += "\n" + ACTIVE_MAP.monsters[index].tile + " resisted " + damageType + "damage."
  }
  if ((MONSTERS[ACTIVE_MAP.monsters[index].tile].weakness).includes(damageType)) {
    dmgAmt = dmgAmt * 2
    MESSAGE += "\n" + ACTIVE_MAP.monsters[index].tile + " has a weakness to " + damageType + "damage."
  }
  return dmgAmt
}

function monsterMoveAndAttack () {
  // If monster can see player, move toward player.
  //  Otherwise, move randomly.

  for (let index in ACTIVE_MAP.monsters) {
    if ((ACTIVE_MAP.monsters[index].x >= (PLAYER.x - MAP_TILE_OFFSET)) && (ACTIVE_MAP.monsters[index].x <= (PLAYER.x + MAP_TILE_OFFSET)) && (ACTIVE_MAP.monsters[index].y >= (PLAYER.y - MAP_TILE_OFFSET)) && (ACTIVE_MAP.monsters[index].y <= (PLAYER.y + MAP_TILE_OFFSET))) {
      // monster within range of vision
      let new_x = ACTIVE_MAP.monsters[index].x
      let new_y = ACTIVE_MAP.monsters[index].y
      let d = getRandomInt(1,2)
      if (isPointVisible(new_x, new_y, PLAYER.x, PLAYER.y)) {
        // monster can see player
        //let distance = Math.floor(Math.sqrt(Math.pow(new_x - PLAYER.x, 2) + Math.pow(new_y - PLAYER.y, 2)))
        let dist = distance(new_x, new_y, PLAYER.x, PLAYER.y)
        // if distance is greater than attack range, move monster
        // EDIT the "0" below to reflect the monster attack range
        if (dist > 1) {
          // move toward player
          if ((d == 1 && (new_x != PLAYER.x)) || (new_y == PLAYER.y)) {
            // move on x-axis
            if (new_x < PLAYER.x) { new_x++ }
            if (new_x > PLAYER.x) { new_x-- }
          } else {
            // move on y-axis
            if (new_y < PLAYER.y) { new_y++ }
            if (new_y > PLAYER.y) { new_y-- }
          }
          if (new_x < 0) { new_x = 0 }
          if (new_x > MAP_WIDTH - 1) {new_x = MAP_WIDTH - 1}
          if (new_y < 0) { new_y = 0 }
          if (new_y > MAP_HEIGHT - 1) {new_y = MAP_HEIGHT - 1}
          if (ACTIVE_MAP.validTile(new_x, new_y)) {
            ACTIVE_MAP.monsters[index].x = new_x
            ACTIVE_MAP.monsters[index].y = new_y
          }
        } else {
          // attack
          MESSAGE += "\nThe " + ACTIVE_MAP.monsters[index].tile + " attacks!"
          let attackRoll = getRandomInt(1,20) + MONSTERS[ACTIVE_MAP.monsters[index].tile].attack.bonus
          if (attackRoll >= ARMOR[PLAYER.armor].armor_class + ITEM_EFFECTS.armor) {
            let damageTotal = 0
            let damage = 0
            const damageStats = MONSTERS[ACTIVE_MAP.monsters[index].tile].attack.damage.split("/")
            for (i=0; i < damageStats.length; i++) {
              const damageInfo = damageStats[i].split("-")
              if (damageInfo[0].includes(ARMOR[PLAYER.armor].resists)) {
                damage = Math.floor((getRandomInt(1,damageInfo[1])+1)/2)
              } else { damage = getRandomInt(1,damageInfo[1])+1 }
              MESSAGE += "\nThe " + ACTIVE_MAP.monsters[index].tile + " hit for " + damage + " " + damageInfo[0] + " damage!"
              damageTotal += damage
              startMusic(hitInCombatSound, false)
            }
            PLAYER.hp -= damageTotal
          } else { MESSAGE += "\nThe " + ACTIVE_MAP.monsters[index].tile + " missed." }
        }
      } else {
        // monster cannot see player, move normally
        // EDIT: replace "true" with the monster's movement type
        if (true) {
          if (d == 1) {
            new_x = new_x + getRandomInt(-1,1)
          } else {
              new_y = new_y + getRandomInt(-1,1)
          }
          if (new_x < 0) { new_x = 0 }
          if (new_x > MAP_WIDTH - 1) {new_x = MAP_WIDTH - 1}
          if (new_y < 0) { new_y = 0 }
          if (new_y > MAP_HEIGHT - 1) {new_y = MAP_HEIGHT - 1}
          if (ACTIVE_MAP.validTile(new_x, new_y)) {
            ACTIVE_MAP.monsters[index].x = new_x
            ACTIVE_MAP.monsters[index].y = new_y
          }
        }
      }
    }
  }
}
