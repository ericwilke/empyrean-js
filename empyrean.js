const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.type('text/html')
  res.sendFile(__dirname + '/public/empyrean-splash.html');
  //res.sendFile(__dirname + '/public/empyrean.html');
})

app.get('/play', (req, res) =>{
  res.type('text/html')
  res.sendFile(__dirname + '/public/empyrean.html');
})

app.listen(port, () => console.log('Express server started on port ${port}; ' + 'press Ctrl-C to terminate...'))

// comment here
