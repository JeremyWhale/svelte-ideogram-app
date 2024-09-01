import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { apiKey } from './serverConfig.mjs';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  console.log('Received request to /generate');
  try {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const response = await fetch("https://api.ideogram.ai/generate", {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ideogram API error: ${response.status} ${response.statusText}`);
      console.error('Error details:', errorText);
      throw new Error(`Ideogram API responded with status: ${response.status}. Details: ${errorText}`);
    }

    const data = await response.json();
    console.log('Ideogram API response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Error in /generate route:', error);
    res.status(500).json({ error: error.message || 'An error occurred while processing your request.' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log(`Proxy server listening at http://0.0.0.0:3000`);
});
// Add this line to catch any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});