const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.get('/results', (req, res) => {
    const filePath = path.join(__dirname, '240602_222823_R.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
