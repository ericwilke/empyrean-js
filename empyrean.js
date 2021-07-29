const express = require('express')
const fs = require('fs')
//const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))
app.use(express.json())

app.get('/', (req, res) => {
  res.type('text/html')
  res.sendFile(__dirname + '/public/empyrean-splash.html');
  //res.sendFile(__dirname + '/public/empyrean.html');
})

app.get('/play', (req, res) =>{
  res.type('text/html')
  res.sendFile(__dirname + '/public/empyrean.html');
})

app.post('/api/savemap', (req, res) => {
  console.log("POST request (save map)")
  const jsonString = req.body
  saveJSON("/public/data/"+jsonString.name+".json", JSON.stringify(jsonString))
  console.log("Saved map: " + jsonString.name)
})

app.post('/api/saveplayer', (req, res) => {
  console.log("POST request (player save)")
  const jsonString = req.body
  saveJSON("/public/data/player.json", JSON.stringify(jsonString))
  console.log("Saved player data")
})

app.post('/api/savequests', (req, res) => {
  console.log("POST request (quests save)")
  const jsonString = req.body
  saveJSON("/public/data/QUESTS.json", JSON.stringify(jsonString))
  console.log("Saved quest data")
})

app.listen(port, () => console.log(`Express server started on port ${port}; ` + 'press Ctrl-C to terminate...'))

function saveJSON(url, jsonString) {
  fs.writeFile(__dirname + url, jsonString, err => {
    if(err) {
      console.log("Error writing file: ", err)
    } else {
      console.log("File saved successfully")
    }
  })
}
