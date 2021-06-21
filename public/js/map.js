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

/*
sync swapMap(portal) {
    console.log("new map = " + this.portals[portal])
    await this.saveMap()
    await loadMap(this.portals[portal])
    console.log(this.name)
  }
*/
}
