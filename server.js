const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000; // Change this to any available port, e.g., 3001, 3002, etc.
const jsonFilePath = path.join(__dirname, 'path/to/your/json/file.json');

app.get('/api/latest-json', (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Unable to read file');
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (error) {
            res.status(500).send('Unable to parse JSON');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});