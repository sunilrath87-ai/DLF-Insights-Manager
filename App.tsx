
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, Geography, MarketData, ProjectLaunch, GroundingSource, SharePrice, NewsArticle } from './types';
import { fetchMarketIntelligence, fetchCompetitiveIntelligence, fetchSharePrices, fetchIndiaNews, fetchInternationalNews } from './services/geminiService';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MarketIntelligence from './components/MarketIntelligence';
import CompetitiveIntelligence from './components/CompetitiveIntelligence';
import Sources from './components/Sources';
import LoadingSpinner from './components/LoadingSpinner';
import ExportControls from './components/ExportControls';
import SharePriceIndex from './components/SharePriceIndex';
import News from './components/News';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.MarketIntelligence);
  const [geography, setGeography] = useState<Geography>(Geography.India);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [projectLaunches, setProjectLaunches] = useState<ProjectLaunch[] | null>(null);
  const [sharePrices, setSharePrices] = useState<SharePrice[] | null>(null);
  const [indiaNews, setIndiaNews] = useState<NewsArticle[] | null>(null);
  const [internationalNews, setInternationalNews] = useState<NewsArticle[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const [marketSources, setMarketSources] = useState<GroundingSource[]>([]);
  const [competitiveSources, setCompetitiveSources] = useState<GroundingSource[]>([]);
  const [sharePriceSources, setSharePriceSources] = useState<GroundingSource[]>([]);
  const [indiaNewsSources, setIndiaNewsSources] = useState<GroundingSource[]>([]);
  const [internationalNewsSources, setInternationalNewsSources] = useState<GroundingSource[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Check for cached data from today
    const cacheString = localStorage.getItem('dlfInsightsCache');
    if (cacheString) {
      const cache = JSON.parse(cacheString);
      const cacheDate = new Date(cache.timestamp).toDateString();
      const todayDate = new Date().toDateString();

      if (cacheDate === todayDate) {
        console.log("Loading data from cache.");
        setMarketData(cache.marketData);
        setMarketSources(cache.marketSources);
        setProjectLaunches(cache.projectLaunches);
        setCompetitiveSources(cache.competitiveSources);
        setSharePrices(cache.sharePrices);
        setSharePriceSources(cache.sharePriceSources);
        setIndiaNews(cache.indiaNews);
        setIndiaNewsSources(cache.indiaNewsSources);
        setInternationalNews(cache.internationalNews);
        setInternationalNewsSources(cache.internationalNewsSources);
        setGeography(cache.geography);
        setLastUpdated(new Date(cache.timestamp));
        setLoading(false);
        return;
      }
    }

    console.log("Fetching new data for the day.");
    try {
      // Fetch all data once for the default geography
      const defaultGeography = Geography.India;
      const results = await Promise.all([
        fetchMarketIntelligence(defaultGeography),
        fetchCompetitiveIntelligence(defaultGeography),
        fetchSharePrices(),
        fetchIndiaNews(),
        fetchInternationalNews()
      ]);

      const newTimestamp = new Date();
      
      const newCache = {
        timestamp: newTimestamp.toISOString(),
        geography: defaultGeography,
        marketData: results[0].data,
        marketSources: results[0].sources,
        projectLaunches: results[1].launches,
        competitiveSources: results[1].sources,
        sharePrices: results[2].data,
        sharePriceSources: results[2].sources,
        indiaNews: results[3].data,
        indiaNewsSources: results[3].sources,
        internationalNews: results[4].data,
        internationalNewsSources: results[4].sources,
      };

      // Set application state
      setMarketData(newCache.marketData);
      setMarketSources(newCache.marketSources);
      setProjectLaunches(newCache.projectLaunches);
      setCompetitiveSources(newCache.competitiveSources);
      setSharePrices(newCache.sharePrices);
      setSharePriceSources(newCache.sharePriceSources);
      setIndiaNews(newCache.indiaNews);
      setIndiaNewsSources(newCache.indiaNewsSources);
      setInternationalNews(newCache.internationalNews);
      setInternationalNewsSources(newCache.internationalNewsSources);
      setGeography(newCache.geography);
      setLastUpdated(newTimestamp);
      
      // Store new data in cache
      localStorage.setItem('dlfInsightsCache', JSON.stringify(newCache));

    } catch (err) {
      console.error(err);
      setError('Failed to fetch intelligence data. The AI model may be overloaded. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const renderPage = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <div className="text-center text-red-400 font-semibold p-8">{error}</div>;
    }
    switch (currentPage) {
      case Page.MarketIntelligence:
        return <MarketIntelligence data={marketData} />;
      case Page.CompetitiveIntelligence:
        return <CompetitiveIntelligence data={projectLaunches} />;
      case Page.SharePriceIndex:
        return <SharePriceIndex data={sharePrices} />;
      case Page.IndiaNews:
        return <News data={indiaNews} title="Top 5 India Real Estate News" />;
      case Page.InternationalNews:
        return <News data={internationalNews} title="Top 5 International Real Estate News" />;
      case Page.Sources:
        return <Sources 
                  marketSources={marketSources} 
                  competitiveSources={competitiveSources}
                  sharePriceSources={sharePriceSources}
                  indiaNewsSources={indiaNewsSources}
                  internationalNewsSources={internationalNewsSources} 
                />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-300 flex flex-col">
      <Header
        geography={geography}
        setGeography={setGeography}
        lastUpdated={lastUpdated}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <ExportControls elementRef={contentRef} />
        </div>
        
        <div ref={contentRef} className="bg-slate-800/50 p-6 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-sm">
          {renderPage()}
        </div>
      </main>
      <footer className="py-4 text-xs text-slate-400 border-t border-slate-800 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-200">DLF Insights Manager</p>
              <p>Residential Market Intelligence. Simplified.</p>
            </div>
            <div className="text-right">
              <p>Marketing-powered, Business-governed</p>
              <p className="font-bold text-violet-400 mt-1">Powered by Marketing</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;