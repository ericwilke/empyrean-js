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

  flag = true
  while (flag) {
    let choice = getRandomInt(0, ACTIVE_MAP.spawntypes.length - 1)
    let monstertype = ACTIVE_MAP.spawntypes[choice]
    flag = false
    console.log("picking monster type: "+ monstertype);
  }
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
          MESSAGE += "\n" + ACTIVE_MAP.monsters[index].tile + " attacks!"
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
