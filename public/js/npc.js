function moveNpc(index) {
  // index = the index of the NPC

  // There are 5 types of movement for the NPCs:
  // 1. "static" -- stationary
  // 2. "random" -- can move anywhere that is valid
  // 3. "constrain" -- can move anywhere within certain x and y limits
  // 4. "pace-x" -- paces back and forth along an X-axis with contraints
  // 5. "pace-y" -- paces back and forth along an Y-axis with contraints

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

function talkToNpc(x, y, index) {
  // get x,y along with the index of npc and interact with player
  if (x == PLAYER.x && y == PLAYER.y) {
    if (ACTIVE_MAP.npcs[index].greeting.length > 0) {
      let msg = Math.floor(Math.random() * ACTIVE_MAP.npcs[index].greeting.length)
      MESSAGE = ACTIVE_MAP.npcs[index].greeting[msg]
    }
  }
}
