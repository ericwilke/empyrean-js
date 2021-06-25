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
            drawTile = tile_wall_brown_rough
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
    if ((ACTIVE_MAP.npcs[index].x > PLAYER.x - MAP_TILE_OFFSET - 1) &&
        (ACTIVE_MAP.npcs[index].x < PLAYER.x + MAP_TILE_OFFSET + 1) &&
        (ACTIVE_MAP.npcs[index].y > PLAYER.y - MAP_TILE_OFFSET - 1) &&
        (ACTIVE_MAP.npcs[index].y < PLAYER.y + MAP_TILE_OFFSET + 1) &&
        (isPointVisible(ACTIVE_MAP.npcs[index].x,ACTIVE_MAP.npcs[index].y,PLAYER.x,PLAYER.y))) {
          let drawTile = null
          switch (ACTIVE_MAP.npcs[index].tile) {
            case "king":
              drawTile = tile_king
              break
            case "castle guard":
              drawTile = tile_castle_guard
              break
            case "old man":
              drawTile = tile_old_man
              break
            case "commoner 1":
              drawTile = tile_commoner_1
              break
            case "commoner 2":
              drawTile = tile_commoner_2
              break
            case "commoner 3":
              drawTile = tile_commoner_3
              break
            case "commoner 4":
              drawTile = tile_commoner_4
              break
            case "commoner 5":
              drawTile = tile_commoner_5
              break
            case "sign":
              drawTile = tile_sign
              break
            case "nobel":
              drawTile = tile_nobel
              break
          }
          ctx.drawImage(drawTile, (360 - (PLAYER.x - ACTIVE_MAP.npcs[index].x)*90), (360 - (PLAYER.y - ACTIVE_MAP.npcs[index].y)*90))
    }
  }

  //draw monsters
  for (let index = 0; index < ACTIVE_MAP.monsters.length; index++) {
    if ((ACTIVE_MAP.monsters[index].x > PLAYER.x - MAP_TILE_OFFSET - 1) &&
        (ACTIVE_MAP.monsters[index].x < PLAYER.x + MAP_TILE_OFFSET + 1) &&
        (ACTIVE_MAP.monsters[index].y > PLAYER.y - MAP_TILE_OFFSET - 1) &&
        (ACTIVE_MAP.monsters[index].y < PLAYER.y + MAP_TILE_OFFSET + 1) &&
        (isPointVisible(ACTIVE_MAP.monsters[index].x,ACTIVE_MAP.monsters[index].y,PLAYER.x,PLAYER.y))) {
          //calculate the screen x & y for the npc placement
          let drawTile = null
          //console.log(ACTIVE_MAP.monsters[index].tile + " at (" + ACTIVE_MAP.monsters[index].x + ", " + ACTIVE_MAP.monsters[index].y + ")");
          switch (ACTIVE_MAP.monsters[index].tile) {
            case "mummy":
              drawTile = tile_mummy
              break
            case "rat":
              drawTile = tile_rat
              break
            case "scorpion":
              drawTile = tile_scorpion
              break
            case "skeleton":
              drawTile = tile_skeleton
              break
            case "skeleton guard":
              drawTile = tile_skeleton_guard
              break
            case "zombie":
              drawTile = tile_zombie
              break
            case "zombie king":
              drawTile = tile_zombie_king
              break
            case "kobold":
              drawTile = tile_kobold
              break
            case "orc":
              drawTile = tile_orc
              break
            case "spider":
              drawTile = tile_spider
              break
            case "troll":
              drawTile = tile_troll
              break
            case "wyvern":
              drawTile = tile_wyvern
              break
          }
          if (drawTile) {
            ctx.drawImage(drawTile, (360 - (PLAYER.x - ACTIVE_MAP.monsters[index].x)*90), (360 - (PLAYER.y - ACTIVE_MAP.monsters[index].y)*90))
          }
    }
  }

  ctx.drawImage(tile_player, 360, 360);
  if (SHOW_CURSOR) {
    ctx.drawImage(tile_cursor, (360 - (PLAYER.x - CURSOR_X)*90), (360 - (PLAYER.y - CURSOR_Y)*90))
  }

  //ctx.fillText("Key press: " + KEY_PRESS, canvas.width/2 - 90, canvas.height/2 + 200);
  ctx.fillText("Player X,Y: " + PLAYER.x + ", " + PLAYER.y, canvas.width/2 - 90, canvas.height/2 + 240);
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
