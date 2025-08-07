const express = require('express');
const cors = require('cors');
const LyricsScraper = require('./scraper');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const scraper = new LyricsScraper();

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

    console.log(`🎵 Processing request: "${title}" by ${artist}`);

    // Step 1: Search for French lyrics
    console.log('📡 Step 1: Searching for French lyrics...');
    const lyricsResult = await scraper.searchFrenchLyrics(title, artist);

    if (!lyricsResult.success) {
      return res.status(404).json({ 
        error: 'Could not find lyrics for this song',
        details: lyricsResult.error 
      });
    }

    // Step 2: For now, return the original lyrics
    // (We'll add AI translation in the next step)
    console.log('✅ Step 1 complete: French lyrics found');
    console.log('⏳ Step 2: AI translation (coming next...)');

    res.json({
      success: true,
      title,
      artist,
      originalLyrics: lyricsResult.lyrics,
      translatedLyrics: '[English translation will appear here once OpenAI integration is added]',
      source: lyricsResult.source,
      status: 'Lyrics found - Translation pending'
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});