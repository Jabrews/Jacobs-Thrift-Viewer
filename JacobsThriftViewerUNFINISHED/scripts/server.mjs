// Importing required packages
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

// Create an Express app
const app = express();

// Use CORS middleware
app.use(cors());

// Define a route to handle the request
app.get('/etsy-proxy', async (req, res) => {
    try {
        // Replace this with the Etsy API endpoint you need
        const url = 'https://api.etsy.com/v3/application/listings/active?keywords=shirt&limit=10&offset=0';

        // Make a request to Etsy API
        const response = await fetch(url, {
            headers: {
                'x-api-key': 'uljbounhcqz9kqlnil1heemp' // Add your API key here
            },
        });

        // Parse the JSON response
        const data = await response.json();

        // Send the response to the client
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from Etsy:', error);
        res.status(500).send('Error fetching data from Etsy');
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
