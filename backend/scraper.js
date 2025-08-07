const axios = require('axios');
const cheerio = require('cheerio');

class LyricsScraper {
  constructor() {
    // We'll use multiple strategies instead of relying on exact URLs
    this.searchStrategies = [
      'directSiteSearch',
      'googleSearch', 
      'fallbackMock'
    ];
  }

  // Main search function with multiple fallback strategies
  async searchFrenchLyrics(title, artist) {
    console.log(`🔍 Searching for: "${title}" by ${artist}`);
    
    for (const strategy of this.searchStrategies) {
      try {
        console.log(`📡 Trying strategy: ${strategy}`);
        
        let result = null;
        switch (strategy) {
          case 'directSiteSearch':
            result = await this.tryDirectSiteSearch(title, artist);
            break;
          case 'googleSearch':
            result = await this.tryGoogleSearch(title, artist);
            break;
          case 'fallbackMock':
            result = await this.generateTestLyrics(title, artist);
            break;
        }
        
        if (result && result.success) {
          console.log(`✅ Success with strategy: ${strategy}`);
          return result;
        }
        
      } catch (error) {
        console.log(`❌ Strategy ${strategy} failed:`, error.message);
        continue; // Try next strategy
      }
    }
    
    return {
      success: false,
      error: 'All search strategies failed'
    };
  }

  // Try multiple direct site search approaches
  async tryDirectSiteSearch(title, artist) {
    console.log('📡 Trying flexible site searches...');
    
    // Multiple URL patterns to try
    const urlPatterns = [
      // paroles.net patterns
      `https://www.paroles.net/${this.cleanForUrl(artist)}/paroles-${this.cleanForUrl(title)}`,
      `https://www.paroles.net/${this.cleanForUrl(artist)}/${this.cleanForUrl(title)}`,
      
      // genius.com patterns  
      `https://genius.com/${this.cleanForUrl(artist)}-${this.cleanForUrl(title)}-lyrics`,
      
      // Add more patterns as needed
    ];

    for (const url of urlPatterns) {
      try {
        console.log(`🔗 Trying URL: ${url}`);
        const lyrics = await this.scrapePage(url, this.getSiteFromUrl(url));
        
        if (lyrics && lyrics.length > 50) {
          return {
            success: true,
            lyrics: lyrics,
            source: this.getSiteFromUrl(url)
          };
        }
      } catch (error) {
        console.log(`❌ URL failed: ${url.substring(0, 50)}...`);
        continue;
      }
    }
    
    return null;
  }

  // Implement a simple Google-like search simulation
  async tryGoogleSearch(title, artist) {
    console.log('🔍 Simulating search engine approach...');
    
    // For now, we'll implement a mock "intelligent search"
    // In production, you could use:
    // - SerpAPI for Google results
    // - Bing Search API  
    // - Custom search engines
    
    const searchTerms = [
      `"${title}" "${artist}" paroles lyrics`,
      `${title} ${artist} paroles francais`,
      `${artist} ${title} lyrics french`
    ];
    
    // This is a placeholder - would integrate with real search API
    console.log('Search terms generated:', searchTerms);
    
    // For now, return null to move to next strategy
    return null;
  }

  // Generate test lyrics for development/demo
  async generateTestLyrics(title, artist) {
    console.log('🎭 Generating test lyrics for demo...');
    
    // Create realistic-looking French lyrics structure for demo
    const testLyrics = `[Couplet 1]
Dans les rues de Paris
Je pense à notre histoire
${title}, tu es partie
Mais je garde l'espoir

[Refrain]
${title}, ${title}
Reviens-moi ce soir
${title}, ${title}  
Dans mon cœur tu peux voir

[Couplet 2]
${artist} me chantait
Cette chanson d'amour
Maintenant je sais
Que l'amour dure toujours

[Refrain]
${title}, ${title}
Reviens-moi ce soir
${title}, ${title}
Dans mon cœur tu peux voir

[Pont]
Les souvenirs dansent
Dans la lumière du matin
Notre amour recommence
Comme un nouveau refrain

[Note: Ces paroles sont générées pour démonstration]`;

    return {
      success: true,
      lyrics: testLyrics,
      source: 'Demo lyrics (development mode)'
    };
  }

