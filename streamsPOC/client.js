// client.js
const http = require('http');

// Make an HTTP GET request to the server
const req = http.request(
    {
        hostname: 'localhost',
        port: 3000,
        path: '/streams',
        method: 'GET',
    },
    (res) => {
        console.log(`Server Response Status: ${res.statusCode}`);
        console.log('Receiving data chunks:\n');

        // Set the encoding to receive data as a string
        res.setEncoding('utf8');

        // Listen for data chunks from the server
        res.on('data', (chunk) => {
            console.log('Received chunk:', chunk);
        });

        // Listen for the end of the response stream
        res.on('end', () => {
            console.log('End of data stream.');
        });
    }
);

req.on('error', (error) => {
    console.error(`Error with the request: ${error.message}`);
});

req.end(); // End the request