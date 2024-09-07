// server.js
const http = require('http');
const fs = require('fs'); // Required to read the CSS file

const server = http.createServer((req, res) => {
    console.log('*********', req.url)


    if (req.method === 'GET' && req.url === '/style.css') {
        // Serve the CSS file
        fs.readFile('./style.css', (err, data) => { // Read CSS file from the filesystem
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading CSS file.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data); // Send the CSS content
            }
        });

        return;
    }

    // Set response headers
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Streamed HTML Page with External CSS</title>
                <!-- Link to the external CSS file -->
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1>Streaming HTML Content with External CSS Styling</h1>
        `);


    // Simulate streaming data by sending chunks at intervals
    let counter = 0;
    const interval = setInterval(() => {
        counter++;
        res.write(`<p class="chunk">Chunk ${counter}: This is part of the streamed HTML content.</p>`); // Send a chunk of HTML content

        if (counter === 10) {  // Stop after 10 chunks
            clearInterval(interval);
            res.end();
        }
    }, 500); // Send a chunk every second
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});