  // Improved page scraping with multiple selectors
  async scrapePage(url, siteName) {
    console.log(`📄 Scraping ${siteName}: ${url}`);
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.8,en-US;q=0.5,en;q=0.3',
          'Referer': 'https://www.google.com/',
        },
        timeout: 10000,
        maxRedirects: 3
      });

      const $ = cheerio.load(response.data);
      return this.extractLyricsFromPage($, siteName);
      
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`❌ Page not found: ${url}`);
      } else {
        console.log(`❌ Scraping error:`, error.message);
      }
      return null;
    }
  }

  // Universal lyrics extraction with many possible selectors
  extractLyricsFromPage($, siteName) {
    const selectors = [
      // paroles.net selectors
      '.song-text', '.lyrics', '.paroles', '[class*="lyrics"]', '[class*="paroles"]',
      
      // genius.com selectors  
      '[data-lyrics-container="true"]', '.Lyrics__Container-sc-1ynbvzw-6',
      
      // Generic selectors
      '.song-lyrics', '#lyrics', '.lyric-text', '[id*="lyrics"]',
      'div[class*="song"] div[class*="text"]', '.content .lyrics',
      
      // Last resort - look for divs with lots of text
      'div:contains("couplet")', 'div:contains("refrain")', 'div:contains("verse")'
    ];

    for (const selector of selectors) {
      try {
        const element = $(selector).first();
        if (element.length > 0) {
          let text = element.text().trim();
          
          // Validate that this looks like lyrics
          if (this.looksLikeLyrics(text)) {
            console.log(`✅ Found lyrics using selector: ${selector}`);
            return this.cleanLyrics(text);
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    console.log('❌ No lyrics found with any selector');
    return null;
  }

  // Check if text looks like song lyrics
  looksLikeLyrics(text) {
    if (!text || text.length < 50) return false;
    
    // Look for lyric-like patterns
    const lyricsIndicators = [
      /\n.*\n/,  // Multiple lines
      /(couplet|refrain|verse|chorus)/i,  // Song structure words
      /\n\s*\n/,  // Empty lines (typical in lyrics)
      /.{10,}[\n\r].{10,}/  // Multiple substantial lines
    ];
    
    return lyricsIndicators.some(pattern => pattern.test(text));
  }

  // Enhanced lyrics cleaning that preserves structure
  cleanLyrics(text) {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n')   // Handle old Mac line endings
      .replace(/\n\s*\n\s*\n+/g, '\n\n') // Multiple blank lines → double newline
      .replace(/^\s+|\s+$/g, '') // Trim start and end
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0) // Remove completely empty lines
      .join('\n')
      .replace(/\n\n\n+/g, '\n\n'); // Ensure max 2 consecutive newlines
  }

  // Helper to get site name from URL
  getSiteFromUrl(url) {
    if (url.includes('paroles.net')) return 'paroles.net';
    if (url.includes('genius.com')) return 'genius.com';
    return 'Unknown site';
  }

  // More flexible URL cleaning
  cleanForUrl(str) {
    return str
      .toLowerCase()
      .replace(/[àáâäæãåā]/g, 'a')
      .replace(/[èéêëēėę]/g, 'e') 
      .replace(/[îïíīįì]/g, 'i')
      .replace(/[ôöòóøōõ]/g, 'o')
      .replace(/[ûüùúū]/g, 'u')
      .replace(/[ÿỳýÿ]/g, 'y')
      .replace(/[ñń]/g, 'n')
      .replace(/[çć]/g, 'c')
      .replace(/[^a-z0-9\s]/g, '') // Remove remaining special chars
      .replace(/\s+/g, '-') // Spaces → hyphens
      .replace(/-+/g, '-') // Multiple hyphens → single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .trim();
  }
}

module.exports = LyricsScraper;