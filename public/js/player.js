class Player {
  constructor(x,y) {
    this.x = x
    this.y = y
    this.hp = 11 + Math.floor(Math.random()*6)
  }

  checkForPortal(y,x) {
    let str = y+","+x
    //console.log("checking for portal at " + str)
    if(str in ACTIVE_MAP.portals) {
      //console.log("PORTAL!!!!");
      return true
    } else {
      return false
    }
  }

  moveLeft() {
    x = this.x - 1;
    if (x < 0) {
      x=0;
    }
    let tile = ACTIVE_MAP.tiles[this.y][x];
    if (MOVEMENT_BLOCKING_TILES.includes(tile)) {
      x=this.x;
      startMusic(blockedSound, false);
    }
    if (this.checkForPortal(x,this.y)) {
      console.log("Need to switch maps");
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
    if (this.checkForPortal(x,this.y)) {
      console.log("Need to switch maps");
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
      y=this.y;
      startMusic(blockedSound, false);
    }
    if (this.checkForPortal(this.x,y)) {
      console.log("Need to switch maps");
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
    if (this.checkForPortal(this.x,y)) {
      console.log("Need to switch maps");
    }
    else {
      this.y = y;
    }
  }
}
