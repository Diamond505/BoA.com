const ftp = require('ftp');
const fs = require('fs');

const ftpClient = new ftp();

const ftpConfig = {
    host: '176.57.160.46',
    user: 'gpftp290146210767690400',
    password: 'Y2RyKiyM'
};

ftpClient.on('ready', () => {
    ftpClient.list((err, files) => {
        if (err) throw err;

        // Filter out only JSON files if needed
        const jsonFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.json'));

        if (jsonFiles.length === 0) {
            console.log('No JSON files found on the server.');
            ftpClient.end();
            return;
        }

        // Sort files by modification time to get the latest one
        jsonFiles.sort((a, b) => b.date.getTime() - a.date.getTime());

        const latestFile = jsonFiles[0];
        const fileName = latestFile.name;

        console.log(`Downloading latest file: ${fileName}`);

        // Download the latest file
        ftpClient.get(fileName, (err, stream) => {
            if (err) throw err;
            stream.once('close', () => { 
                console.log(`Downloaded ${fileName} successfully.`);
                ftpClient.end(); 
            });
            stream.pipe(fs.createWriteStream(fileName));
        });
    });
});

ftpClient.connect(ftpConfig);
