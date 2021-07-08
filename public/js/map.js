class Map {

  constructor(name) {
    this.name = name
  }

  async loadMap() {
    console.log("Attempting to load map: " + this.name)
    const response = await fetch("/data/"+this.name+".json")
    const data = await response.json()

    this.mapwidth = data.mapwidth
    this.mapheight = data.mapheight

    this.playerStartX = data.playerStartX
    this.playerStartY = data.playerStartY

    this.music = data.music

    this.npcs = data.npcs

    this.portals = data.portals
    this.lockedDoors = data.lockedDoors

    this.spawnfrequency = data.spawnfrequency
    this.spawntypes = data.spawntypes
    this.maxmonsters = data.maxmonsters
    this.monsters = data.monsters

    this.tiles = new Array(this.height)
    for(let i=0; i<this.height; i++) {
      this.tiles[i] = new Array(this.width)
    }
    this.tiles = data.tiles

    console.log("[Map Class] successfully loaded map data: " + this.name)
  }

  async saveMap() {
    this.playerStartX = PLAYER.x
    this.playerStartY = PLAYER.y
    const res = await fetch("/api/savemap", {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(this)
    })
    console.log("[Map Class] saved map successfully")
  }

  validTile(x,y) {
    //let returnValue = true
    if (x == PLAYER.x && y == PLAYER.y) { return false }

    let checkTile = ACTIVE_MAP.tiles[y][x]

    // add logic to handle locked doors and checking player inventory

    if (MOVEMENT_BLOCKING_TILES.includes(checkTile)) { return false }

    for (let index in ACTIVE_MAP.npcs) {
      if (x == ACTIVE_MAP.npcs[index].x && y == ACTIVE_MAP.npcs[index].y) {
        return false
      }
    }

    for (let index = 0; index < ACTIVE_MAP.monsters.length; index++) {
      if (x == ACTIVE_MAP.monsters[index].x && y == ACTIVE_MAP.monsters[index].y) {
        return false
      }
    }
    return true
  }

  difficutTerrain(x,y) {
    if(DIFFICULT_TERRAIN.includes(ACTIVE_MAP.tiles[y][x])) {
      if (getRandomInt(1,3) == 1) {
        return true
      } else {return false}
    } else {return false}
  }

}
