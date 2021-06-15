class Map {
  constructor(src) {
    // Read in the JSON data from the src and parce into the map elements
    (fetch(src))
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status)
      }
      return response.json()
    })
    .then(json => {
      mapsrc = json
    })
    .catch(function() {
      consol.log()
    })
    this.width = mapsrc.width
    this.height = mapsrc.height
    this.tiles = Create2DArray(this.width, this.height)
    this.tiles = mapsrc.tiles
    console.log(this.tiles);
  }

  function Create2DArray(columns, rows) {
    let arr = new Array(rows);
    for (let i=0;i<rows;i++) {
       arr[i] = new Array(columns);
    }
    return arr;
  }
