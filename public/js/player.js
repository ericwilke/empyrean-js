class Player {
  constructor() {
    this.x
    this.y
    this.currentmap
    this.hp = 11 + Math.floor(Math.random()*6)
  }

  setPlayerMap(mapname) {
    this.currentmap = mapname
  }

  checkForPortal(y,x) {
    let str = y+","+x
    //console.log("checking for portal at " + str)
    if(str in ACTIVE_MAP.portals) {
      return ACTIVE_MAP.portals[str]
    } else {
      return null
    }
  }

  async moveLeft() {
    x = this.x - 1;
    if (x < 0) {
      x=0;
    }
    let tile = ACTIVE_MAP.tiles[this.y][x];
    if (MOVEMENT_BLOCKING_TILES.includes(tile)) {
      x=this.x;
      startMusic(blockedSound, false);
    }
    for (let index in ACTIVE_MAP.npcs) {
      if (x == ACTIVE_MAP.npcs[index].x && PLAYER.y == ACTIVE_MAP.npcs[index].y) {
        x = this.x
      }
    }
    for (let index = 0; index < ACTIVE_MAP.monsters.length; index++) {
      if (x == ACTIVE_MAP.monsters[index].x && PLAYER.y == ACTIVE_MAP.monsters[index].y) {
        x = this.x
      }
    }
    const portal = this.checkForPortal(x,this.y)
    if (portal != null) {
      console.log("TEST for LOAD: Need to switch maps");
      PLAYER.currentmap = portal
      ACTIVE_MAP.saveMap()
      activateMap(portal)
    }
    else {
      this.x = x;
    }
  }

  moveRight() {
    x = this.x + 1;
    if (x > MAP_WIDTH-1) {
      x = MAP_WIDTH-1;
    }
    let tile = ACTIVE_MAP.tiles[this.y][x];
    if (MOVEMENT_BLOCKING_TILES.includes(tile)) {
      x=this.x;
      startMusic(blockedSound, false);
    }
    for (let index in ACTIVE_MAP.npcs) {
      if (x == ACTIVE_MAP.npcs[index].x && PLAYER.y == ACTIVE_MAP.npcs[index].y) {
        x = this.x
      }
    }
    for (let index = 0; index < ACTIVE_MAP.monsters.length; index++) {
      if (x == ACTIVE_MAP.monsters[index].x && PLAYER.y == ACTIVE_MAP.monsters[index].y) {
        x = this.x
      }
    }
    const portal = this.checkForPortal(x,this.y)
    if (portal != null) {
      //console.log("Need to switch maps");
      ACTIVE_MAP.saveMap()
      activateMap(portal)
    }
    else {
      this.x = x;
    }
  }

  moveUp() {
    y = this.y - 1;
    if (y < 0) {
      y = 0;
    }
    let tile = ACTIVE_MAP.tiles[y][this.x];
    if (MOVEMENT_BLOCKING_TILES.includes(tile)) {
      //console.log("blocking tile: " + tile);
      y=this.y;
      startMusic(blockedSound, false);
    }
    for (let index in ACTIVE_MAP.npcs) {
      if (PLAYER.x == ACTIVE_MAP.npcs[index].x && y == ACTIVE_MAP.npcs[index].y) {
        y = this.y
      }
    }
    for (let index = 0; index < ACTIVE_MAP.monsters.length; index++) {
      if (PLAYER.x == ACTIVE_MAP.monsters[index].x && y == ACTIVE_MAP.monsters[index].y) {
        y = this.y
      }
    }
    const portal = this.checkForPortal(this.x,y)
    if (portal != null) {
      //console.log("Need to switch maps to " + portal);
      ACTIVE_MAP.saveMap()
      activateMap(portal)
    }
    else {
      this.y = y;
    }
  }

  moveDown() {
    y = this.y + 1;
    if (y > MAP_HEIGHT-1) {
      y = MAP_HEIGHT-1;
    }
    let tile = ACTIVE_MAP.tiles[y][this.x];
    if (MOVEMENT_BLOCKING_TILES.includes(tile)) {
      y=this.y;
      startMusic(blockedSound, false);
    }
    for (let index in ACTIVE_MAP.npcs) {
      if (PLAYER.x == ACTIVE_MAP.npcs[index].x && y == ACTIVE_MAP.npcs[index].y) {
        y = this.y
      }
    }
    for (let index = 0; index < ACTIVE_MAP.monsters.length; index++) {
      if (PLAYER.x == ACTIVE_MAP.monsters[index].x && y == ACTIVE_MAP.monsters[index].y) {
        y = this.y
      }
    }
    const portal = this.checkForPortal(this.x,y)
    if (portal != null) {
      console.log("Need to switch maps");
      ACTIVE_MAP.saveMap()
      activateMap(portal)
    }
    else {
      this.y = y;
    }
  }
}
