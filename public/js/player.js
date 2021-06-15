class Player {
  constructor(x,y) {
    this.x = x
    this.y = y
    this.hp = 11 + Math.floor(Math.random()*6)
  }

  moveLeft(map) {
    x = this.x - 1;
    if (x < 0) {
      x=0;
    }
    let tile = map[x][this.y];
    if (MOVEMENT_BLOCKING_TILES.includes(tile)) {
      x=this.x;
      startMusic(blockedSound, false);
    }
    this.x = x;
  }
  moveRight(map) {
    x = this.x + 1;
    if (x > MAP_WIDTH-1) {
      x = MAP_WIDTH-1;
    }
    let tile = map[x][this.y];
    if (MOVEMENT_BLOCKING_TILES.includes(tile)) {
      x=this.x;
      startMusic(blockedSound, false);
    }
    this.x = x;
  }
  moveUp(map) {
    y = this.y - 1;
    if (y < 0) {
      y = 0;
    }
    let tile = map[this.x][y];
    if (MOVEMENT_BLOCKING_TILES.includes(tile)) {
      y=this.y;
      startMusic(blockedSound, false);
    }
    this.y = y;
  }
  moveDown(map) {
    y = this.y + 1;
    if (y > MAP_HEIGHT-1) {
      y = MAP_HEIGHT-1;
    }
    let tile = map[this.x][y];
    if (MOVEMENT_BLOCKING_TILES.includes(tile)) {
      y=this.y;
      startMusic(blockedSound, false);
    }
    this.y = y;
  }
}
