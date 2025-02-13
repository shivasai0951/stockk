const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const baseURL = 'https://www.nseindia.com';
const commonHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  'Referer': baseURL,
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive'
};

// Function to fetch cookies
async function getSessionCookies() {
  try {
    const response = await axios.get(baseURL, { headers: commonHeaders });
    return response.headers['set-cookie'];
  } catch (error) {
    console.error('Failed to fetch session cookies:', error.message);
    return null;
  }
}

// Fetch all indices
app.get('/api/nse-data', async (req, res) => {
  try {
    const cookies = await getSessionCookies();
    if (!cookies) {
      return res.status(500).json({ message: 'Failed to obtain session cookies.' });
    }

    const response = await axios.get(`${baseURL}/api/allIndices`, {
      headers: { ...commonHeaders, Cookie: cookies.join('; ') }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Failed to fetch NSE data:', error.message);
    res.status(500).json({ message: 'Unable to fetch NSE data.' });
  }
});

// Fetch specific index
app.get('/api/nse-index', async (req, res) => {
  const indexValue = req.query.index;

  if (!indexValue) {
    return res.status(400).json({ message: "The 'index' query parameter is required." });
  }

  try {
    const cookies = await getSessionCookies();
    if (!cookies) {
      return res.status(500).json({ message: 'Failed to obtain session cookies.' });
    }

    const url = `${baseURL}/api/equity-stockIndices?index=${encodeURIComponent(indexValue)}`;
    const response = await axios.get(url, { headers: { ...commonHeaders, Cookie: cookies.join('; ') } });

    res.json(response.data);
  } catch (error) {
    console.error(`Failed to fetch data for index ${indexValue}:`, error.message);
    res.status(500).json({ message: 'Failed to fetch data from NSE equity-stockIndices API.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
