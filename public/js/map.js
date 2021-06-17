class Map {

  constructor(name) {
    this.name = name
    this.url = "/data/" + name + ".json"
  }

  async loadMap() {
    const response = await fetch(this.url)
    const data = await response.json()
    this.width = data.mapwidth
    this.height = data.mapheight

    this.playerStartX = data.playerStartX
    this.playerStartY = data.playerStartY

    this.tiles = new Array(this.height)
    for(let i=0; i<this.height; i++) {
      this.tiles[i] = new Array(this.width)
    }

    this.tiles = data.tiles
    this.portals = data.portals

    console.log("successfully loaded map data: " + this.name)
  }

  async saveMap() {

  }

  async swapMap() {

  }
}
