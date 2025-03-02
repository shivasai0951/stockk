const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
connectDB();

app.use(cors());

app.use(bodyParser.json());

app.use("/api/users", userRoutes);

// NSE Base URL
const baseURL = 'https://www.nseindia.com';


const commonHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  'Referer': baseURL,
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Origin': baseURL,
  'Host': 'www.nseindia.com',
  'Upgrade-Insecure-Requests': '1'
};


// HTTPS Agent to bypass SSL (use with caution)
const httpsAgent = new https.Agent({  
  rejectUnauthorized: false
});

// Function to fetch session cookies
async function getSessionCookies() {
  try {
    console.log('Requesting session cookies...');
    const response = await axios.get(baseURL, {
      headers: commonHeaders,
      httpsAgent: httpsAgent,
      timeout: 10000  // 10 seconds timeout
    });

    console.log('Session cookies received:', response.headers['set-cookie']);
    return response.headers['set-cookie'];
  } catch (error) {
    console.error('Failed to fetch session cookies:', error.message);
    return null;
  }
}
http://localhost:3000/api/nse-equity/HDFCBANK

// Fetch all indices
app.get('/api/nse-data', async (req, res) => {
  try {
    const cookies = await getSessionCookies();
    if (!cookies) {
      return res.status(500).json({ message: 'Failed to obtain session cookies.' });
    }

    const response = await axios.get(`${baseURL}/api/allIndices`, {
      headers: { 
        ...commonHeaders, 
        Cookie: cookies.join('; ') 
      },
      httpsAgent: httpsAgent,
      timeout: 10000  // 10 seconds timeout
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
    const response = await axios.get(url, { 
      headers: { 
        ...commonHeaders, 
        Cookie: cookies.join('; ') 
      },
      httpsAgent: httpsAgent,
      timeout: 10000  // 10 seconds timeout
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Failed to fetch data for index ${indexValue}:`, error.message);
    res.status(500).json({ message: 'Failed to fetch data from NSE equity-stockIndices API.' });
  }
});

///get single data
app.get('/api/nse-equity/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol parameter is required.' });
    }

    const cookies = await getSessionCookies();
    if (!cookies) {
      return res.status(500).json({ message: 'Failed to obtain session cookies.' });
    }

    const response = await axios.get(`${baseURL}/api/quote-equity?symbol=${encodeURIComponent(symbol)}`, {
      headers: { 
        ...commonHeaders, 
        Cookie: cookies.join('; ') 
      },
      httpsAgent: httpsAgent,
      timeout: 10000  // 10 seconds timeout
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Failed to fetch NSE equity data for ${req.params.symbol}:`, error.message);
    res.status(500).json({ message: 'Unable to fetch NSE equity data.' });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




//mongodb+srv://marco:BATS6NnEYA9ybb@stockdb.hpatu.mongodb.net/
