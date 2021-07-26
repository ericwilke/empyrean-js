class Player {
  constructor() {
    this.x
    this.y
    this.currentmap
    this.str = getRandomInt(0,3)
    this.dex = getRandomInt(0,3)
    this.int = getRandomInt(0,3)
    this.wis = getRandomInt(0,3)
    this.hp = 11 + Math.floor(Math.random()*6)
    this.magic = 12 + Math.floor(Math.random()*8)
    this.regenerate = 0
    this.max_hp = this.hp
    this.max_magic = this.magic
    this.hp_regen = 3
    this.magic_regen = 3
    this.weapon = "dagger"
    this.armor = "none"
    this.spells = []
    this.inventory = []
    this.gp = getRandomInt(5,20)
    this.armor_bonus = 0
    this.attack_bonus = 0
  }

  setPlayerMap(mapname) {
    this.currentmap = mapname
  }

  checkForPortal(x,y) {
    let str = x+","+y
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
        PLAYER.currentmap = portal
        ACTIVE_MAP.saveMap()
        activateMap(portal)
      } else {
        // check for difficut terrain
        if (ACTIVE_MAP.difficutTerrain(x, this.y)) {
          x = this.x
        }
        this.x = x
      }
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
      } else {
        // check for difficut terrain
        if (ACTIVE_MAP.difficutTerrain(x, this.y)) {
          x = this.x
        }
        this.x = x
      }
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
      } else {
        // check for difficut terrain
        if (ACTIVE_MAP.difficutTerrain(this.x, y)) {
          y = this.y
        }
        this.y = y
      }
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
      } else {
        // check for difficut terrain
        if (ACTIVE_MAP.difficutTerrain(this.x, y)) {
          y = this.y
        }
        this.y = y
      }
    } else {
        startMusic(blockedSound, false);
    }
  }

  async load() {
    console.log("Attempting to player data")
    try {
      const response = await fetch("/data/player.json")
      const data = await response.json()

      this.x = data.x
      this.y = data.y
      this.currentmap = data.currentmap
      this.str = data.str
      this.dex = data.dex
      this.int = data.int
      this.wis = data.wis
      this.hp = data.hp
      this.magic = data.magic
      this.regenerate = data.regenerate
      this.max_hp = data.max_hp
      this.max_magic = data.max_magic
      this.hp_regen = data.hp_regen
      this.magic_regen = data.magic_regen
      this.weapon = data.weapon
      this.armor = data.armor
      this.spells = data.spells
      this.inventory = data.inventory
      this.gp = data.gp
      this.armor_bonus = data.armor_bonus
      this.attack_bonus = data.attack_bonus

      console.log("[Player Class] successfully loaded player data")
    } catch (err) {
      console.log("no player file found")
    }

  }

  async save() {
    console.log("starting Player save")
    const res = await fetch("/api/saveplayer", {
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
    console.log("[Player Class] saved player successfully")
  }

}
