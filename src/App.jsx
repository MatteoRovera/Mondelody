import { useState, useEffect } from 'react';

// Song Input Form Component (unchanged)
function SongInputForm({ onSearchComplete }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Calling backend');
      
      // Make API call to backend
      const response = await fetch('http://localhost:3001/api/search-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          artist: artist.trim()
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Backend response:', data);
        // Pass the search data to parent
        onSearchComplete({ title, artist, ...data });
      } else {
        console.error('Backend error:', data.error);
        alert(`Error: ${data.error}`);
      }
      
    } catch (error) {
      console.error('Network error:', error);
      alert('Failed to connect to backend API...');
    } finally {
      setIsLoading(false);
    }
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
              🔍 Finding lyrics and translating...
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
              🇺🇸 English
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

// Animated Line Component
function AnimatedLyricLine({ originalText, translatedText, lineIndex, animationMode, initialDelay }) {
  const [currentText, setCurrentText] = useState(originalText);
  const [showingOriginal, setShowingOriginal] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false);

  // Initial animation from French to English
  useEffect(() => {
    if (animationMode && !hasStartedAnimation) {
      const timer = setTimeout(() => {
        setHasStartedAnimation(true);
        setIsAnimating(true);
        
        setTimeout(() => {
          setCurrentText(translatedText);
          setShowingOriginal(false);
          setIsAnimating(false);
        }, 300);
      }, initialDelay);

      return () => clearTimeout(timer);
    }
  }, [animationMode, translatedText, initialDelay, hasStartedAnimation]);

  // Handle click to toggle between languages
  const handleClick = () => {
    if (animationMode && !isAnimating) {
      setIsAnimating(true);
      
      setTimeout(() => {
        if (showingOriginal) {
          setCurrentText(translatedText);
          setShowingOriginal(false);
        } else {
          setCurrentText(originalText);
          setShowingOriginal(true);
        }
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div 
      className={`transition-all duration-300 ${
        animationMode 
          ? `cursor-pointer hover:bg-blue-50 hover:shadow-sm rounded px-2 py-1 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }` 
          : ''
      }`}
      onClick={handleClick}
    >
      {currentText}
    </div>
  );
}

// Enhanced Lyrics Results Component
function LyricsResults({ songData, onNewSearch }) {
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' or 'animated'
  const [animationStarted, setAnimationStarted] = useState(false);

  const results = {
    title: songData.title,
    artist: songData.artist,
    originalLyrics: songData.originalLyrics || 'No lyrics found',
    translatedLyrics: songData.translatedLyrics || 'Translation not available',
    source: songData.source || 'Unknown source',
    status: songData.status || 'Unknown status'
  };

  // Parse lyrics into lines
  const originalLines = results.originalLyrics.split('\n');
  const translatedLines = results.translatedLyrics.split('\n');

  // Start animation when switching to animated mode
  useEffect(() => {
    if (viewMode === 'animated') {
      setAnimationStarted(true);
    }
  }, [viewMode]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'animated') {
      setAnimationStarted(false);
      setTimeout(() => setAnimationStarted(true), 100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                "{results.title}" by {results.artist}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{results.source}</p>
              <p className="text-xs text-green-600 mt-1">Detected Language: French 🇫🇷</p>
              {results.status && (
                <p className="text-xs text-blue-600 mt-1">Status: {results.status}</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleViewModeChange('side-by-side')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'side-by-side' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => handleViewModeChange('animated')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'animated' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Animated
                </button>
              </div>

              <button
                onClick={onNewSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                New Search
              </button>
            </div>
          </div>
        </div>

        {/* Lyrics Display */}
        {viewMode === 'side-by-side' ? (
          // Original side-by-side view
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original French Lyrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <span className="text-lg font-semibold text-gray-900 mr-2">🇫🇷 Original</span>
                <span className="text-sm text-gray-500">(French)</span>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
{results.originalLyrics}
                </pre>
              </div>
            </div>

            {/* Translated English Lyrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <span className="text-lg font-semibold text-gray-900 mr-2">🇺🇸 Translation</span>
                <span className="text-sm text-gray-500">(English)</span>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
{results.translatedLyrics}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          // New animated overlay view
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900 mr-2">Interactive Translation</span>
                <span className="text-sm text-gray-500">(Click any line to toggle language)</span>
              </div>
              <div className="text-sm text-blue-600">
                🇫🇷 → 🇺🇸 Auto-translating...
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans space-y-1">
                {originalLines.map((originalLine, index) => (
                  <AnimatedLyricLine
                    key={index}
                    originalText={originalLine}
                    translatedText={translatedLines[index] || originalLine}
                    lineIndex={index}
                    animationMode={animationStarted}
                    initialDelay={index * 200 + 1000} // Stagger animation by 200ms per line, start after 1s
                  />
                ))}
              </div>
            </div>
          </div>
        )}

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
                <strong>How it works:</strong> Searched "paroles {results.title} {results.artist}" to find the French lyrics, 
                then used AI translation to preserve the song's meaning and tone in English.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component (unchanged)
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