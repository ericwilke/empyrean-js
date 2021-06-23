class Player {
  constructor() {
    this.x
    this.y
    this.currentmap
    this.hp = 11 + Math.floor(Math.random()*6)
    this.magic = 12 + Math.floor(Math.random()*8)
    this.regenerate = 0
    this.max_hp = this.hp
    this.max_magic = this.magic
    this.hp_regen = 3
    this.magic_regen = 3
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
    if (ACTIVE_MAP.validTile(x, this.y)) {
      const portal = this.checkForPortal(x,this.y)
      if (portal != null) {
        //console.log("TEST for LOAD: Need to switch maps");
        PLAYER.currentmap = portal
        ACTIVE_MAP.saveMap()
        activateMap(portal)
      } else { this.x = x}
    } else {
        startMusic(blockedSound, false);
    }
  }

  moveRight() {
    x = this.x + 1;
    if (x > MAP_WIDTH-1) {
      x = MAP_WIDTH-1;
    }
    if (ACTIVE_MAP.validTile(x, this.y)) {
      const portal = this.checkForPortal(x,this.y)
      if (portal != null) {
        PLAYER.currentmap = portal
        ACTIVE_MAP.saveMap()
        activateMap(portal)
      } else { this.x = x}
    } else {
        startMusic(blockedSound, false);
    }
  }

  moveUp() {
    y = this.y - 1;
    if (y < 0) {
      y = 0;
    }
    if (ACTIVE_MAP.validTile(this.x, y)) {
      const portal = this.checkForPortal(this.x,y)
      if (portal != null) {
        PLAYER.currentmap = portal
        ACTIVE_MAP.saveMap()
        activateMap(portal)
      } else { this.y = y}
    } else {
        startMusic(blockedSound, false);
    }
  }

  moveDown() {
    y = this.y + 1;
    if (y > MAP_HEIGHT-1) {
      y = MAP_HEIGHT-1;
    }
    if (ACTIVE_MAP.validTile(this.x, y)) {
      const portal = this.checkForPortal(this.x,y)
      if (portal != null) {
        PLAYER.currentmap = portal
        ACTIVE_MAP.saveMap()
        activateMap(portal)
      } else { this.y = y}
    } else {
        startMusic(blockedSound, false);
    }
  }

}
