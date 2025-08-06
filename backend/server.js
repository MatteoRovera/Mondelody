const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Mondelody Backend API is running!' });
});

// Search and translate lyrics endpoint
app.post('/api/search-lyrics', async (req, res) => {
  try {
    const { title, artist } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and artist are required' });
    }

    console.log(`Searching for: "${title}" by ${artist}`);

    // This is where we'll implement the full workflow
    // For now, let's return a success response
    res.json({
      success: true,
      title,
      artist,
      message: 'Search endpoint is working!'
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});