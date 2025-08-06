import { useState } from 'react';

// Song Input Form Component
function SongInputForm({ onSearchComplete }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate the search and translation process
    console.log('Searching for lyrics:', { title, artist, language: 'French' });
    
    // Mock the backend workflow:
    // 1. Search for lyrics using "paroles" + title + artist
    // 2. Scrape and parse lyrics from found page
    // 3. Send to AI for translation
    // 4. Return both original and translated lyrics
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsLoading(false);
    
    // Pass the search data to parent
    onSearchComplete({ title, artist });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Mondelody
        </h1>
        
        <p className="text-sm text-gray-600 mb-6 text-center">
          {isLoading ? (
            <span className="text-blue-600 font-medium">
              🔍 Searching for French lyrics and translating...
            </span>
          ) : (
            "Translate French song lyrics to English"
          )}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Song Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Artist
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Enter artist name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
              🇫🇷 French
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !artist.trim() || isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching for lyrics...
              </>
            ) : (
              "Find & Translate Lyrics"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Lyrics Results Component
function LyricsResults({ songData, onNewSearch }) {
  // Mock data for now - this will come from your backend
  const mockResults = {
    title: songData.title,
    artist: songData.artist,
    originalLyrics: `Verse 1 in French would appear here
Line by line format
Preserving the structure
Of the original song

Chorus in French
With proper spacing
And line breaks
Maintaining readability`,
    translatedLyrics: `English translation would appear here
Line by line format
Preserving the structure
Of the original song

English chorus translation
With proper spacing
And line breaks
Maintaining readability`,
    source: "Found on paroles.net"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                "{mockResults.title}" by {mockResults.artist}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{mockResults.source}</p>
            </div>
            <button
              onClick={onNewSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              New Search
            </button>
          </div>
        </div>

        {/* Lyrics Display */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original French Lyrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-lg font-semibold text-gray-900 mr-2">🇫🇷 Original</span>
              <span className="text-sm text-gray-500">(French)</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
{mockResults.originalLyrics}
              </pre>
            </div>
          </div>

          {/* Translated English Lyrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-lg font-semibual text-gray-900 mr-2">🇺🇸 Translation</span>
              <span className="text-sm text-gray-500">(English)</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
{mockResults.translatedLyrics}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>How it works:</strong> We searched for "paroles {mockResults.title} {mockResults.artist}" to find the French lyrics, 
                then used AI translation to preserve the song's meaning and tone in English.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [currentView, setCurrentView] = useState('search'); // 'search' or 'results'
  const [searchData, setSearchData] = useState(null);

  const handleSearchComplete = (songData) => {
    setSearchData(songData);
    setCurrentView('results');
  };

  const handleNewSearch = () => {
    setCurrentView('search');
    setSearchData(null);
  };

  return (
    <>
      {currentView === 'search' && (
        <SongInputForm onSearchComplete={handleSearchComplete} />
      )}
      {currentView === 'results' && searchData && (
        <LyricsResults songData={searchData} onNewSearch={handleNewSearch} />
      )}
    </>
  );
}