const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const PORT = 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET Route for notes.html
app.get('/notes', (req, res) => {
    console.log(`${req.method} request received`);
    res.sendFile(path.join(__dirname, '/public/notes.html'))  
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      });
});

app.post('/api/notes', (req, res) => {
    console.log(`${req.method} request received`);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error reading file');
        }
        // Parse JSON data into a JavaScript object
        const newNote = JSON.parse(data);
    
        // Add new data to JavaScript object
        const id = uuid();
        newNote.push({id, ...req.body});
    
        // Write updated data to file
        fs.writeFile('./db/db.json', JSON.stringify(newNote), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error writing file');
          }
          // Send success message
          res.send('Data written successfully');
        });
      });
});


app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
